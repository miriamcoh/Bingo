-- =====================================================================
--  הבינגו של אילה – מבנה מסד הנתונים (Supabase / Postgres)
--  מדביקים את כל הקובץ ב-SQL Editor של Supabase ולוחצים Run.
--  בטוח להריץ שוב (הקובץ יודע לעדכן את עצמו).
-- =====================================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------
--  טבלאות ציבוריות (כולם יכולים לקרוא – אין בהן סודות)
-- ---------------------------------------------------------------------
create table if not exists public.rooms (
  id           uuid primary key default gen_random_uuid(),
  code         text not null unique,
  status       text not null default 'lobby'
               check (status in ('lobby', 'playing', 'tiebreak', 'finished')),
  drawn        int[] not null default '{}',      -- המספרים שהוגרלו, לפי הסדר
  tie_deadline timestamptz,                      -- סוף חלון התיקו (15 שניות)
  game_no      int not null default 1,           -- עולה בכל "משחק חדש"
  created_at   timestamptz not null default now()
);

create table if not exists public.players (
  id            uuid primary key default gen_random_uuid(),
  room_id       uuid not null references public.rooms(id) on delete cascade,
  name          text not null check (char_length(name) between 1 and 20),
  avatar        text not null,
  remaining     int not null default 10,         -- כמה מספרים נשארו לסמן
  finished_draw int,                             -- אחרי כמה הגרלות סיים את הכרטיס
  finished_at   timestamptz,                     -- מתי בדיוק סימן את המספר האחרון
  place         int,                             -- מקום בדירוג (רק למנצחים)
  created_at    timestamptz not null default now()
);
create index if not exists players_room_idx on public.players(room_id);

-- הגדרות החגיגה: שם בעל/ת השמחה, הגיל והעיצוב (ורוד / תכלת)
alter table public.rooms add column if not exists celebrant_name text not null default 'אילה';
alter table public.rooms add column if not exists celebrant_age int;
alter table public.rooms add column if not exists theme text not null default 'pink';
alter table public.rooms drop constraint if exists rooms_celebration_check;
alter table public.rooms add constraint rooms_celebration_check check (
  char_length(celebrant_name) between 1 and 20
  and (celebrant_age is null or celebrant_age between 0 and 120)
  and theme in ('pink', 'blue')
);

-- ---------------------------------------------------------------------
--  טבלאות סודיות (אי אפשר לקרוא אותן מהדפדפן בכלל)
-- ---------------------------------------------------------------------
create table if not exists public.room_secrets (
  room_id    uuid primary key references public.rooms(id) on delete cascade,
  host_token uuid not null default gen_random_uuid()
);

create table if not exists public.player_secrets (
  player_id uuid primary key references public.players(id) on delete cascade,
  token     uuid not null default gen_random_uuid(),
  card      int[] not null,                      -- 10 המספרים של הכרטיס
  marked    int[] not null default '{}'          -- מה השחקן כבר סימן
);

-- ---------------------------------------------------------------------
--  הרשאות: קריאה בלבד לטבלאות הציבוריות, כלום לטבלאות הסודיות.
--  כל שינוי עובר רק דרך הפונקציות למטה, שבודקות הכול בשרת.
-- ---------------------------------------------------------------------
alter table public.rooms          enable row level security;
alter table public.players        enable row level security;
alter table public.room_secrets   enable row level security;
alter table public.player_secrets enable row level security;

drop policy if exists "rooms are readable" on public.rooms;
create policy "rooms are readable" on public.rooms for select using (true);

drop policy if exists "players are readable" on public.players;
create policy "players are readable" on public.players for select using (true);

revoke all on public.rooms, public.players, public.room_secrets, public.player_secrets
  from anon, authenticated;
grant select on public.rooms, public.players to anon, authenticated;

-- ---------------------------------------------------------------------
--  פונקציות עזר פנימיות
-- ---------------------------------------------------------------------
create or replace function public._new_card()
returns int[] language sql volatile set search_path = public as $$
  select array_agg(n order by n)
  from (select n from generate_series(1, 100) n order by random() limit 10) s;
$$;

-- מחזיר את החדר (נעול לעדכון) רק אם הטוקן של המנהל נכון
create or replace function public._host_room(p_code text, p_host_token uuid)
returns public.rooms language plpgsql security definer set search_path = public as $$
declare v public.rooms;
begin
  select r.* into v
  from public.rooms r join public.room_secrets s on s.room_id = r.id
  where r.code = upper(trim(p_code)) and s.host_token = p_host_token
  for update of r;
  if not found then raise exception 'NOT_HOST'; end if;
  return v;
end $$;

-- אם חלון התיקו נגמר – מסיים את המשחק
create or replace function public._finalize_if_due(p_room_id uuid)
returns void language sql security definer set search_path = public as $$
  update public.rooms set status = 'finished'
  where id = p_room_id and status = 'tiebreak' and now() >= tie_deadline;
$$;

revoke all on function public._new_card() from public, anon, authenticated;
revoke all on function public._host_room(text, uuid) from public, anon, authenticated;
revoke all on function public._finalize_if_due(uuid) from public, anon, authenticated;

-- ---------------------------------------------------------------------
--  פונקציות למנהל
-- ---------------------------------------------------------------------
-- בודק ומנקה את הגדרות החגיגה
create or replace function public._check_celebration(p_name text, p_age int, p_theme text)
returns void language plpgsql set search_path = public as $$
begin
  if p_name is null or char_length(trim(p_name)) < 1 or char_length(trim(p_name)) > 20 then
    raise exception 'BAD_CELEBRANT';
  end if;
  if p_age is not null and (p_age < 0 or p_age > 120) then raise exception 'BAD_AGE'; end if;
  if p_theme not in ('pink', 'blue') then raise exception 'BAD_THEME'; end if;
end $$;
revoke all on function public._check_celebration(text, int, text) from public, anon, authenticated;

drop function if exists public.create_room();
create or replace function public.create_room(p_name text, p_age int, p_theme text)
returns json language plpgsql security definer set search_path = public as $$
declare
  alphabet text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  v_code text; v_room uuid; v_token uuid; i int;
begin
  perform public._check_celebration(p_name, p_age, p_theme);
  loop
    v_code := '';
    for i in 1..5 loop
      v_code := v_code || substr(alphabet, 1 + floor(random() * length(alphabet))::int, 1);
    end loop;
    exit when not exists (select 1 from public.rooms where code = v_code);
  end loop;
  insert into public.rooms (code, celebrant_name, celebrant_age, theme)
  values (v_code, trim(p_name), p_age, p_theme) returning id into v_room;
  insert into public.room_secrets (room_id) values (v_room) returning host_token into v_token;
  return json_build_object('code', v_code, 'host_token', v_token);
end $$;

-- המנהל יכול לתקן את השם / הגיל / העיצוב
create or replace function public.update_celebration(p_code text, p_host_token uuid, p_name text, p_age int, p_theme text)
returns void language plpgsql security definer set search_path = public as $$
declare v public.rooms;
begin
  v := public._host_room(p_code, p_host_token);
  perform public._check_celebration(p_name, p_age, p_theme);
  update public.rooms
     set celebrant_name = trim(p_name), celebrant_age = p_age, theme = p_theme
   where id = v.id;
end $$;

create or replace function public.start_game(p_code text, p_host_token uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v public.rooms;
begin
  v := public._host_room(p_code, p_host_token);
  if v.status <> 'lobby' then raise exception 'NOT_LOBBY'; end if;
  update public.rooms set status = 'playing' where id = v.id;
end $$;

create or replace function public.draw_number(p_code text, p_host_token uuid)
returns int language plpgsql security definer set search_path = public as $$
declare v public.rooms; v_n int;
begin
  v := public._host_room(p_code, p_host_token);
  -- בזמן חלון התיקו אסור להגריל (הסגירה עצמה נעשית ב-finalize_room)
  if v.status = 'tiebreak' then raise exception 'TIE_WINDOW'; end if;
  if v.status <> 'playing' then raise exception 'NOT_PLAYING'; end if;

  select n into v_n from generate_series(1, 100) n
  where not (n = any (v.drawn))
  order by random() limit 1;
  if v_n is null then raise exception 'ALL_DRAWN'; end if;

  update public.rooms set drawn = drawn || v_n where id = v.id;
  return v_n;
end $$;

create or replace function public.end_game(p_code text, p_host_token uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v public.rooms;
begin
  v := public._host_room(p_code, p_host_token);
  update public.rooms set status = 'finished' where id = v.id;
end $$;

create or replace function public.new_game(p_code text, p_host_token uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v public.rooms;
begin
  v := public._host_room(p_code, p_host_token);
  update public.rooms
     set status = 'lobby', drawn = '{}', tie_deadline = null, game_no = game_no + 1
   where id = v.id;
  update public.player_secrets s
     set card = public._new_card(), marked = '{}'
    from public.players p
   where p.id = s.player_id and p.room_id = v.id;
  update public.players
     set remaining = 10, finished_draw = null, finished_at = null, place = null
   where room_id = v.id;
end $$;

-- ---------------------------------------------------------------------
--  פונקציות לשחקנים
-- ---------------------------------------------------------------------
create or replace function public.join_room(p_code text, p_name text, p_avatar text)
returns json language plpgsql security definer set search_path = public as $$
declare v public.rooms; v_name text := trim(p_name); v_player uuid; v_token uuid;
begin
  select * into v from public.rooms where code = upper(trim(p_code));
  if not found then raise exception 'ROOM_NOT_FOUND'; end if;
  if v_name is null or char_length(v_name) < 1 or char_length(v_name) > 20 then
    raise exception 'BAD_NAME';
  end if;
  if p_avatar is null or p_avatar !~ '^[a-z]{2,15}$' then raise exception 'BAD_AVATAR'; end if;
  if (select count(*) from public.players where room_id = v.id) >= 200 then
    raise exception 'ROOM_FULL';
  end if;

  insert into public.players (room_id, name, avatar)
  values (v.id, v_name, p_avatar) returning id into v_player;
  insert into public.player_secrets (player_id, card)
  values (v_player, public._new_card()) returning token into v_token;

  return json_build_object('player_id', v_player, 'token', v_token);
end $$;

-- מחזיר רק את הכרטיס של השחקן עצמו (בעזרת הטוקן הסודי שלו)
create or replace function public.get_my_card(p_player_id uuid, p_token uuid)
returns json language plpgsql security definer set search_path = public as $$
declare v_card int[]; v_marked int[];
begin
  select card, marked into v_card, v_marked
  from public.player_secrets where player_id = p_player_id and token = p_token;
  if not found then raise exception 'BAD_TOKEN'; end if;
  return json_build_object('card', v_card, 'marked', v_marked);
end $$;

-- סימון מספר: כל הבדיקות כאן, בשרת
create or replace function public.mark_number(p_player_id uuid, p_token uuid, p_number int)
returns json language plpgsql security definer set search_path = public as $$
declare
  v_room public.rooms;
  v_room_id uuid;
  v_card int[]; v_marked int[];
  v_remaining int; v_place int; v_winners int; v_draws int;
begin
  select p.room_id, s.card, s.marked into v_room_id, v_card, v_marked
  from public.players p join public.player_secrets s on s.player_id = p.id
  where p.id = p_player_id and s.token = p_token;
  if not found then raise exception 'BAD_TOKEN'; end if;

  -- נועלים את החדר כדי שסימונים בו-זמניים יטופלו אחד אחרי השני
  select * into v_room from public.rooms where id = v_room_id for update;
  -- חלון התיקו נגמר = המשחק נגמר, גם אם עוד אף אחד לא קרא ל-finalize_room
  if v_room.status = 'tiebreak' and now() >= v_room.tie_deadline then
    v_room.status := 'finished';
  end if;

  if v_room.status not in ('playing', 'tiebreak') then raise exception 'NOT_PLAYING'; end if;
  if not (p_number = any (v_card)) then raise exception 'NOT_ON_CARD'; end if;
  if not (p_number = any (v_room.drawn)) then raise exception 'NOT_DRAWN'; end if;

  -- נקרא שוב אחרי הנעילה, למקרה של שתי לחיצות מהירות
  select marked into v_marked from public.player_secrets where player_id = p_player_id for update;
  if p_number = any (v_marked) then
    return json_build_object('marked', v_marked,
      'remaining', (select remaining from public.players where id = p_player_id),
      'place', (select place from public.players where id = p_player_id));
  end if;

  v_marked := v_marked || p_number;
  update public.player_secrets set marked = v_marked where player_id = p_player_id;

  select count(*) into v_remaining from unnest(v_card) c where not (c = any (v_marked));
  update public.players set remaining = v_remaining where id = p_player_id;

  if v_remaining = 0 then
    v_draws := cardinality(v_room.drawn);
    select count(*) into v_winners from public.players
     where room_id = v_room.id and place is not null;

    if v_winners < 5 then
      -- מקום = 1 + מספר המנצחים שסיימו אחרי הגרלה מוקדמת יותר (דירוג "קופץ" בתיקו)
      select 1 + count(*) into v_place from public.players
       where room_id = v_room.id and place is not null and finished_draw < v_draws;
      update public.players
         set finished_draw = v_draws, finished_at = clock_timestamp(), place = v_place
       where id = p_player_id;
      v_winners := v_winners + 1;

      if v_room.status = 'playing' and v_winners >= 3 then
        update public.rooms
           set status = 'tiebreak', tie_deadline = now() + interval '15 seconds'
         where id = v_room.id;
      end if;
    else
      update public.players
         set finished_draw = v_draws, finished_at = clock_timestamp()
       where id = p_player_id;
    end if;
  end if;

  return json_build_object('marked', v_marked, 'remaining', v_remaining, 'place', v_place);
end $$;

-- כל אחד יכול לבקש לסגור את המשחק כשחלון התיקו נגמר (השרת בודק את השעה)
create or replace function public.finalize_room(p_code text)
returns text language plpgsql security definer set search_path = public as $$
declare v_id uuid; v_status text;
begin
  select id into v_id from public.rooms where code = upper(trim(p_code));
  if not found then raise exception 'ROOM_NOT_FOUND'; end if;
  perform public._finalize_if_due(v_id);
  select status into v_status from public.rooms where id = v_id;
  return v_status;
end $$;

grant execute on function
  public.create_room(text, int, text),
  public.update_celebration(text, uuid, text, int, text),
  public.start_game(text, uuid),
  public.draw_number(text, uuid),
  public.end_game(text, uuid),
  public.new_game(text, uuid),
  public.join_room(text, text, text),
  public.get_my_card(uuid, uuid),
  public.mark_number(uuid, uuid, int),
  public.finalize_room(text)
to anon, authenticated;

-- ---------------------------------------------------------------------
--  Realtime: לשדר שינויים בחדרים ובשחקנים לכל הטלפונים
-- ---------------------------------------------------------------------
do $$ begin
  alter publication supabase_realtime add table public.rooms;
exception when duplicate_object then null; end $$;
do $$ begin
  alter publication supabase_realtime add table public.players;
exception when duplicate_object then null; end $$;

export type RoomStatus = "lobby" | "playing" | "tiebreak" | "finished";

export interface Room {
  id: string;
  code: string;
  status: RoomStatus;
  drawn: number[];
  tie_deadline: string | null;
  game_no: number;
  created_at: string;
}

export interface Player {
  id: string;
  room_id: string;
  name: string;
  avatar: string;
  remaining: number;
  finished_draw: number | null;
  finished_at: string | null;
  place: number | null;
  created_at: string;
}

export interface MyCard {
  card: number[];
  marked: number[];
}

export const CARD_SIZE = 10;
export const MAX_NUMBER = 100;
export const TIE_WINDOW_SECONDS = 15;

/** Winners first (by place, then who finished first), then closest to finishing. */
export function sortPlayers(players: Player[]): Player[] {
  return [...players].sort((a, b) => {
    if (a.place != null && b.place != null) {
      if (a.place !== b.place) return a.place - b.place;
      return (a.finished_at ?? "").localeCompare(b.finished_at ?? "");
    }
    if (a.place != null) return -1;
    if (b.place != null) return 1;
    if (a.remaining !== b.remaining) return a.remaining - b.remaining;
    return a.created_at.localeCompare(b.created_at);
  });
}

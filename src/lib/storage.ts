// localStorage יכול להיות חסום (למשל בגלישה בסתר) – לכן הכול עטוף ב-try/catch

export interface PlayerSession {
  playerId: string;
  token: string;
}

const hostKey = (code: string) => `bingo:host:${code.toUpperCase()}`;
const playerKey = (code: string) => `bingo:player:${code.toUpperCase()}`;

function read(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string | null) {
  try {
    if (value === null) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, value);
  } catch {
    /* ignore */
  }
}

export const getHostToken = (code: string) => read(hostKey(code));
export const setHostToken = (code: string, token: string) => write(hostKey(code), token);

export function getPlayerSession(code: string): PlayerSession | null {
  const raw = read(playerKey(code));
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as PlayerSession;
    return parsed.playerId && parsed.token ? parsed : null;
  } catch {
    return null;
  }
}

export const setPlayerSession = (code: string, s: PlayerSession | null) =>
  write(playerKey(code), s ? JSON.stringify(s) : null);

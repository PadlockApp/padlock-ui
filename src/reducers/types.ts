export type DbState = any | null;
export type FfsState = any | null;
export type ErrorState = string;

export type State = { db: DbState, ffs: FfsState, error: ErrorState };

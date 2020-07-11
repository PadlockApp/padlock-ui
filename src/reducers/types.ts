export type DbState = null;
export type FfsState = null;
export type ErrorState = string;

export type State = { db: DbState, ffs: FfsState, error: ErrorState };

import { Ffs } from "../actions/types";

export type DbState = object | null;
export type FfsState = Ffs | null;
export type ErrorState = string;

export type State = { db: DbState, ffs: FfsState, error: ErrorState };

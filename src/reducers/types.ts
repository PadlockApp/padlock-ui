import { CombinedState } from 'redux';

export type DbState = any | null;
export type FfsState = any | null;
export type ErrorState = string;

export type State = CombinedState<{ db: DbState, ffs: FfsState, error: ErrorState }>;

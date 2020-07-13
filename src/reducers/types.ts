import { Ffs } from "../actions/types";

export type DbState = object | null;
export type FfsState = Ffs | null;
export type SpaceDaemonState = object | null;
export type ErrorState = string;

export type State = { db: DbState, ffs: FfsState, spaceDaemon: SpaceDaemonState, error: ErrorState };

import { HttpError } from "./error";

export interface ListResult<T> {
    data?: T[];
    total?: number;
    error?: HttpError;
}

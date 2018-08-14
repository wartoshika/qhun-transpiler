export class UnexpectedError extends Error {

    constructor(message?: string) {
        super(message);

        (this as any).__proto__ = UnexpectedError.prototype;
    }
}

export class FileNotExistsError extends Error {

    constructor(message?: string) {
        super(message);

        (this as any).__proto__ = FileNotExistsError.prototype;
    }
}

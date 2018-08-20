export class ValidationError extends Error {

    constructor(errors?: string[]) {
        super(`Some errors occured while validating the config file.\n${errors.join("\n")}`);

        (this as any).__proto__ = ValidationError.prototype;
    }
}

import { ValidatorErrors } from "../config/validator/Validator";

export class ValidationError extends Error {

    constructor(errors?: ValidatorErrors) {
        super(`Some errors occured while validating the given data:\n${
            Object.keys(errors).map(key => {
                return `${key}: ${errors[key]}`;
            }).join("\n")
            }`);

        (this as any).__proto__ = ValidationError.prototype;
    }
}

/**
 * an error that is used for diagnostic errors
 */
export class DiagnosticError extends Error {

    constructor(message?: string) {
        super(message);

        (this as any).__proto__ = DiagnosticError.prototype;
    }
}

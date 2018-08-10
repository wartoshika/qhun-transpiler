import * as ts from "typescript";

export class UnsupportedError extends Error {

    constructor(
        message: string,
        public node: ts.Node
    ) {
        super(message);
    }
}

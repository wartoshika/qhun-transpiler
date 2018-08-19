import * as ts from "typescript";
import { ErrorWithNode } from "./ErrorWithNode";

export class UnsupportedError extends ErrorWithNode {

    constructor(
        message: string,
        node: ts.Node
    ) {
        super(message, node);
        (this as any).__proto__ = UnsupportedError.prototype;
    }
}

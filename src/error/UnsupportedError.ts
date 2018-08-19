import * as ts from "typescript";
import { ErrorWithNode } from "./ErrorWithNode";

export class UnsupportedError extends ErrorWithNode {

    constructor(
        message: string,
        node: ts.Node,
        public bubble: boolean = false
    ) {
        super(message, node);
        (this as any).__proto__ = UnsupportedError.prototype;
    }
}

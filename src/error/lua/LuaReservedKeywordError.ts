import * as ts from "typescript";
import { ErrorWithNode } from "../ErrorWithNode";

export class LuaReservedKeywordError extends ErrorWithNode {

    constructor(
        usedReservedKeyword: string,
        node: ts.Node
    ) {

        // declare the message
        const message: string = `You are using an identifier that is reserved for lua. This identifier was: ${usedReservedKeyword}`;

        super(message, node);
        (this as any).__proto__ = LuaReservedKeywordError.prototype;
    }
}

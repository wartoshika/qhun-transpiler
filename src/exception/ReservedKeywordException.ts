import { NodeContainingException } from "./NodeContainingException";
import { Node } from "typescript";

export class ReservedKeywordException extends NodeContainingException {

    constructor(message: string, node: Node) {
        super(`The following identifier can not be used because it is a reserved keyword: ${message}`, node);

        (this as any).__proto__ = ReservedKeywordException.prototype;
    }
}
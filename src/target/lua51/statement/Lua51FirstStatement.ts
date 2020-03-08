import { PartialTranspiler, StatementTranspiler } from "../../../transpiler";
import { Node, VariableDeclarationList, VariableStatement } from "typescript";
import { UnsupportedNodeException } from "../../../exception/UnsupportedNodeException";

export class Lua51FirstStatement extends PartialTranspiler implements Partial<StatementTranspiler> {

    /**
     * @inheritdoc
     */
    public firstStatement(node: Node): string {

        // must not be transpiled
        return "";
    }
}
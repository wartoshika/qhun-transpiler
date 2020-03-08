import { PartialTranspiler, StatementTranspiler } from "../../../transpiler";
import { VariableStatement, SyntaxKind } from "typescript";

export class Lua51VariableStatement extends PartialTranspiler implements Partial<StatementTranspiler> {

    /**
     * @inheritdoc
     */
    public variableStatement(node: VariableStatement): string {

        // check if a declare modifier is present
        if (node.modifiers && node.modifiers.some(mod => mod.kind === SyntaxKind.DeclareKeyword)) {

            // when present, dont transpile this statement because this is an ambient declare
            // statement.
            return "";
        }

        // iterate the declaration list
        return this.transpiler.transpileNode(node.declarationList);
    }
}
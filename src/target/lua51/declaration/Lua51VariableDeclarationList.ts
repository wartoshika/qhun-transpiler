import { PartialTranspiler } from "../../../transpiler/impl/PartialTranspiler";
import { DeclarationTranspiler } from "../../../transpiler";
import { VariableDeclarationList } from "typescript";

export class Lua51VariableDeclarationList extends PartialTranspiler implements Partial<DeclarationTranspiler> {

    /**
     * @inheritdoc
     */
    public variableDeclarationList(node: VariableDeclarationList): string {

        // visit each declaration in the list
        return node.declarations
            .map(dec => this.transpiler.transpileNode(dec))
            .join(this.transpiler.break());
    }
}
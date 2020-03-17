import { PartialTranspiler } from "../../../transpiler/impl/PartialTranspiler";
import { DeclarationTranspiler } from "../../../transpiler";
import { MissingDeclaration } from "typescript";
import { UnsupportedNodeException } from "../../../exception/UnsupportedNodeException";

export class Lua51MissingDeclaration extends PartialTranspiler implements Partial<DeclarationTranspiler> {

    /**
     * @inheritdoc
     */
    public missingDeclaration(node: MissingDeclaration): string {

        throw new UnsupportedNodeException(
            `Typescript ast indicated that a node is a MissingDeclaration. There should be a syntax error.`, node
        );
    }
}
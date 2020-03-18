import { PartialTranspiler } from "../../../transpiler/impl/PartialTranspiler";
import { DeclarationTranspiler } from "../../../transpiler";
import { ImportEqualsDeclaration } from "typescript";
import { UnsupportedNodeException } from "../../../exception/UnsupportedNodeException";

export class Lua51ImportEqualsDeclaration extends PartialTranspiler implements Partial<DeclarationTranspiler> {

    /**
     * @inheritdoc
     */
    public importEqualsDeclaration(node: ImportEqualsDeclaration): string {

        this.transpiler.registerError({
            node: node,
            message: `import = require(...) declarations are unsupported!`
        });
        return "[ERROR]";
    }
}
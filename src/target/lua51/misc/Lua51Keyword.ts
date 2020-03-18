import { PartialTranspiler } from "../../../transpiler/impl/PartialTranspiler";
import { MiscTranspiler } from "../../../transpiler";
import { Node, SyntaxKind } from "typescript";
import { UnsupportedNodeException } from "../../../exception/UnsupportedNodeException";
import { Lua51Keywords } from "../Lua51Keywords";

export class Lua51Keyword extends PartialTranspiler implements Partial<MiscTranspiler> {

    /**
     * @inheritdoc
     */
    public keyword(node: Node): string {

        switch (node.kind) {
            case SyntaxKind.TrueKeyword:
                return "true";
            case SyntaxKind.FalseKeyword:
                return "false";
            case SyntaxKind.UndefinedKeyword:
            case SyntaxKind.NullKeyword:
                return "nil";
            case SyntaxKind.ThisKeyword:
                return "self";
            case SyntaxKind.SuperKeyword:

                // get last parsed class name
                const classes = this.transpiler.getRegisteredClasses();
                if (classes.length === 0) {
                    this.transpiler.registerError({
                        node: node,
                        message: `Trying to access a super object while not beeing in a class context is unsupported!`
                    });
                    return "[ERROR]";
                }

                const className = classes[classes.length - 1];
                return `${className}.${Lua51Keywords.CLASS_SUPER_REFERENCE_NAME}`;
            default:
                this.transpiler.registerError({
                    node: node,
                    message: `Current keyword ${SyntaxKind[node.kind]} is not supported!`
                });
                return "[ERROR]";
        }
    }
}
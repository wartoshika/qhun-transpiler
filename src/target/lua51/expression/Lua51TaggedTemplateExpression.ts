import { PartialTranspiler } from "../../../transpiler/impl/PartialTranspiler";
import { ExpressionTranspiler } from "../../../transpiler";
import { TaggedTemplateExpression } from "typescript";

export class Lua51TaggedTemplateExpression extends PartialTranspiler implements Partial<ExpressionTranspiler> {

    /**
     * @inheritdoc
     */
    public taggedTemplateExpression(node: TaggedTemplateExpression): string {

        return "TaggedTemplateExpression";
    }
}
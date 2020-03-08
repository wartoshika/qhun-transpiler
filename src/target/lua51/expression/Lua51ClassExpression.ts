import { PartialTranspiler } from "../../../transpiler/impl/PartialTranspiler";
import { ExpressionTranspiler } from "../../../transpiler";
import { ClassExpression } from "typescript";

export class Lua51ClassExpression extends PartialTranspiler implements Partial<ExpressionTranspiler> {

    /**
     * @inheritdoc
     */
    public classExpression(node: ClassExpression): string {

        return "ClassExpression";
    }
}
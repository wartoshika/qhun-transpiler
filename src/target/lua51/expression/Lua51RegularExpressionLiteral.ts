import { PartialTranspiler } from "../../../transpiler/impl/PartialTranspiler";
import { ExpressionTranspiler } from "../../../transpiler";
import { RegularExpressionLiteral } from "typescript";

export class Lua51RegularExpressionLiteral extends PartialTranspiler implements Partial<ExpressionTranspiler> {

    /**
     * @inheritdoc
     */
    public regularExpressionLiteral(node: RegularExpressionLiteral): string {

        return "RegularExpressionLiteral";
    }
}
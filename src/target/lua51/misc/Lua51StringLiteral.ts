import { PartialTranspiler } from "../../../transpiler/impl/PartialTranspiler";
import { MiscTranspiler } from "../../../transpiler";
import { StringLiteral } from "typescript";

export class Lua51StringLiteral extends PartialTranspiler implements Partial<MiscTranspiler> {

    /**
     * @inheritdoc
     */
    public stringLiteral(node: StringLiteral): string {

        return `"${node.text}"`;
    }
}
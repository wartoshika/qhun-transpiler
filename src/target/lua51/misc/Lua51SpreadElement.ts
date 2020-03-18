import { PartialTranspiler } from "../../../transpiler/impl/PartialTranspiler";
import { MiscTranspiler } from "../../../transpiler";
import { SpreadElement } from "typescript";

export class Lua51SpreadElement extends PartialTranspiler implements Partial<MiscTranspiler> {

    /**
     * @inheritdoc
     */
    public spreadElement(node: SpreadElement): string {

        // get the expression from the spread element
        const expression = this.transpiler.transpileNode(node.expression);

        // use table unpack to spread
        return `table.unpack(»${expression}»)`;
    }
}
import { PartialTranspiler } from "../../../transpiler/impl/PartialTranspiler";
import { MiscTranspiler } from "../../../transpiler";
import { Node } from "typescript";

export class Lua51FirstLiteralToken extends PartialTranspiler implements Partial<MiscTranspiler> {

    /**
     * @inheritdoc
     */
    public firstLiteralToken(node: Node): string {

        // must not be transpiled
        try {
            const text = node.getText();
            if (text.length > 0) {
                return text;
            }
        } catch (e) {

            // try to extract the text by hand ...
            if (typeof (node as any).text !== "undefined") {
                return (node as any).text;
            }

            throw e;
        }
        return "@NotTranspiled FirstLiteralToken";
    }
}
import { PartialTranspiler } from "../../../transpiler/impl/PartialTranspiler";
import { MiscTranspiler } from "../../../transpiler";
import { isReturnStatement, isBreakStatement, ArrayBindingPattern, isBindingElement } from "typescript";

export class Lua51ArrayBindingPattern extends PartialTranspiler implements Partial<MiscTranspiler> {

    /**
     * @inheritdoc
     */
    public arrayBindingPattern(node: ArrayBindingPattern): string {

        // check for dotdotdot token special handling
        if (node.elements.some(element => isBindingElement(element) && !!element.dotDotDotToken)) {
            return "@todo: dotdotdot array destructing";
            // return this.transpileArrayBindingPatternWithDotDotDotToken(node);
        }

        // get all declared variables
        return node.elements.map(element => {

            if (isBindingElement(element)) {

                // parse the name of the element
                return this.transpiler.transpileNode(element.name);
            } else {

                // element should be omitted
                // use the lua ignore var pattern
                return "_";
            }

            // join by commata divider
        }).join(`,»`);
    }
}
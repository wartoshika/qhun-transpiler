import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";
import { UnsupportedError } from "../../../error/UnsupportedError";

export interface LuaArrayBindingPattern extends BaseTarget, Target { }
export class LuaArrayBindingPattern implements Partial<Target> {

    public transpileArrayBindingPattern(node: ts.ArrayBindingPattern): string {

        // get all declared variables
        return node.elements.map(element => {

            if (ts.isBindingElement(element)) {

                // check for a dotdotdot token wich is not supported
                if (element.dotDotDotToken) {
                    throw new UnsupportedError(`Using array destruction assignment with the ... token is unsupported!`, element);
                }

                // parse the name of the element
                return this.transpileNode(element.name);
            } else {

                // element should be omitted
                // use the lua ignore var pattern
                return "_";
            }

            // join by commata divider
        }).join(", ");
    }
}

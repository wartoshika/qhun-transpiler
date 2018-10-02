import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";

export interface LuaArrayBindingPattern extends BaseTarget, Target { }
export class LuaArrayBindingPattern implements Partial<Target> {

    private lastGeneratedDestructingVariable: string;

    public transpileArrayBindingPattern(node: ts.ArrayBindingPattern): string {

        // check for dotdotdot token special handling
        if (node.elements.some(element => ts.isBindingElement(element) && !!element.dotDotDotToken)) {
            return this.transpileArrayBindingPatternWithDotDotDotToken(node);
        }

        // get all declared variables
        return node.elements.map(element => {

            if (ts.isBindingElement(element)) {

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

    /**
     * add destructing code for array destructing with dotdotdot token
     * @param node the variable declaration to destruct
     */
    public arrayBindingPatternModifierDestructWrappedElement(node: ts.VariableDeclaration): string {

        // make sure the last var is set
        if (!this.lastGeneratedDestructingVariable || !ts.isArrayBindingPattern(node.name)) {
            return "";
        }

        // extract all non rest element as normal destructing and slice them of the wrapped element storage
        // filter of all non binding elements since they need to be ignored. example: const [a,,c] = [1,2,3];
        const result = this.removeEmptyLines(node.name.elements.map((element, index) => {

            if (ts.isBindingElement(element)) {
                // check for the dotdotdot token
                if (element.dotDotDotToken) {

                    // get the name of the rest element
                    const restElementName = this.transpileNode(element.name);

                    // get all values from the tmp table starting by the given index
                    return [
                        this.transpileNode(ts.createVariableDeclaration(restElementName, null, ts.createArrayLiteral())),
                        `for k,v in pairs(${this.lastGeneratedDestructingVariable}) do`,
                        this.addSpacesToString(`if k > ${index} then`, 2),
                        this.addSpacesToString(`table.insert(${restElementName}, v)`, 4),
                        this.addSpacesToString(`end`, 2),
                        `end`
                    ].join("\n");
                } else {

                    // build a normal variable declaration for the generated output
                    const declaration = ts.createVariableDeclaration(element.name, null, ts.createElementAccess(
                        ts.createIdentifier(this.lastGeneratedDestructingVariable),
                        // index + 1 because lua is 1 based
                        index + 1
                    ));

                    // normal element assignment
                    return this.transpileNode(declaration);
                }
            }

            return "";

        }).join("\n"));

        // reset var name
        this.lastGeneratedDestructingVariable = undefined;

        return result;
    }

    /**
     * transpiles an array binding pattern with a dotdotdot token
     * @param node the node to transpile
     */
    private transpileArrayBindingPatternWithDotDotDotToken(node: ts.ArrayBindingPattern): string {

        // generate a unique variable to allow destructing securly without
        // overriding an existing variable
        this.lastGeneratedDestructingVariable = this.generateUniqueVariableName("arrayDestructingAssignment");

        // return just the variable and the modifier will be called during the VariableDeclaration handling
        return `${this.lastGeneratedDestructingVariable}`;
    }

}

import { PartialTranspiler } from "../../../transpiler/impl/PartialTranspiler";
import { ExpressionTranspiler } from "../../../transpiler";
import { ElementAccessExpression } from "typescript";
import { NodeContainingException } from "../../../exception/NodeContainingException";

export class Lua51ElementAccessExpression extends PartialTranspiler implements Partial<ExpressionTranspiler> {

    /**
     * @inheritdoc
     */
    public elementAccessExpression(node: ElementAccessExpression): string {

        // get the accessed element
        const element = this.transpiler.transpileNode(node.expression);

        // get the accessor
        const accessor = this.transpiler.transpileNode(node.argumentExpression);

        // element access can be a:
        // - string char access
        // - array index access
        // - object access
        // handle them by case
        try {
            if (this.transpiler.typeHelper().isString(node.expression)) {
                return this.getElementAccessStringCase(element, accessor);
            } else if (this.transpiler.typeHelper().isArray(node.expression)) {
                return this.getElementAccessArrayCase(element, accessor);
            }
        } catch (e) {

            // type could not be evaluated, use normal access pattern
            if (e instanceof NodeContainingException) {
                throw e;
            }
        }

        // use the normal object like access case
        return `${element}[${accessor}]`;
    }

    /**
     * transpile the string access case
     * @param element the current element
     * @param index the index
     */
    private getElementAccessStringCase(element: string, index: string): string {

        // lua is index 1 based, increment the index
        index = `(tonumber(${index})»+»1)`;

        // the string accessor must return a char, use string.sub to get the char
        return `string.sub(${element},${index})»${index})`;
    }

    /**
     * transpile the array access case
     * @param element the current element
     * @param index the index
     */
    private getElementAccessArrayCase(element: string, index: string): string {

        // array access is mostly equal to the object access.
        // just the index must be incremented because of the base 1 index
        index = `(tonumber(${index})»+»1)`;

        // use the object based access with the new index
        return `${element}[${index}]`;
    }
}
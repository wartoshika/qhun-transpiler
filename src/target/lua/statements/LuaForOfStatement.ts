import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";
import { UnsupportedError } from "../../../error/UnsupportedError";
import { Types } from "../../../transpiler/Types";

export interface LuaForOfStatement extends BaseTarget, Target { }
export class LuaForOfStatement implements Partial<Target> {

    public transpileForOfStatement(node: ts.ForOfStatement): string {

        // get the initializer vars
        const initializers = (node.initializer as ts.VariableDeclarationList).declarations;
        if (!Array.isArray(initializers) || initializers.length !== 1) {
            throw new UnsupportedError(`for .. in statements must have one initializer. There are currently ${initializers.length} initializers.`, node);
        }

        // get the initializer variable name
        const initializerName = this.transpileNode((initializers[0] as ts.VariableDeclaration).name);

        // get the expression
        const expression = this.transpileNode(node.expression);

        // if the expression element is an array type, use ipairs instead of pairs
        let iteratorFunction: string = "pairs";
        if (Types.isArray(node.expression, this.typeChecker)) {
            iteratorFunction = "ipairs";
        }

        // write the for of loop
        const forOfContent: string[] = [
            `for _, ${initializerName} in ${iteratorFunction}(${expression}) do`,
            this.addSpacesToString(this.transpileNode(node.statement), 2),
            `end`
        ];

        // join by newline and final newline
        return forOfContent.join("\n") + "\n";
    }
}

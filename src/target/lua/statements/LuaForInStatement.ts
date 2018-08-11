import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";
import { UnsupportedError } from "../../../error/UnsupportedError";
import { Types } from "../../../transpiler/Types";

export interface LuaForInStatement extends BaseTarget, Target { }
export class LuaForInStatement implements Partial<Target> {

    public transpileForInStatement(node: ts.ForInStatement): string {

        // get the initializer vars
        const initializers = (node.initializer as ts.VariableDeclarationList).declarations;
        if (!Array.isArray(initializers) || initializers.length !== 1) {
            throw new UnsupportedError(`for .. in statements must have one initializer. There are currently ${initializers.length} initializers.`, node);
        }

        // for .. in is not supported for arrays
        if (Types.isArray(node.expression, this.typeChecker)) {
            throw new UnsupportedError(`Iterating over arrays with a for .. in statement is not supported!`, node.expression);
        }

        // get the initializer variable name
        const initializerName = this.transpileNode((initializers[0] as ts.VariableDeclaration).name);

        // get the expression
        const expression = this.transpileNode(node.expression);

        // get the loop body
        const body = this.transpileNode(node.statement);

        // join everything
        return this.removeEmptyLines([
            `for ${initializerName}, _ in pairs(${expression}) do`,
            this.addSpacesToString(body, 2),
            `end`
        ].join("\n"));
    }
}

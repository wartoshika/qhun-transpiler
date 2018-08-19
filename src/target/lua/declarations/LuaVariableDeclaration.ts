import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";

export interface LuaVariableDeclaration extends BaseTarget, Target { }
export class LuaVariableDeclaration implements Partial<Target> {

    public transpileVariableDeclaration(node: ts.VariableDeclaration): string {

        // get the variable name
        const name = this.transpileNode(node.name);

        // check for a possible export
        if (this.hasExportModifier(node)) {
            this.addExport(name, node);
        }

        // get the initializer
        let initializer: string;

        // test for array destructing assignment
        if (ts.isArrayBindingPattern(node.name) && node.initializer && ts.isArrayLiteralExpression(node.initializer)) {

            // use destructing assignment via lua multireturn
            initializer = node.initializer.elements
                .map(element => this.transpileNode(element))
                .join(", ");
        } else {

            // use the normal node transpiling for getting the identifier
            initializer = this.transpileNode(node.initializer);
        }

        // write the code
        return `local ${name} = ${initializer || "nil"}\n`;
    }
}

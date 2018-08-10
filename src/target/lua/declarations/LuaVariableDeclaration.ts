import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";

export interface LuaVariableDeclaration extends BaseTarget, Target { }
export class LuaVariableDeclaration implements Partial<Target> {

    public transpileVariableDeclaration(node: ts.VariableDeclaration): string {

        // get the variable name
        const name = this.transpileNode(node.name);

        // get the possible initializer
        const initializer = this.transpileNode(node.initializer);

        // write the code
        return `local ${name} = ${initializer || "nil"}\n`;
    }
}

import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";

export interface LuaReturnStatement extends BaseTarget, Target { }
export class LuaReturnStatement implements Partial<Target> {

    public transpileReturnStatement(node: ts.ReturnStatement): string {

        // if the node is no expression, then return nil
        let expression: string = "";
        if (node.expression) {

            // add a space before!
            expression = " " + this.transpileNode(node.expression);
        } else {
            expression = "";
        }

        return `return${expression}`;
    }
}

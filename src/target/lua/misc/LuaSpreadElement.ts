import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";

export interface LuaSpreadElement extends BaseTarget, Target { }
export class LuaSpreadElement implements Partial<Target> {

    public transpileSpreadElement(node: ts.SpreadElement): string {

        // get the expression from the spread element
        const expression = this.transpileNode(node.expression);

        // use table unpack to spread
        return `unpack(${expression})`;
    }
}

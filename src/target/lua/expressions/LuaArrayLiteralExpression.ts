import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";

export interface LuaArrayLiteralExpression extends BaseTarget, Target { }
export class LuaArrayLiteralExpression implements Partial<Target> {

    public transpileArrayLiteralExpression(node: ts.ArrayLiteralExpression): string {

        // use bracket chars to wrap the whole element list
        const elementList: string[] = node.elements.map(element => this.transpileNode(element));

        // join them by the commata symbol
        return `{${elementList.join(",")}}`;
    }
}

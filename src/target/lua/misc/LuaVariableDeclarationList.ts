import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";

export interface LuaVariableDeclarationList extends BaseTarget, Target { }
export class LuaVariableDeclarationList implements Partial<Target> {

    public transpileVariableDeclarationList(node: ts.VariableDeclarationList): string {

        // visit each declaration in the list
        return node.declarations
            .map(dec => this.transpileNode(dec))
            .join("\n");
    }
}

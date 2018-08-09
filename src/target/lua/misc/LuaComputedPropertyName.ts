import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";

export interface LuaComputedPropertyName extends BaseTarget, Target { }
export class LuaComputedPropertyName implements Partial<Target> {

    public transpileComputedPropertyName(node: ts.ComputedPropertyName): string {

        return "COMPUTED_PROPERTY_NAME";
    }
}

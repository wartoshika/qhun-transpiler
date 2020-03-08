import { PartialTranspiler, StatementTranspiler } from "../../../transpiler";
import { SwitchStatement } from "typescript";

export class Lua51SwitchStatement extends PartialTranspiler implements Partial<StatementTranspiler> {

    /**
     * @inheritdoc
     */
    public switchStatement(node: SwitchStatement): string {

        return "SwitchStatement";
    }
}
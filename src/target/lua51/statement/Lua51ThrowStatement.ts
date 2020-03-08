import { PartialTranspiler, StatementTranspiler } from "../../../transpiler";
import { ThrowStatement } from "typescript";

export class Lua51ThrowStatement extends PartialTranspiler implements Partial<StatementTranspiler> {

    /**
     * @inheritdoc
     */
    public throwStatement(node: ThrowStatement): string {

        return "ThrowStatement";
    }
}
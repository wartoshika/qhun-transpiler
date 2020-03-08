import { AbstractTranspiler } from "../../transpiler";
import { Lua51ExpressionTranspiler } from "./expression/Lua51ExpressionTranspiler";
import { Lua51DeclarationTranspiler } from "./declaration/Lua51DeclarationTranspiler";
import { Lua51DecoratorTranspiler } from "./decorator/Lua51DecoratorTranspiler";
import { Lua51StatementTranspiler } from "./statement/Lua51StatementTranspiler";
import { Lua51MiscTranspiler } from "./misc/Lua51MiscTranspiler";
import { Node } from "typescript";
import { Lua51Config } from "./Lua51Config";

export class Lua51Transpiler extends AbstractTranspiler<Required<Lua51Config>> {

    protected subTranspilers = {
        expression: new Lua51ExpressionTranspiler(this),
        declaration: new Lua51DeclarationTranspiler(this),
        decorator: new Lua51DecoratorTranspiler(this),
        statement: new Lua51StatementTranspiler(this),
        misc: new Lua51MiscTranspiler(this)
    };

    /**
     * @inheritdoc
     */
    public typeOfNode(node: Node): string {
        if (this.config.emitTypes) {
            return [
                "--[[",
                this.space(),
                super.typeOfNode(node),
                this.space(),
                "]]"
            ].join("");
        }
        return "";
    }
}
import { PartialTranspiler } from "../../../transpiler/impl/PartialTranspiler";
import { DeclarationTranspiler, Transpiler } from "../../../transpiler";
import { InterfaceDeclaration } from "typescript";
import { Lua51Config } from "../Lua51Config";

export class Lua51InterfaceDeclaration extends PartialTranspiler implements Partial<DeclarationTranspiler> {

    /**
     * @inheritdoc
     */
    public interfaceDeclaration(node: InterfaceDeclaration): string {

        if ((this.transpiler as Transpiler<Required<Lua51Config>>).getConfig().emitTypes) {
            return `--[[»Interface ${this.transpiler.transpileNode(node.name)}»]]`;
        }

        // interfaces are not present in lua
        return "";
    }
}
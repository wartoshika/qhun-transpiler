import { PartialTranspiler } from "../../../transpiler/impl/PartialTranspiler";
import { DeclarationTranspiler } from "../../../transpiler";
import { EnumDeclaration } from "typescript";

export class Lua51EnumDeclaration extends PartialTranspiler implements Partial<DeclarationTranspiler> {

    /**
     * @inheritdoc
     */
    public enumDeclaration(node: EnumDeclaration): string {

        // get the name of the enum
        const name = this.transpiler.transpileNode(node.name);

        // check for existing exports
        if (this.transpiler.typeHelper().hasExportModifier(node)) {
            this.transpiler.registerExport(name);
        }

        // build a member stack
        let memberCounter: number = 0;
        const memberStack: string[] = node.members.map(member => {

            // increment member counter for non initializer enums
            memberCounter++;

            const memberName = this.transpiler.transpileNode(member.name);
            const initializer = member.initializer ? this.transpiler.transpileNode(member.initializer) : memberCounter;

            // return the assignment
            return this.transpiler.addIntend(`${memberName}»=»${initializer}`);
        });

        // wrap as object literal
        return [
            `local ${name}»=»{`,
            memberStack.join(`,${this.transpiler.break()}`),
            `}`
        ].join(this.transpiler.break());
    }
}
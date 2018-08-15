import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";

export interface LuaEnumDeclaration extends BaseTarget, Target { }
export class LuaEnumDeclaration implements Partial<Target> {

    public transpileEnumDeclaration(node: ts.EnumDeclaration): string {

        // get the name of the enum
        const name = this.transpileNode(node.name);

        // check for existing exports
        if (this.hasExportModifier(node)) {
            this.addExport(name, node);
        }

        // build a member stack
        let memberCounter: number = 0;
        const memberStack: string[] = node.members.map(member => {

            // increment member counter for non initializer enums
            memberCounter++;

            const memberName = this.transpileNode(member.name);
            const initializer = this.transpileNode(member.initializer);

            // return the assignment
            return this.addSpacesToString(`${memberName} = ${initializer || memberCounter}`, 2);
        });

        // wrap as object literal
        return [
            `local ${name} = {`,
            memberStack.join(",\n"),
            `}`
        ].join("\n") + "\n";
    }
}

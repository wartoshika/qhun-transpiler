import { Target } from "../Target";
import { LuaKeywords } from "./LuaKeywords";
import { Project } from "../../config/Project";
import { BaseLuaTarget } from "./BaseLuaTarget";

export interface LuaTarget extends BaseLuaTarget { }

/**
 * the lua target
 */
export class LuaTarget extends BaseLuaTarget implements Target {

    /**
     * overwrite the project var wo get a typed lua project
     */
    protected project: Project<"lua">;

    /**
     * get the file extension of the target language
     */
    public getFileExtension(): string {
        return "lua";
    }

    /**
     * a function that is called before the transpiling process begins
     */
    public preTranspile(): string | void {
        return "";
    }

    /**
     * a function that is called after the end of file token and directly after the transpiling process
     * @param currentTranspiledContent the currently transpiled file content
     * @returns a string that will be appended to the currently transpiled content
     */
    public postTranspile(currentTranspiledContent: string): string | void {
        return this.addDeclaredExports();
    }

    /**
     * add all declared exports to the transpiling context
     */
    private addDeclaredExports(): string {

        // get all declared exports
        const allExports = this.getExports();

        // check if there are no exports
        if (allExports.length === 0) {
            return "";
        }

        // divide between namespace exports and normal exports
        const normalExports = allExports.filter(exp => !exp.isNamespaceExport).map(exportNode => {
            return `${exportNode.name} = ${exportNode.name}`;
        });

        // now the namespace exports
        const namespaceExports = allExports.filter(exp => !!exp.isNamespaceExport).map(exportNode => {
            return `${LuaKeywords.EXPORT_LOCAL_NAME} = __global_requireall(${exportNode.name}, ${LuaKeywords.EXPORT_LOCAL_NAME})`;
        });

        // declare requireall when a namespace export is there
        if (namespaceExports.length > 0) {
            this.addDeclaration(
                "global.requireall",
                [
                    `local function __global_requireall(a,b)`,
                    this.addSpacesToString(`local mods = require(a)`, 2),
                    this.addSpacesToString(`for k, v in pairs(mods) do`, 2),
                    this.addSpacesToString(`b[k] = v`, 4),
                    this.addSpacesToString(`end`, 2),
                    this.addSpacesToString(`return b`, 2),
                    `end`
                ].join("\n")
            );
        }

        // iterate over all exports and wrap it as object literal
        const exportStatements: string[] = [
            `local ${LuaKeywords.EXPORT_LOCAL_NAME} = {`
        ];
        if (normalExports.length > 0) {
            exportStatements.push(this.addSpacesToString(normalExports.join(",\n"), 2));
        }
        exportStatements.push(`}`);
        if (namespaceExports.length > 0) {
            exportStatements.push(...namespaceExports);
        }
        exportStatements.push(`return ${LuaKeywords.EXPORT_LOCAL_NAME}`);

        // return the final result
        return exportStatements.join("\n");
    }

}

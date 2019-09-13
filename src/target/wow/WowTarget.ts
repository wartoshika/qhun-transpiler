import { LuaTarget } from "../lua/LuaTarget";
import { Target } from "../Target";
import { BaseTarget } from "../BaseTarget";
import { use } from "typescript-mix";
import * as wowTrait from "./traits";
import { LuaKeywords } from "../lua/LuaKeywords";
import { WowConfig } from "./WowConfig";
import { Project } from "../../config/Project";
import { SourceFile } from "../../compiler/SourceFile";
import { WowKeywords } from "./WowKeywords";

export interface WowTarget extends BaseTarget<WowConfig>, Target, wowTrait.WowDeclarations, wowTrait.WowSpecial, wowTrait.WowCallExpression { }

/**
 * the wow target
 */
export class WowTarget extends LuaTarget implements Target {

    /**
     * @override BaseTarget.project
     */
    protected project: Project<WowConfig>;

    @use(
        // call expressions overrides
        wowTrait.WowCallExpression,
        // declaration overrides
        wowTrait.WowImportDeclaration,
        wowTrait.WowClassDeclaration,
        // specials
        wowTrait.WowPathBuilder,
        wowTrait.WowPostTranspile
    ) protected this: WowTarget;

    /**
     * @Override LuaTarget.preTranspile()
     */
    public preTranspile(): string | void {

        return `local ${WowKeywords.FILE_META_VARIABLE} = {...}\n`;
    }

    /**
     * @override LuaTarget.postTranspile()
     */
    public postTranspile(currentTranspiledContent: string): string | void {

        const postTranspileStack: string[] = [];

        const exportStack = this.addDeclaredWowExports();
        if (exportStack) {
            postTranspileStack.push(exportStack);
        }

        // wow does not like empty files. when no transpiled content is available
        // add a comment to prevent wow from failing to load this file
        if (currentTranspiledContent.length === 0 && exportStack.length === 0) {
            postTranspileStack.push(`-- File is empty. This comment prevents wow from failing to load this file.`);
        }

        return postTranspileStack.join("\n");
    }

    /**
     * add all declared exports to the transpiling context
     */
    private addDeclaredWowExports(): string {

        // get all declared exports
        const allExports = this.getExports();

        // check if there are no exports
        if (allExports.length === 0) {
            return "";
        }

        // begin by writing an export object
        const exportStack: string[] = [
            `local ${LuaKeywords.EXPORT_LOCAL_NAME} = {`
        ];

        // add normal exports
        exportStack.push(allExports.filter(exp => !exp.isNamespaceExport).map(exp => {
            return this.addSpacesToString(`${exp.name} = ${exp.name}`, 2);
        }).join(",\n"));

        // add closing bracket
        exportStack.push(`}`);

        // add namespace exports
        exportStack.push(...allExports.filter(exp => exp.isNamespaceExport).map(exp => {

            // the name of the exported module is a path, to the final result should
            // be an export of an import. transpile an import statement
            const importPath = this.getImportPath(this.sourceFile as SourceFile, exp.name);
            const importStatement = `${WowKeywords.FILE_META_IMPORT_EXPORT}.get("${importPath}")`;

            return [
                `for mod, data in pairs(${importStatement}) do`,
                this.addSpacesToString(`${LuaKeywords.EXPORT_LOCAL_NAME}[mod] = data`, 2),
                `end`
            ].join("\n");
        }));

        // get the relative source file path
        const finalPath = `${this.getFilePath(this.sourceFile as SourceFile)}`;

        // return all including a final declare statement
        return [
            ...exportStack,
            // `${this.getGlobalLibraryVariableName()}.declare("${this.getUniquePathNameForFile(finalPath)}", ${LuaKeywords.EXPORT_LOCAL_NAME})`
            `${WowKeywords.FILE_META_IMPORT_EXPORT}.declare("${this.getUniquePathNameForFile(finalPath)}", ${LuaKeywords.EXPORT_LOCAL_NAME})`
        ].join("\n");
    }

}

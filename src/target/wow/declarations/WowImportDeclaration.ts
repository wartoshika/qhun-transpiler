import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";
import { UnsupportedError } from "../../../error/UnsupportedError";
import { WowKeywords } from "../WowKeywords";
import { WowPathBuilder } from "../special";
import { WowConfig } from "../WowConfig";
import { SourceFile } from "../../../compiler/SourceFile";

export interface WowImportDeclaration extends BaseTarget<WowConfig>, Target, WowPathBuilder { }

export class WowImportDeclaration implements Partial<Target> {

    public transpileImportDeclaration(node: ts.ImportDeclaration): string {

        // get the path of the module
        const path = this.transpileNode(node.moduleSpecifier);
        const finalPath = this.getFinalPath(node.getSourceFile() as SourceFile, path);

        // get imported elements
        let importedElements: string[] = [];

        // check for default imports
        if (!node.importClause || !node.importClause.namedBindings) {

            // just require the whole file
            throw new UnsupportedError(`Importing a whole file is not supported for the wow target!`, node);
        } else {

            // get the imports
            const imports = node.importClause.namedBindings;

            if (ts.isNamedImports(imports)) {
                importedElements = imports.elements.map(element => {

                    // get import name
                    const givenName = this.transpileNode(element.name);

                    // check if there is an alias
                    const moduleName = element.propertyName ? this.transpileNode(element.propertyName) : givenName;

                    // build the import
                    return `local ${givenName} = ${WowKeywords.IMPORT_LIB_NAME}.get(${finalPath}).${moduleName}`;
                });
            } else if (ts.isNamespaceImport(imports)) {

                // get given name
                const givenName = this.transpileNode(imports.name);

                importedElements = [
                    `local ${givenName} = ${WowKeywords.IMPORT_LIB_NAME}.get(${finalPath})`
                ];
            } else {
                // unsupported import type
                throw new UnsupportedError(`The given import type is not supported!`, node);
            }
        }

        // return all imported elements
        return importedElements.join("\n") + "\n";
    }
}

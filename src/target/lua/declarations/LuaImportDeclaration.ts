import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";
import { UnsupportedError } from "../../../error/UnsupportedError";

export interface LuaImportDeclaration extends BaseTarget, Target { }
export class LuaImportDeclaration implements Partial<Target> {

    public transpileImportDeclaration(node: ts.ImportDeclaration): string {

        // get the path of the module
        const path = this.transpileNode(node.moduleSpecifier);

        // check for default imports
        if (!node.importClause || !node.importClause.namedBindings) {

            // just require the whole file
            return `require(${path})`;

            // throw new UnsupportedError(`Default imports are not supported!`, node);
        }

        // get the imports
        const imports = node.importClause.namedBindings;

        // get imported elements
        let importedElements: string[];
        if (ts.isNamedImports(imports)) {
            importedElements = imports.elements.map(element => {

                // get import name
                const givenName = this.transpileNode(element.name);

                // check if there is an alias
                const moduleName = element.propertyName ? this.transpileNode(element.propertyName) : givenName;

                // build the import
                return `local ${givenName} = require(${path}).${moduleName}`;
            });
        } else if (ts.isNamespaceImport(imports)) {

            // get given name
            const givenName = this.transpileNode(imports.name);

            importedElements = [
                `local ${givenName} = require(${path})`
            ];
        } else {
            // unsupported import type
            throw new UnsupportedError(`The given import type is not supported!`, node);
        }

        // return all imported elements
        return importedElements.join("\n") + "\n";
    }
}

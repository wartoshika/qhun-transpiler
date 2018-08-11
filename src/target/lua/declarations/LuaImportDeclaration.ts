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
            throw new UnsupportedError(`Default imports are not supported!`, node);
        }

        // get the imports
        const imports = node.importClause.namedBindings;

        // unly named imports are currently supported
        if (!ts.isNamedImports(imports)) {
            throw new UnsupportedError(`Unnamed imports are not supported!`, node);
        }

        // get imported elements
        const importedElements: string[] = imports.elements.map(element => {

            // get import name
            const givenName = this.transpileNode(element.name);

            // check if there is an alias
            const moduleName = element.propertyName ? this.transpileNode(element.propertyName) : givenName;

            // build the import
            return `local ${givenName} = require(${path}).${moduleName}`;
        });

        // return all imported elements
        return importedElements.join("\n");
    }
}

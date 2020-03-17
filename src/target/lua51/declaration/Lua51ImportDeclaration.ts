import { PartialTranspiler } from "../../../transpiler/impl/PartialTranspiler";
import { DeclarationTranspiler } from "../../../transpiler";
import { ImportDeclaration, isNamedImports, isNamespaceImport } from "typescript";
import { UnsupportedNodeException } from "../../../exception/UnsupportedNodeException";

export class Lua51ImportDeclaration extends PartialTranspiler implements Partial<DeclarationTranspiler> {

    /**
     * @inheritdoc
     */
    public importDeclaration(node: ImportDeclaration): string {

        // get the path of the module
        const path = this.transpiler.transpileNode(node.moduleSpecifier);

        // get imported elements
        let importedElements: string[] = [];

        // check for default imports
        if (!node.importClause || !node.importClause.namedBindings) {

            // just require the whole file
            importedElements.push(`require(${path})`);
        } else {

            // get the imports
            const imports = node.importClause.namedBindings;

            if (isNamedImports(imports)) {
                importedElements = imports.elements.map(element => {

                    // get import name
                    const givenName = this.transpiler.transpileNode(element.name);

                    // check if there is an alias
                    const moduleName = element.propertyName ? this.transpiler.transpileNode(element.propertyName) : givenName;

                    // build the import
                    return `local ${givenName}»=»require(${path}).${moduleName}`;
                });
            } else if (isNamespaceImport(imports)) {

                // get given name
                const givenName = this.transpiler.transpileNode(imports.name);

                importedElements = [
                    `local ${givenName}»=»require(${path})`
                ];
            } else {
                // unsupported import type
                throw new UnsupportedNodeException(`The given import type is not supported!`, node);
            }
        }

        // return all imported elements
        return importedElements.join(this.transpiler.break());
    }
}
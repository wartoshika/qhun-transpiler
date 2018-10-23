import * as ts from "typescript";

/**
 * represents a transpilable source file
 */
export interface SourceFile extends ts.SourceFile {

    /**
     * a flag if the file is from an external source.
     */
    isExternal: boolean;

    /**
     * the original filename when the file is internal or
     * the new module path if the file is external
     */
    transpilerFileName: string;

    /**
     * when the source file is external, this field will contain the relative root path
     * e.g: __external/wow-qhun-core-ts
     */
    externalModuleRoot?: string;

    /**
     * when the source file is external, this field will contain the node_modules
     * path to the project.
     * e.g: node_modules/@wartoshika/wow-qhun-core-ts
     */
    externalNodeModulesPath?: string;

    /**
     * when external it contains the project name
     * e.g: wow-qhun-core-ts
     */
    externalModuleName?: string;

    /**
     * the new complete filename (excl. extension)
     */
    targetFileNameTranspiled?: string;

}

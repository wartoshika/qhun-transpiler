import { SourceFile, Node } from "typescript";

export interface QNode {

    /**
     * original source file
     */
    sourceFile: SourceFile;

    /**
     * original ts node
     */
    node: Node;

    /**
     * contains the transpiled source code
     */
    transpiled: string[];

    /**
     * names of the variables used within this context
     */
    usedVariables: string[];

    /**
     * all exports of this node
     */
    exportStatements: string[];
}
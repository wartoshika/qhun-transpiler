import { QNode } from "./QNode"

export declare type QImportType = {

    /**
     * path of the imported file
     */
    path: string,

    /**
     * indicator that the imported class only contains types and no values
     */
    typesOnly: boolean,

    /**
     * optional variable name of the import
     */
    importVariableName?: string

};

export interface QImportNode extends QNode {

    /**
     * all imports present in the node
     */
    imports: QImportType[];
}
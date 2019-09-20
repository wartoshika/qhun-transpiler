/**
 * describes a transpiled class within the target environment
 */
export declare type TranspiledClass<T extends object, args extends any[]= any[]> = {

    /**
     * the human readable name of the class
     */
    __name: string;

    /**
     * the namespace or path of the file while transpiling
     */
    __namespace: string;

    /**
     * the constructor of the class
     */
    __index: new (...args: any[]) => T;

    /**
     * the parent constructor if available
     */
    __super?: new (...args: any[]) => any;

    /**
     * contains reflection data of methods
     */
    __staticReflection?: {
        [methodName: string]: any[]
    };

    /**
     * the constructor of the class
     */
    new(...args: args): T;
};

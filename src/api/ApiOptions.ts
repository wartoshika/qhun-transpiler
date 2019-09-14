import { CompilerOptions } from "typescript";
import { ApiConfiguration } from "./ApiConfiguration";
import { SupportedTargets } from "../target/TargetFactory";

import * as ts from "typescript";

export interface ApiOptions<T extends keyof SupportedTargets> {

    /**
     * relative path to the root file of your project
     */
    entrypoint: string;

    /**
     * the configuration for the current transpiling project.
     */
    configuration?: ApiConfiguration<T>;

    /**
     * the configuration that should be used by the internal typescript transpiler.
     * One example is, that you can include or exclude files for the transpile process
     * @default {outDir:"dist"}
     */
    compilerOptions?: CompilerOptions;

    /**
     * watches for file changes and automaticly trigger the transpiling process
     * @default false
     */
    watch?: boolean;

    /**
     * overwrites the transpiler mechanismn for the given type of node
     * @default {}
     */
    overwrite?: {
        [P in ts.SyntaxKind]?: (
            /**
             * the node that should be transpiled
             */
            node: ts.Node,
            /**
             * a function that uses the transpiler to transpiler other nodes
             */
            transpileNode: (node: ts.Node) => string,
            /**
             * the original function that should have transpiled this node
             */
            originalTranspilerFunction: (node: ts.Node) => string
        ) => string
    };
}

export interface RequiredApiOptions<T extends keyof SupportedTargets = any> extends Required<ApiOptions<T>> {
    configuration: Required<ApiConfiguration<T>>;
}

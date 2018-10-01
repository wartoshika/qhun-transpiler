import { StaticReflection } from "./StaticReflection";

/**
 * a generic config section for all transpiler targets
 */
export interface Config {

    /**
     * set the reflection context for the transpiled files
     */
    staticReflection?: StaticReflection;
}

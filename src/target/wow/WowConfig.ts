import { LuaConfig } from "../lua/LuaConfig";

/**
 * the wow target config section
 */
export interface WowConfig extends LuaConfig {

    /**
     * the visible name of the addon in the game interface
     */
    visibleName: string;

    /**
     * the game client interface version number
     */
    interface: number;

    /**
     * a stack of optional dependencies
     */
    optionalDependencies: string[];

    /**
     * a stack of nessesary dependencies
     */
    dependencies: string[];

    /**
     * all saved variables
     */
    savedVariables: string[];

    /**
     * all saved variables per character
     */
    savedVariablesPerCharacter: string[];
}

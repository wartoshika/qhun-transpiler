import { Config } from "../../Config";

export interface Lua51Config extends Config {

    /**
     * emit types for variable and parameter declarations as comments
     * @default false
     */
    emitTypes?: boolean
}
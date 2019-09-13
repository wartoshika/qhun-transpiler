import { DefaultConfigGetter } from "../../config/DefaultConfigGetter";
import { WowConfig } from "./WowConfig";

/**
 * the default config class for wow target
 */
export class WowDefaultConfig implements DefaultConfigGetter<WowConfig> {

    public getDefaultConfig(): Partial<WowConfig> {

        // currently no default config for lua
        return {};
    }
}

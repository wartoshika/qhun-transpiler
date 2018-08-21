import { ValidatorRule } from "./ValidatorRule";
import { ValidatorObject } from "./ValidatorObject";
import { Config } from "../Config";

export interface TargetConfigValidator<C extends Config = Config> {

    /**
     * get all validator rules for the config block
     */
    getRules(): ValidatorObject<C> | ValidatorRule | ValidatorRule[];
}

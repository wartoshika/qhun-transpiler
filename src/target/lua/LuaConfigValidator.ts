import { LuaConfig } from "./LuaConfig";
import { TargetConfigValidator } from "../../config/validator/TargetConfigValidator";
import { ValidatorRule } from "../../config/validator/ValidatorRule";
import { Config } from "../../config/Config";

export class LuaConfigValidator<C extends Config = LuaConfig> implements TargetConfigValidator<C> {

    public getRules(): ValidatorRule {

        // lua doens't need config block validation atm.
        return new ValidatorRule((input: any) => true);
    }
}

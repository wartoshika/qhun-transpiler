import { LuaConfig } from "./LuaConfig";
import { TargetConfigValidator } from "../../config/validator/TargetConfigValidator";
import { ValidatorRule } from "../../config/validator/ValidatorRules";

export class LuaConfigValidator<C = LuaConfig> implements TargetConfigValidator<C> {

    public getRules(): ValidatorRule {

        // lua doens't need config block validation atm.
        return (input: any) => true;
    }
}

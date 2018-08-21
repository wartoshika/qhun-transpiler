import { TargetConfigValidator } from "../../config/validator/TargetConfigValidator";
import { ValidatorObject } from "../../config/validator/ValidatorObject";
import { WowConfig } from "./WowConfig";
import { ValidatorRule } from "../../config/validator/ValidatorRule";

export class WowConfigValidator implements TargetConfigValidator<WowConfig> {

    public getRules(): ValidatorObject<WowConfig> {

        // a generic validation rule for optional array values
        const optionalArrayValues = ValidatorRule.optional(
            // every element in the array
            ValidatorRule.everyElementInArray(
                // must be a string
                ValidatorRule.isString(1)
            )
        );

        // wow needs neasted validation
        return {
            rules: {
                // mandatory values
                visibleName: ValidatorRule.isString(1),
                interface: ValidatorRule.isNumber(),
                // optional values
                dependencies: optionalArrayValues,
                optionalDependencies: optionalArrayValues,
                savedVariables: optionalArrayValues,
                savedVariablesPerCharacter: optionalArrayValues
            }
        } as ValidatorObject<WowConfig>;
    }
}

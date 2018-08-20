import { TargetConfigValidator } from "../../config/validator/TargetConfigValidator";
import { ValidatorObject } from "../../config/validator/ValidatorObject";
import { WowConfig } from "./WowConfig";
import { ValidatorRules } from "../../config/validator/ValidatorRules";

export class WowConfigValidator implements TargetConfigValidator<WowConfig> {

    public getRules(): ValidatorObject<WowConfig> {

        // a generic validation rule for optional array values
        const optionalArrayValues = ValidatorRules.optional(
            // every element in the array
            ValidatorRules.everyElementInArray(
                // must be a string
                ValidatorRules.isString(1)
            )
        );

        // wow needs neasted validation
        return {
            rules: {
                // mandatory values
                visibleName: ValidatorRules.isString(1),
                interface: ValidatorRules.isNumber(),
                // optional values
                dependencies: optionalArrayValues,
                optionalDependencies: optionalArrayValues,
                savedVariables: optionalArrayValues,
                savedVariablesPerCharacter: optionalArrayValues
            }
        } as ValidatorObject<WowConfig>;
    }
}

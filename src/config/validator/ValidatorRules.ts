import * as fs from "fs";

export type ValidatorRule = (input: any) => boolean;

export class ValidatorRules {

    public static isString(minLength?: number, maxLength?: number): ValidatorRule {
        return (input: any) => {

            return typeof input === "string" &&
                // min length check
                (typeof minLength === "number" ? input.length >= minLength : true) &&
                // max length check
                (typeof maxLength === "number" ? input.length <= maxLength : true);
        };
    }

    public static isNumber(): ValidatorRule {
        return (input: any) => {

            // simple number type check
            return typeof input === "number" && !isNaN(input);
        };
    }

    public static stringMatches(test: RegExp): ValidatorRule {
        return (input: any) => {

            return typeof input === "string" && !!input.match(test);
        };
    }

    public static isArray(minLength?: number, maxLength?: number): ValidatorRule {
        return (input: any) => {

            return Array.isArray(input) &&
                // min length check
                (typeof minLength === "number" ? input.length >= minLength : true) &&
                // max length check
                (typeof maxLength === "number" ? input.length <= maxLength : true);
        };
    }

    public static isInArray(data: any[]): ValidatorRule {
        return (input: any) => {

            return data.some(val => input === val);
        };
    }

    public static isBoolean(): ValidatorRule {
        return (input: any) => {
            return typeof input === "boolean";
        };
    }

    public static optional(rule: ValidatorRule | ValidatorRule[]): ValidatorRule {
        return (input: any) => {

            if (!Array.isArray(rule)) {
                rule = [rule];
            }

            // when no input is given, the optional rule is resolved
            if (input === undefined) {
                return true;
            }

            // when input is given, every rule must be resolved
            return rule.every(givenRule => givenRule(input));
        };
    }

    public static pathExists(): ValidatorRule {
        return (input: any) => {

            return typeof input === "string" && fs.existsSync(input);
        };
    }

    public static everyElementInArray(rule: ValidatorRule | ValidatorRule[]): ValidatorRule {

        // make rule array if not exists
        if (!Array.isArray(rule)) {
            rule = [rule];
        }

        return (input: any) => {

            // element must be an array
            return Array.isArray(input) &&
                // every element in the array
                input.every(elm =>
                    // matches every given rule
                    (rule as ValidatorRule[]).every(givenRule => givenRule(elm))
                );
        };
    }
}

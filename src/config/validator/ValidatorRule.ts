// tslint:disable member-ordering
import * as fs from "fs";

declare type ValidatorRuleExecutor = (input: any) => boolean;

/**
 * one validator rule that identifies a constraint or a boundary for input
 */
export class ValidatorRule {

    constructor(
        private runTest: ValidatorRuleExecutor
    ) { }

    /**
     * tests if the validation applied to the given input
     * @param input the input to test
     */
    public runValidationTest(input: any): boolean {

        return this.runTest(input);
    }

    /**
     * tests if the input is of type string and has some optional other constraints
     * @param minLength the minimum length of the string
     * @param maxLength the maximum length of the string
     */
    public static isString(minLength?: number, maxLength?: number): ValidatorRule {
        return new ValidatorRule((input: any) => {
            // must be of type string
            return typeof input === "string" &&
                // min length check
                (typeof minLength === "number" ? input.length >= minLength : true) &&
                // max length check
                (typeof maxLength === "number" ? input.length <= maxLength : true);
        });
    }

    /**
     * tests if the given input is of type number and has some other optional constraints
     * @param minimal the minimim number
     * @param maximal the maximum number
     */
    public static isNumber(minimal?: number, maximal?: number): ValidatorRule {
        return new ValidatorRule((input: any) => {
            // typeof number and !== NaN
            return typeof input === "number" && !isNaN(input) &&
                // min check
                (typeof minimal === "number" ? input >= minimal : true) &&
                // max check
                (typeof maximal === "number" ? input <= maximal : true);
        });
    }

    /**
     * tests if the given input is an array and has some optional other constraints
     * @param minLength the minimal array length
     * @param maxLength the maximal array length
     */
    public static isArray(minLength?: number, maxLength?: number): ValidatorRule {
        return new ValidatorRule((input: any) => {
            // is array test
            return Array.isArray(input) &&
                // min length check
                (typeof minLength === "number" ? input.length >= minLength : true) &&
                // max length check
                (typeof maxLength === "number" ? input.length <= maxLength : true);
        });
    }

    /**
     * tests if the given input is of type boolean
     */
    public static isBoolean(): ValidatorRule {
        return new ValidatorRule((input: any) => typeof input === "boolean");
    }

    /**
     * tests if the given input exists on the given data array
     * @param data the data to test against
     */
    public static isInArray(data: any[]): ValidatorRule {
        return new ValidatorRule((input: any) => data.some(val => input === val));
    }

    /**
     * tests if every element in the input array matches all given rules
     * @param rules the rules to apply on every element in the array
     */
    public static everyElementInArray(rules: ValidatorRule | ValidatorRule[]): ValidatorRule {

        // make rule array if not exists
        if (!Array.isArray(rules)) {
            rules = [rules];
        }

        return new ValidatorRule((input: any) => {

            // input must be an array
            return Array.isArray(input) &&
                // every element in the array
                input.every(elm =>
                    // matches every given rule
                    (rules as ValidatorRule[]).every(givenRule => givenRule.runValidationTest(elm))
                );
        });
    }

    /**
     * test if the given input path exists on the filesystem
     */
    public static pathExists(): ValidatorRule {
        return new ValidatorRule((input: any) =>

            // must be a string and must exists on fs
            typeof input === "string" && fs.existsSync(input)
        );
    }

    /**
     * makes the given input optional but when given, it must apply to the given rule(s)
     */
    public static optional(rules: ValidatorRule | ValidatorRule[]): ValidatorRule {

        // make rule array if not exists
        if (!Array.isArray(rules)) {
            rules = [rules];
        }

        return new ValidatorRule((input: any) => {

            // when no input is given, the optional rule is resolved
            if (input === undefined) {
                return true;
            }

            // when input is given, every rule must be resolved
            return (rules as ValidatorRule[]).every(givenRule => givenRule.runValidationTest(input));
        });

    }
}

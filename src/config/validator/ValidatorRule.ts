// tslint:disable member-ordering
import * as fs from "fs";

declare type ValidatorRuleExecutor = (input: any) => boolean;

/**
 * one validator rule that identifies a constraint or a boundary for input
 */
export class ValidatorRule {

    /**
     * @param runTest the test function to run
     * @param errorMessage a message that shoule be visible on error. $0, $1 ... $n can be used to acess constraints
     * @param constraints the contraints that had been used to build aditional boundary checks
     */
    constructor(
        private runTest: ValidatorRuleExecutor,
        private errorMessage: string = "Validation error",
        private constraints: any[] = []
    ) { }

    /**
     * tests if the validation applied to the given input
     * @param input the input to test
     */
    public runValidationTest(input: any): boolean {

        return this.runTest(input);
    }

    /**
     * get a readable validator error message
     */
    public getErrorMessage(): string[] {

        // replace all constraint accesses
        return this.errorMessage.replace(/(\$([a-z0-9]+))/ig, (match, p1, p2) => {
            return this.constraints[parseInt(p2)];
        }).split("\n");
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
        }, "Value must be a string and between $0 and $1 characters long.", [minLength || 0, maxLength || Infinity]);
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
        }, "Value must be a number and between $0 and $1.", [minimal || -Infinity, maximal || Infinity]);
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
        }, "Value must be an array with a length between $0 and $1", [minLength || 0, maxLength || Infinity]);
    }

    /**
     * tests if the given input is of type boolean
     */
    public static isBoolean(): ValidatorRule {
        return new ValidatorRule(
            (input: any) => typeof input === "boolean",
            "Value must be a boolean type"
        );
    }

    /**
     * tests if the given input exists on the given data array
     * @param data the data to test against
     */
    public static isInArray(data: any[]): ValidatorRule {
        return new ValidatorRule(
            (input: any) => data.some(val => input === val),
            "Value must be a part of $0", [data.join(", ")]
        );
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
        }, "Every element in the array must be: $0", [
                // just all error messages
                this.flattenErrorMessages(rules)
            ]);
    }

    /**
     * test if the given input path exists on the filesystem
     */
    public static pathExists(): ValidatorRule {
        return new ValidatorRule((input: any) =>

            // must be a string and must exists on fs
            typeof input === "string" && fs.existsSync(input),
            "The given path does not exists!"
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
        }, "$0", [
                // just all error messages
                this.flattenErrorMessages(rules)
            ]);

    }

    private static flattenErrorMessages(rules: ValidatorRule[]): string {

        const errors = rules.map(rule => rule.getErrorMessage());
        return errors.reduce((acc, val) => acc.concat(val), []).join("\n");
    }
}

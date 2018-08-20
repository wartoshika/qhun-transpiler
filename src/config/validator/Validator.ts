import { ValidatorObject, ObjectAccessor } from "./ValidatorObject";
import { ValidatorRule } from "./ValidatorRules";
import * as objectAssign from "object-assign";

/**
 * A validator class that allow to validate existing config settings and check if
 * the config requirements are met
 */
export class Validator<O extends ObjectAccessor = ObjectAccessor> {

    /**
     * all errors that occured when validating given data
     */
    private validationErrors: string[];

    constructor(
        private ruleObject: ValidatorObject<O>
    ) { }

    /**
     * validates if the given data object passes the given rules
     * @param data the data to validate against
     */
    public validate(data: O): boolean {

        // reset validation errors
        this.validationErrors = [];

        return this.validateInternal(data);
    }

    /**
     * get all validation errors
     */
    public getValidationErrors(): string[] {

        return this.validationErrors;
    }

    /**
     * internal version of validate to avoid exposing the current path to the public api
     * @param data the data to work through
     * @param currentPath for recursive calls important to register errors properly
     */
    private validateInternal(data: O, currentPath: string[] = []): boolean {

        // get the rules
        let rules: ObjectAccessor = this.ruleObject.rules;
        if (currentPath.length > 0) {

            // apply the current path to the rule selection
            currentPath.forEach(path => {
                rules = rules[path].rules;
            });
        }

        // validate all rules
        Object.keys(rules).forEach(key => {

            // try to get the rule behind the object
            const rule = (rules as any)[key as keyof O];

            // when a rule or rule array is given, no further
            // when this is not the case, make a recursive validate call
            if (this.objectIsARule(rule)) {

                // convert rule to array
                const ruleStack: ValidatorRule[] = [];
                if (!Array.isArray(rule)) {
                    ruleStack.push(rule);
                } else {
                    ruleStack.push(...rule);
                }

                // try to apply every rule
                ruleStack.forEach(givenRule => {

                    if (!givenRule(data[key])) {

                        // rule failed, store the error
                        this.validationErrors.push(this.buildError(currentPath, key));
                    }
                });
            } else {

                // use recursive call to validate rules that are deeper in the object
                this.validateInternal(data[key] as any, [...currentPath, key]);
            }

        });

        return this.validationErrors.length === 0;
    }

    /**
     * builds an human understandable error text
     * @param path the current neasted path
     * @param currentKey the current object key
     */
    private buildError(path: string[], currentKey: string): string {

        // add current key to the path (clone the array first)
        const errorPath = path.splice(0);
        errorPath.push(currentKey);

        return `${errorPath.join(".")}: Does not met the validation rules.`;
    }

    /**
     * test if the given data is a rule
     * @param data the data to test
     */
    private objectIsARule(data: any): data is ValidatorRule | ValidatorRule[] {

        // simple function type check
        if (typeof data === "function") {
            return true;
        }

        // every array content must be a function
        if (Array.isArray(data) && data.every(t => typeof t === "function")) {
            return true;
        }

        // no rule at all
        return false;
    }
}

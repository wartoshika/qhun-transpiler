import { suite, test, slow, timeout } from "mocha-typescript";
import { expect } from "chai";
import { Validator } from "../../src/config/validator/Validator";
import { ValidatorRules } from "../../src/config/validator/ValidatorRules";

declare type myObject = {
    num: number,
    str: string,
    numArr: number[]
};

declare type myComplexObject = {

    neasted: {
        num: number,
        str: string,
        strArr: string[]
    },
    str: string,
    num: number
    anyArr?: any[]
};

@suite("[Unit] Validator", slow(500), timeout(3000)) class ValidatorTest {

    @test "Simple validating"() {

        const myGoodObject: myObject = {
            num: 1,
            str: "test",
            numArr: [1, 2, 3]
        };

        const validator = new Validator<myObject>({
            rules: {
                num: ValidatorRules.isNumber(),
                str: ValidatorRules.isString(),
                numArr: ValidatorRules.everyElementInArray(
                    ValidatorRules.isNumber()
                )
            }
        });

        // expect(validator.validate(myGoodObject)).to.be.true;

        const myBadObject = {
            num: "test",
            str: 5,
            numArr: [1, "bad string in num arr", 3]
        };

        //const result = validator.validate(myBadObject as any);
        //expect(result).to.be.false;

        // expect(validator.getValidationErrors().length).to.equal(3, "Validation error length is invalid");

    }

    @test "Optional validating with complex rules"() {

        const myGoodObject: myComplexObject = {
            num: 1,
            str: "test",
            // anyArr is missing!
            neasted: {
                num: 5,
                str: "longer test string",
                strArr: ["one", "two", "three"]
            }
        };

        // build the validator
        const validator = new Validator<myComplexObject>({
            rules: {
                num: ValidatorRules.isNumber(),
                // we wont validating str.
                anyArr: ValidatorRules.optional(
                    ValidatorRules.isArray()
                ),
                neasted: {
                    rules: {
                        num: ValidatorRules.isNumber(),
                        str: ValidatorRules.isString(10),
                        strArr: ValidatorRules.optional(
                            ValidatorRules.everyElementInArray(
                                ValidatorRules.isString(3)
                            )
                        )
                    }
                }
            }
        });

        //expect(validator.validate(myGoodObject)).to.be.true;

        const myBadObject = {
            num: {},
            str: "test",
            anyArr: "not an array",
            neasted: {
                num: 5,
                str: "to short",
                strArr: ["optional not when given it must be a string[]", 1337, "three"]
            }
        }

        expect(validator.validate(myBadObject as any)).to.equal(false, "Validation should have errored!");

        // get the errors
        const validationErrors = validator.getValidationErrors();
        expect(validationErrors.length).to.equal(4, "Validator error stack length invalid!");

        // take a deeper look into the errors
        expect(validationErrors).to.satisfy(() => {
            const expectedErrPrefix: string[] = [
                "num", "anyArr", "neasted.str", "neasted.strArr"
            ];
            return validationErrors.every((err, index) => {
                if (err.indexOf(expectedErrPrefix[index]) === -1) {

                    console.error(expectedErrPrefix[index], "was not found in ", validationErrors);
                    return false;
                }
                return true;
            });
        });

    }
}
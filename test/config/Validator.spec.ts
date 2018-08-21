import { suite, test, slow, timeout } from "mocha-typescript";
import { expect } from "chai";
import { Validator } from "../../src/config/validator/Validator";
import { ValidatorRule } from "../../src/config/validator/ValidatorRule";

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
                num: ValidatorRule.isNumber(),
                str: ValidatorRule.isString(),
                numArr: ValidatorRule.everyElementInArray(
                    ValidatorRule.isNumber()
                )
            }
        });

        expect(validator.validate(myGoodObject)).to.be.true;

        const myBadObject = {
            num: "test",
            str: 5,
            numArr: [1, "bad string in num arr", 3]
        };

        const result = validator.validate(myBadObject as any);
        expect(result).to.be.false;

        expect(Object.keys(validator.getValidationErrors()).length).to.equal(3, "Validation error length is invalid");

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
                num: ValidatorRule.isNumber(),
                // we wont validating str.
                anyArr: ValidatorRule.optional(
                    ValidatorRule.isArray()
                ),
                neasted: {
                    rules: {
                        num: ValidatorRule.isNumber(),
                        str: ValidatorRule.isString(10),
                        strArr: ValidatorRule.optional([
                            ValidatorRule.isArray(1),
                            ValidatorRule.everyElementInArray(
                                ValidatorRule.isString(3)
                            )
                        ])
                    }
                }
            }
        });

        expect(validator.validate(myGoodObject)).to.be.true;

        const myBadObject = {
            num: {},
            str: "test",
            anyArr: "not an array",
            neasted: {
                num: 5,
                str: "to short",
                strArr: ["optional but when given it must be a string[]", 1337, "three"]
            }
        }

        expect(validator.validate(myBadObject as any)).to.equal(false, "Validation should have errored!");

        // get the errors
        const validationErrors = validator.getValidationErrors();
        expect(Object.keys(validationErrors).length).to.equal(4, "Validator error stack length invalid!");

        // take a deeper look into the errors
        expect(Object.keys(validationErrors)).to.deep.equal(["num", "anyArr", "neasted.str", "neasted.strArr"]);

    }
}
import { Reader } from "../Reader";
import { Project } from "../Project";
import * as path from "path";
import { ArgumentConfig } from "./ArgumentConfig";
import { DefaultConfig } from "../DefaultConfig";
import { Validator } from "../validator/Validator";
import { ValidatorRule } from "../validator/ValidatorRule";
import { TargetFactory } from "../../target/TargetFactory";
import { ValidationError } from "../../error/ValidationError";

export class ArgumentReader implements Reader {

    constructor(
        private args: ArgumentConfig
    ) { }

    /**
     * read the given arguments into a project object
     */
    public read(): Project {

        // validate the given argument options
        const validator = new Validator<ArgumentConfig>({
            rules: {
                target: ValidatorRule.isInArray(Object.keys(TargetFactory.supportedTargets)),
                file: ValidatorRule.pathExists()
            }
        });

        // validate the given data and throw an error when the validation fails
        if (!validator.validate(this.args)) {
            throw new ValidationError(validator.getValidationErrors());
        }

        // everything ok, continue
        return DefaultConfig.mergeDefaultProjectData({
            target: this.args.target,
            rootDir: path.dirname(path.resolve(this.args.file)),
            outDir: ".",
            parsedCommandLine: {
                fileNames: [
                    this.args.file
                ],
                options: DefaultConfig.getDefaultCompilerOptions()
            }
        });
    }
}

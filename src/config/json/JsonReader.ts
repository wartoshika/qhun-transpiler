import { Reader } from "../Reader";
import { Project } from "../Project";
import { JsonConfig } from "./JsonConfig";
import { FileNotExistsError } from "../../error/FileNotExistsError";
import { UnexpectedError } from "../../error/UnexpectedError";
import * as fs from "fs";
import * as ts from "typescript";
import * as path from "path";
import { DefaultConfig } from "../DefaultConfig";
import { ValidationError } from "../../error/ValidationError";
import { Validator, ValidatorErrors } from "../validator/Validator";
import { ValidatorRule } from "../validator/ValidatorRule";
import { TargetFactory, SupportedTargets } from "../../target/TargetFactory";
import { LuaConfigValidator } from "../../target/lua/LuaConfigValidator";
import { ValidatorObject } from "../validator/ValidatorObject";
import { WowConfigValidator } from "../../target/wow/WowConfigValidator";
import { TargetConfigValidator } from "../validator/TargetConfigValidator";

export class JsonReader implements Reader {

    constructor(
        private filePath: string
    ) { }

    /**
     * reads the qhun-transpiler.json file
     */
    public read(): Project {

        // check if the given file exists
        if (!fs.existsSync(this.filePath)) {
            throw new FileNotExistsError(`The given qhun-transpiler.json file does not exists. Given file was: ${this.filePath}`);
        }

        // read the data
        const jsonString = fs.readFileSync(this.filePath).toString();

        // parse to json and read every data part
        let project: Project;
        try {

            // parse json
            const jsonData: JsonConfig = JSON.parse(jsonString);

            // validate json data
            const validationResult = this.validateJsonConfig(jsonData);
            if (validationResult !== true) {
                throw new ValidationError(validationResult as ValidatorErrors);
            }

            // get typescript data
            const rootDir = path.resolve(path.dirname(this.filePath));
            const resolvedTsconfigPath = path.join(
                rootDir,
                jsonData.tsconfig
            );
            const tsData = this.getTsConfigJsonContent(resolvedTsconfigPath);

            // read into the project object
            project = DefaultConfig.mergeDefaultProjectData({
                name: jsonData.name,
                author: jsonData.author,
                config: jsonData.config,
                description: jsonData.description,
                licence: jsonData.licence,
                outDir: tsData.options.outDir,
                printFileHeader: jsonData.printFileHeader,
                target: jsonData.target,
                version: jsonData.version,
                tsconfig: jsonData.tsconfig,
                stripOutDir: jsonData.stripOutDir,
                rootDir,
                parsedCommandLine: tsData
            });

        } catch (e) {

            if (e instanceof FileNotExistsError || e instanceof ValidationError) {
                throw e;
            } else {
                throw new UnexpectedError(`Error while parsing the qhun-cli.json file. Error was: ${e}`);
            }
        }

        return project;
    }

    private getTsConfigJsonContent(filePath: string): ts.ParsedCommandLine {

        // make some checks
        if (!fs.existsSync(filePath)) {
            throw new FileNotExistsError(`The declared tsconfig.json file was not found. Looking for: ${filePath}`);
        }

        // build context
        try {
            const commandLine = ts.parseCommandLine([]);
            const tsconfig = fs.readFileSync(filePath).toString();

            // read the json content
            const config = ts.parseConfigFileTextToJson(filePath, tsconfig);

            // look for errors
            if (config.error) {
                throw config.error;
            }

            // parse everything
            return ts.parseJsonConfigFileContent(
                config.config,
                ts.sys,
                path.dirname(filePath),
                commandLine.options
            );
        } catch (e) {
            throw new UnexpectedError(`Unexpected error while trying to parse the given ${filePath}. Error was: ${e.toString()}`);
        }
    }

    /**
     * validates the given json data
     * @param jsonData the json data to validate
     */
    private validateJsonConfig(jsonData: JsonConfig): boolean | ValidatorErrors {

        // construct the validator
        const validator = new Validator<JsonConfig>({
            rules: {
                // mandatory rules
                author: ValidatorRule.isString(1),
                licence: ValidatorRule.isString(1),
                version: ValidatorRule.isString(1),
                target: ValidatorRule.isInArray(Object.keys(TargetFactory.supportedTargets)),
                name: ValidatorRule.isString(1),
                tsconfig: ValidatorRule.pathExists(),
                // now the optional rules
                printFileHeader: ValidatorRule.optional(ValidatorRule.isBoolean()),
                description: ValidatorRule.optional(ValidatorRule.isString()),
                stripOutDir: ValidatorRule.optional(ValidatorRule.isString()),
                config: this.getConfigBlockValidationRules(jsonData.target)
            }
        });

        // validate against the given data
        if (!validator.validate(jsonData)) {
            return validator.getValidationErrors();
        }

        return true;
    }

    /**
     * get all validation rules for the given target
     * @param target the target to get the validation rules for
     */
    private getConfigBlockValidationRules(target: keyof SupportedTargets): ValidatorObject | ValidatorRule | ValidatorRule[] {

        // get the validator
        let validator: TargetConfigValidator;

        switch (target) {
            case "lua":
                validator = new LuaConfigValidator();
                break;
            case "wow":
                validator = new WowConfigValidator();
                break;
            default:
                // validation not nessesary
                return [];
        }

        // get the rules from the target config validator
        return validator.getRules();
    }
}

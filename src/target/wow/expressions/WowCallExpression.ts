import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";
import { UnsupportedError } from "../../../error/UnsupportedError";
import { PreProcessorFunction } from "../../../compiler/PreProcessor";
import { WowGlobalLibrary } from "../special";
import { WowConfig } from "../WowConfig";

export interface WowCallExpression extends BaseTarget<WowConfig>, Target, WowGlobalLibrary { }
export class WowCallExpression implements Partial<Target> {

    /**
     * transpiles a preprocessor call expression
     * @param node the call expression to transpile
     * @param fktnName the preprocessor function name
     */
    public transpilePreprocessorCallExpression(node: ts.CallExpression, fktnName: string): string {

        switch (fktnName) {

            case PreProcessorFunction.QHUN_TRANSPILER_REQUIRE:
                return this.transpilePreprocessorRequire(node);
            default:
                throw new UnsupportedError(`Given Preprocessor function ${fktnName} is unsupported on target wow`, node);
        }
    }

    /**
     * transpiles a require preprocessor function
     */
    private transpilePreprocessorRequire(node: ts.CallExpression): string {

        const [namespace, className] = node.arguments;
        const libName = this.getGlobalLibraryVariableName();

        // transpile arguments
        const transpiledNamespace = this.transpileNode(namespace);
        const transpiledClassName = this.transpileNode(className);

        // add require function
        this.addDeclaration(
            "global.require_lib",
            [
                "local function global_require_lib(namespace, className)",
                this.addSpacesToString(`return ${libName}.get(namespace)[className]`, 2),
                `end`
            ].join("\n")
        );

        // put everything together
        return `global_require_lib(${transpiledNamespace}, ${transpiledClassName})`;
    }
}

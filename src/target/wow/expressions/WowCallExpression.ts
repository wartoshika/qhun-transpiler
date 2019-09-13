import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";
import { UnsupportedError } from "../../../error/UnsupportedError";
import { PreProcessorFunction } from "../../../compiler/PreProcessor";
import { WowKeywords } from "../WowKeywords";

export interface WowCallExpression extends BaseTarget<"wow">, Target { }
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

        // transpile arguments
        const transpiledNamespace = this.transpileNode(namespace);
        const transpiledClassName = this.transpileNode(className);

        // add require function
        this.addDeclaration(
            "global.require_lib",
            [
                "local function global_require_lib(namespace, className)",
                this.addSpacesToString(`return ${WowKeywords.FILE_META_IMPORT_EXPORT}.get(namespace)[className]`, 2),
                `end`
            ].join("\n")
        );

        // put everything together
        return `global_require_lib(${transpiledNamespace}, ${transpiledClassName})`;
    }
}

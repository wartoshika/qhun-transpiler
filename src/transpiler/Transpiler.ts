import { ExpressionTranspiler } from "./ExpressionTranspiler";
import { DeclarationTranspiler } from "./DeclarationTranspiler";
import { DecoratorTranspiler } from "./DecoratorTranspiler";
import { StatementTranspiler } from "./StatementTranspiler";
import { MiscTranspiler } from "./MiscTranspiler";
import { Node, Identifier, SourceFile, BindingName } from "typescript";
import { Imports } from "../constraint";
import { TypeHelper } from "../util/TypeHelper";
import { Config } from "../Config";

export interface Transpiler<C extends Required<Config> = Required<Config>> {

    /**
     * transpiler for expressions
     */
    expression(): ExpressionTranspiler;

    /**
     * transpiler for declarations
     */
    declaration(): DeclarationTranspiler;

    /**
     * transpiler for decorators
     */
    decorator(): DecoratorTranspiler;

    /**
     * transpiler for statements
     */
    statement(): StatementTranspiler;

    /**
     * transpiler for misc code
     */
    misc(): MiscTranspiler;

    /**
     * get the type helper instance
     */
    typeHelper(): TypeHelper;

    /**
     * transpiles all kind of typescript nodes
     * @param node the node to transpile
     * @param originalNode when node is a on the fly created node, this can be used to determen the position of the error
     */
    transpileNode(node: Node, originalNode?: Node): string;

    /**
     * registers all given variable names
     * @param variables the variables to register
     */
    registerVariables(...variables: string[]): ThisType<Transpiler>;

    /**
     * register all given export variable names
     * @param exportVariables the export variables names to register
     */
    registerExport(...exportVariables: string[]): ThisType<Transpiler>;

    /**
     * register all given class names
     * @param classNames the class name variables to register
     */
    registerClass(...classNames: string[]): ThisType<Transpiler>;

    /**
     * register all given imports
     * @param imports the imports to register
     */
    registerImport(...imports: Imports[]): ThisType<Transpiler>;

    /**
     * set the currently transpiling sourceFile
     * @param sourceFile the new sourceFile
     */
    setSourceFile(sourceFile: SourceFile): void;

    /**
     * get the identifier name for the given identifier node or raw string.
     * this will auto obscurify the variable names when obscurify is set to true in the config.
     * @param identifier the identifier node or string to use as source
     */
    getIdentifierName(identifier: Identifier | BindingName | string): string;

    /**
     * get all registered classes in their occuring order
     */
    getRegisteredClasses(): string[];

    /**
     * get the current config
     */
    getConfig(): C;

    /**
     * adds optional space for readability
     * @param amount amount of space chars. default: 1
     */
    space(amount?: number): string;

    /**
     * adds optional break for readability or at lease one space char
     */
    break(): string;

    /**
     * adds optional break for readability or no space at all
     */
    breakNoSpace(): string;

    /**
     * adds the configured intend to every line of code
     * @param code the code to add the intend to
     * @param times when more nesting is necessary, tweak this parameter to add aditional spaces
     */
    addIntend(code: string, times?: number): string;

    /**
     * tries to determen the type of the given node
     * @param node the node to get the type for
     */
    typeOfNode(node: Node): string;
}
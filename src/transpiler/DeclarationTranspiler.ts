import { FunctionDeclaration, ImportDeclaration, InterfaceDeclaration, TypeAliasDeclaration, ExportDeclaration, ImportEqualsDeclaration, ClassDeclaration, ModuleDeclaration, EnumDeclaration, VariableDeclarationList, VariableDeclaration, MissingDeclaration } from "typescript";
import { PartialTranspiler } from "./impl/PartialTranspiler";

export interface DeclarationTranspiler extends PartialTranspiler {

    /**
     * transpile a function declaration
     * @param node the node to transpile
     */
    functionDeclaration(node: FunctionDeclaration): string;

    /**
     * transpiles an import declaration
     * @param node the node to transpile
     */
    importDeclaration(node: ImportDeclaration): string;

    /**
     * transpiles an interface declaration
     * @param node the node to transpile
     */
    interfaceDeclaration(node: InterfaceDeclaration): string;

    /**
     * transpiles a type alias declaration
     * @param node the node to transpile
     */
    typeAliasDeclaration(node: TypeAliasDeclaration): string;

    /**
     * transpiles an export declaration
     * @param node the node to transpile
     */
    exportDeclaration(node: ExportDeclaration): string;

    /**
     * transpiles a missing declaration
     * @param node the node to transpile
     */
    missingDeclaration(node: MissingDeclaration): string;

    /**
     * transpiles an import equals declaration
     * @param node the node to transpile
     */
    importEqualsDeclaration(node: ImportEqualsDeclaration): string;

    /**
     * transpiles a class declaration
     * @param node the node to transpile
     */
    classDeclaration(node: ClassDeclaration): string;

    /**
     * transpiles a module declaration
     * @param node the node to transpile
     */
    moduleDeclaration(node: ModuleDeclaration): string;

    /**
     * transpiles an enum declaration
     * @param node the node to transpile
     */
    enumDeclaration(node: EnumDeclaration): string;

    /**
     * transpiles a variable declaration list
     * @param node the node to transpile
     */
    variableDeclarationList(node: VariableDeclarationList): string;

    /**
     * transpiles a variable declaration
     * @param node the node to transpile
     */
    variableDeclaration(node: VariableDeclaration): string;
}
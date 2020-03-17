import { DeclarationTranspiler } from "../DeclarationTranspiler";
import { FunctionDeclaration, ImportDeclaration, InterfaceDeclaration, TypeAliasDeclaration, ExportDeclaration, ImportEqualsDeclaration, ClassDeclaration, ModuleDeclaration, EnumDeclaration, VariableDeclarationList, VariableDeclaration, Node, MissingDeclaration } from "typescript";
import { PartialSubTranspiler } from "./PartialSubTranspiler";


export abstract class AbstractDeclarationTranspiler extends PartialSubTranspiler<AbstractDeclarationTranspiler> implements DeclarationTranspiler {

    /**
     * @inheritdoc
     */
    public functionDeclaration(node: FunctionDeclaration): string {
        return this.constructClass("functionDeclaration").functionDeclaration(node);
    }

    /**
     * @inheritdoc
     */
    public importDeclaration(node: ImportDeclaration): string {
        return this.constructClass("importDeclaration").importDeclaration(node);
    }

    /**
     * @inheritdoc
     */
    public interfaceDeclaration(node: InterfaceDeclaration): string {
        return this.constructClass("interfaceDeclaration").interfaceDeclaration(node);
    }

    /**
     * @inheritdoc
     */
    public typeAliasDeclaration(node: TypeAliasDeclaration): string {
        return this.constructClass("typeAliasDeclaration").typeAliasDeclaration(node);
    }

    /**
     * @inheritdoc
     */
    public exportDeclaration(node: ExportDeclaration): string {
        return this.constructClass("exportDeclaration").exportDeclaration(node);
    }

    /**
     * @inheritdoc
     */
    public importEqualsDeclaration(node: ImportEqualsDeclaration): string {
        return this.constructClass("importEqualsDeclaration").importEqualsDeclaration(node);
    }

    /**
     * @inheritdoc
     */
    public classDeclaration(node: ClassDeclaration): string {
        return this.constructClass("classDeclaration").classDeclaration(node);
    }

    /**
     * @inheritdoc
     */
    public moduleDeclaration(node: ModuleDeclaration): string {
        return this.constructClass("moduleDeclaration").moduleDeclaration(node);
    }

    /**
     * @inheritdoc
     */
    public enumDeclaration(node: EnumDeclaration): string {
        return this.constructClass("enumDeclaration").enumDeclaration(node);
    }

    /**
     * @inheritdoc
     */
    public variableDeclarationList(node: VariableDeclarationList): string {
        return this.constructClass("variableDeclarationList").variableDeclarationList(node);
    }

    /**
     * @inheritdoc
     */
    public variableDeclaration(node: VariableDeclaration): string {
        return this.constructClass("variableDeclaration").variableDeclaration(node);
    }

    /**
     * @inheritdoc
     */
    public missingDeclaration(node: MissingDeclaration): string {
        return this.constructClass("missingDeclaration").missingDeclaration(node);
    }
}
import { PartialTranspiler } from "./PartialTranspiler";
import { DeclarationTranspiler } from "../DeclarationTranspiler";
import { FunctionDeclaration, ImportDeclaration, InterfaceDeclaration, TypeAliasDeclaration, ExportDeclaration, ImportEqualsDeclaration, ClassDeclaration, ModuleDeclaration, EnumDeclaration, VariableDeclarationList, VariableDeclaration, Node } from "typescript";
import { PartialTranspilerConstructor } from "../../constraint";

declare type Declarations = {
    [P in keyof AbstractDeclarationTranspiler]: AbstractDeclarationTranspiler[P] extends (node: Node) => string ? PartialTranspilerConstructor<DeclarationTranspiler, P> : never;
}

export abstract class AbstractDeclarationTranspiler extends PartialTranspiler implements DeclarationTranspiler {

    protected abstract transpilerFunctions: Declarations;

    private classStorage: {
        [P in keyof Declarations]?: any
    } = {};

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
     * constructs the given class and store the result. return from the cache if already constructed
     * @param transpilerClass 
     */
    private constructClass<A extends keyof Declarations>(part: A): InstanceType<Declarations[A]> {

        if (this.classStorage[part] === undefined) {
            this.classStorage[part] = new this.transpilerFunctions[part](this.transpiler);
        }
        return this.classStorage[part];
    }
}
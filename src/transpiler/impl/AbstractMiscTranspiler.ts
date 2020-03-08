import { PartialTranspiler } from "./PartialTranspiler";
import { DeclarationTranspiler } from "../DeclarationTranspiler";
import { FunctionDeclaration, ImportDeclaration, InterfaceDeclaration, TypeAliasDeclaration, ExportDeclaration, ImportEqualsDeclaration, ClassDeclaration, ModuleDeclaration, EnumDeclaration, VariableDeclarationList, VariableDeclaration, Node, Identifier, Block, StringLiteral, ArrayBindingPattern } from "typescript";
import { PartialTranspilerConstructor } from "../../constraint";
import { MiscTranspiler } from "../MiscTranspiler";

declare type Miscs = {
    [P in keyof AbstractMiscTranspiler]: AbstractMiscTranspiler[P] extends (node: Node) => string ? PartialTranspilerConstructor<MiscTranspiler, P> : never;
}

export abstract class AbstractMiscTranspiler extends PartialTranspiler implements MiscTranspiler {

    protected abstract transpilerFunctions: Miscs;

    private classStorage: {
        [P in keyof Miscs]?: any
    } = {};

    /**
     * @inheritdoc
     */
    public identifier(node: Identifier): string {
        return this.constructClass("identifier").identifier(node);
    }

    /**
     * @inheritdoc
     */
    public block(node: Block): string {
        return this.constructClass("block").block(node);
    }

    /**
     * @inheritdoc
     */
    public stringLiteral(node: StringLiteral): string {
        return this.constructClass("stringLiteral").stringLiteral(node);
    }

    /**
     * @inheritdoc
     */
    public firstLiteralToken(node: Node): string {
        return this.constructClass("firstLiteralToken").firstLiteralToken(node);
    }

    /**
     * @inheritdoc
     */
    public keyword(node: Node): string {
        return this.constructClass("keyword").keyword(node);
    }

    /**
     * @inheritdoc
     */
    public arrayBindingPattern(node: ArrayBindingPattern): string {
        return this.constructClass("arrayBindingPattern").arrayBindingPattern(node);
    }

    /**
     * constructs the given class and store the result. return from the cache if already constructed
     * @param transpilerClass 
     */
    private constructClass<A extends keyof Miscs>(part: A): InstanceType<Miscs[A]> {

        if (this.classStorage[part] === undefined) {
            this.classStorage[part] = new this.transpilerFunctions[part](this.transpiler);
        }
        return this.classStorage[part];
    }
}
import { Node, Identifier, Block, StringLiteral, ArrayBindingPattern, SpreadElement } from "typescript";
import { MiscTranspiler } from "../MiscTranspiler";
import { PartialSubTranspiler } from "./PartialSubTranspiler";

export abstract class AbstractMiscTranspiler extends PartialSubTranspiler<AbstractMiscTranspiler> implements MiscTranspiler {

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
     * @inheritdoc
     */
    public spreadElement(node: SpreadElement): string {
        return this.constructClass("spreadElement").spreadElement(node);
    }

}
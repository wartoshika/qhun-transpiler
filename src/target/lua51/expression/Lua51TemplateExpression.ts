import { PartialTranspiler } from "../../../transpiler/impl/PartialTranspiler";
import { ExpressionTranspiler } from "../../../transpiler";
import { TemplateExpression, createStringLiteral, createCall } from "typescript";
import { createTranspiledIdentifier } from "../extendedTypes/TranspiledIdentifier";

export class Lua51TemplateExpression extends PartialTranspiler implements Partial<ExpressionTranspiler> {

    /**
     * @inheritdoc
     */
    public templateExpression(node: TemplateExpression): string {

        const templates: string[] = [];

        // head available?
        if (node.head) {
            templates.push(this.transpiler.transpileNode(createStringLiteral(node.head.text)));
        }

        // add every span
        templates.push(...node.templateSpans.map(
            span => {

                // get the span text
                const text = this.transpiler.transpileNode(
                    createStringLiteral(span.literal.text)
                );

                // add the content
                const start = this.transpiler.transpileNode(
                    createCall(
                        createTranspiledIdentifier("tostring"),
                        undefined,
                        [span.expression]
                    )
                );
                let end = "";
                if (text.length > 0 && text !== "\"\"" && text !== "''") {
                    end = `${this.transpiler.space()}..${this.transpiler.space()}${text}`;
                }
                return start + end;
            }
        ));

        // join templates by string concat token
        const result = templates
            .filter(val => val.length > 0 && val !== "\"\"" && val !== "''")
            .join(`${this.transpiler.space()}..${this.transpiler.space()}`);

        // when the initial template string was empty, add an empty string to restore functionality
        if (result.length == 0) {
            return this.transpiler.transpileNode(createStringLiteral(""));
        }
        return result;
    }
}
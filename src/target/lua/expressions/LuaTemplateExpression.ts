import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";

export interface LuaTemplateExpression extends BaseTarget, Target { }
export class LuaTemplateExpression implements Partial<Target> {

    public transpileTemplateExpression(node: ts.TemplateExpression): string {

        // get the template head
        const templates: string[] = [
            this.transpileNode(ts.createStringLiteral(node.head.text))
        ];

        // add every span
        templates.push(...node.templateSpans.map(
            span => {

                // transpile expression
                const expression = this.transpileNode(span.expression);

                // get the span text
                const text = this.transpileNode(
                    ts.createStringLiteral(span.literal.text)
                );

                // add the content
                return `tostring(${expression}) .. ${text}`;
            }
        ));

        // join templates by string concat token
        return templates.join(" .. ");
    }
}

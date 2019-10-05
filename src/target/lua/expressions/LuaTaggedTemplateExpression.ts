import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";
import { Logger } from "../../../cli/Logger";
import { CommandLineColors } from "../../../cli/CommandLineColors";

export interface LuaTaggedTemplateExpression extends BaseTarget, Target { }
export class LuaTaggedTemplateExpression implements Partial<Target> {

    public transpileTaggedTemplateExpression(node: ts.TaggedTemplateExpression): string {

        // build the normal template
        const templates: string[] = [];

        // transpile the tag identifier
        const identifier = this.transpileNode(node.tag);

        // special raw transpile case
        if (identifier === "raw") {

            // get the template head if available
            if ((node.template as ts.TemplateExpression).head) {
                templates.push((node.template as ts.TemplateExpression).head.text);
            }

            // add every span
            if ((node.template as ts.TemplateExpression).templateSpans) {
                templates.push(...(node.template as ts.TemplateExpression).templateSpans.map(
                    span => {

                        // transpile expression
                        const expression = this.transpileNode(span.expression);

                        // get the span text
                        const text = span.literal.text;

                        // add the content
                        return `${expression} ${text}`;
                    }
                ));
            } else {
                const fullText = (node.template as ts.TemplateExpression).getText();
                templates.push(fullText.substring(1, fullText.length - 1));
            }

        } else {

            // normal transpile
            templates.push(
                // transpile the raw template
                this.transpileNode(node.template)
            );

            // unsupported warning
            Logger.warn(
                ts.SyntaxKind[node.kind] + " will currently only transpile to a normal " + ts.SyntaxKind[ts.SyntaxKind.TemplateExpression],
                "[Warning] ",
                CommandLineColors.YELLOW
            );
            Logger.logNodePosition(node);
        }

        // join templates by string concat token
        return templates.join("");
    }
}

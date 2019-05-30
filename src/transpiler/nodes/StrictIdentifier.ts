import * as ts from "typescript";

export class StrictIdentifier implements Partial<ts.Identifier>, Partial<ts.Expression> {

    public kind: ts.SyntaxKind.Identifier;
    public escapedText: ts.__String;
    public text: string;

    constructor(
        text: string
    ) {
        this.kind = ts.SyntaxKind.Identifier;
        this.text = text;
        this.escapedText = text as ts.__String;
    }
}

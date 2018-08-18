
// tslint:disable member-ordering
export class TranspilerFunctions {

    /**
     * replaces all reserved chars with temp chars
     * @param givenLiteral the current string literal
     */
    public static replaceReservedChars(givenLiteral: string): string {

        // replace all existences of backslash something. eg. \n or \t
        return givenLiteral
            .replace(/\n/g, "\\n")
            .replace(/\r/g, "\\r")
            .replace(/\t/g, "\\t");
    }

    /**
     * restores all original replaced chars
     * @param givenReplacedLiteral the current string literal
     */
    public static restoreReservedChars(givenReplacedLiteral: string): string {

        // currently no restore nessesary
        return givenReplacedLiteral;
    }
}

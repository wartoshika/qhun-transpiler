export class Obscurifier {

    private isCaseSensitive: boolean = false;
    private supportedCharacters: string[] = [];

    private obscurified: {
        [sourceFilePath: string]: {
            counter: number,
            identifiers: { [originalIdentifier: string]: string }
        }
    } = {};

    constructor() { this.createCharacterRange(); }

    public setCaseSensitive(newState: boolean): void {
        this.isCaseSensitive = newState;
        this.createCharacterRange();
    }

    public getObscurified(original: string, sourceFilePath: string): string {

        // initialize if empty
        if (!this.obscurified[sourceFilePath]) {
            this.obscurified[sourceFilePath] = {
                counter: 0,
                identifiers: {}
            };
        }

        // get already obscurified identifier if available
        if (this.obscurified[sourceFilePath].identifiers[original]) {
            return this.obscurified[sourceFilePath].identifiers[original];
        }

        // make a new obscurified identifier
        const obscurified = this.createObscurifiedIdentifier(this.obscurified[sourceFilePath].counter++);

        // store the newly created identifier
        this.obscurified[sourceFilePath].identifiers[original] = obscurified;
        return obscurified;
    }

    private createObscurifiedIdentifier(counter: number): string {

        const charIndexes: number[] = [];
        const maxChars = this.supportedCharacters.length;
        let iterationCounter = counter;

        const iterations = Math.ceil((counter + 1) / maxChars);
        for (let i = 0; i < iterations; i++) {

            const idx = iterationCounter % maxChars;
            charIndexes.unshift(idx);
            iterationCounter -= idx + maxChars;
        }

        // convert to concrete chars
        return charIndexes
            .map(idx => this.supportedCharacters[idx])
            .join("");
    }

    private createCharacterRange(): void {

        const ranges: [number, number][] = [
            // lower case
            [97, 122]
        ];
        if (this.isCaseSensitive) {

            // upper case
            ranges.push([65, 90]);
        }

        // iterate over supported ranges
        ranges.forEach(range => {

            // get ascii char
            for (let i = range[0]; i <= range[1]; i++) {
                this.supportedCharacters.push(String.fromCharCode(i));
            }
        });
    }
}
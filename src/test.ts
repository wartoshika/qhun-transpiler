function Decorator(): ClassDecorator {
    return <T extends Function>(target: T) => {
        return undefined;
    };
}

@Decorator()
export class Test {

    constructor(
        private name: string = "test"
    ) { }

    /**
     * get a value as test
     * @return string value
     */
    public getTest(): string {
        try {
            const q = this.name === "test" ? 1 : 2;
            return `${this.name} => hallo ${q}`;
        } catch (e) {
            return "___";
        }
    }

    /* test function */
    public typeof(): string {
        return typeof "a";
    }
}
new Test("hallo").getTest();
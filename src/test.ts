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

    public getTest(): string {
        const q = this.name === "test" ? 1 : 2;
        return `${this.name} => hallo ${q}`;
    }

    public typeof(): string {
        return typeof "a";
    }
}
new Test("hallo").getTest();
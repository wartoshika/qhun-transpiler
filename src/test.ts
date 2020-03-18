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
            return `${this.name} => hallo ${q} ${this.n()}`;
        } catch (e) {
            return "___";
        }
    }

    /* test function */
    public typeof(): string {

        const c = "".match(/a/g);

        return (typeof "a").split("").join("");
    }

    private n() {
        const str = "c";
        (str.split("hallo")).length;
        const arr = [1, 2];
        arr.map(n => n).join("").split("");
        const a = "".split("1").toString();
        return "test".length;
    }
}
new Test("hallo").getTest();
export function raw<R = string>(literals: TemplateStringsArray, ...values: any[]): R {

    let result = "";

    // interleave the literals with the placeholders
    for (let i = 0; i < values.length; i++) {

        result += literals[i];
        result += values[i];
    }

    // add the last literal
    result += literals[literals.length - 1];
    return result as any;
}

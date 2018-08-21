import { ValidatorRule } from "./ValidatorRule";

export type ObjectAccessor = { [index: string]: any };

export interface ValidatorObject<O extends ObjectAccessor = ObjectAccessor> {

    /**
     * the data accessor
     */
    rules: {
        [P in keyof O]?: ValidatorObject<O[P]> | ValidatorRule | ValidatorRule[]
    };

}

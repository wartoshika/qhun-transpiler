import { PartialTranspiler } from "./PartialTranspiler";
import { createTransformProxy } from "../../util/TransformProxy";
import { Node } from "typescript";
import { PartialTranspilerConstructor, AllTranspilers } from "../../constraint";

declare type Section<T extends PartialTranspiler> = {
    [P in keyof T]: T[P] extends (node: Node) => string ? PartialTranspilerConstructor<T, P> : never;
}

export abstract class PartialSubTranspiler<T extends PartialTranspiler> extends PartialTranspiler {

    protected abstract transpilerFunctions: Section<T>;

    private classStorage: {
        [P in keyof Section<T>]?: any
    } = {};

    /**
     * constructs the given class and store the result. return from the cache if already constructed
     * @param transpilerClass 
     */
    protected constructClass<A extends keyof Section<T>>(part: A): InstanceType<Section<T>[A]> {

        if (this.classStorage[part] === undefined) {
            this.classStorage[part] = createTransformProxy(
                new this.transpilerFunctions[part](this.transpiler),
                this.transpiler, part as keyof AllTranspilers,
                this.transpiler.getConfig()
            );
        }
        return this.classStorage[part];
    }
}
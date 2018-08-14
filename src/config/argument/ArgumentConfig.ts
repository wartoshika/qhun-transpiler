import { SupportedTargets } from "../../target/TargetFactory";

export interface ArgumentConfig {

    /**
     * the target language
     */
    target: keyof SupportedTargets;

    /**
     * the file that should be transpiled
     */
    file: string;
}

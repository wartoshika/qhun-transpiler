import { SupportedTargets, SupportedTargetConfig } from "../target/TargetFactory";

export interface ApiConfiguration<T extends keyof SupportedTargets> {

    /**
     * project related meta information. Missing details will be read from your package.json file.
     */
    project?: {

        /**
         * name of the project
         */
        name: string;

        /**
         * version of the project in semver format
         */
        version: string;

        /**
         * the author of the project
         */
        author: string;

        /**
         * the license of the project
         */
        license: string;

        /**
         * a longer description of the project
         */
        description: string;
    };

    /**
     * print a file header in each generated file. this include the owner, version and a description
     * @default false
     */
    printFileHeader?: boolean;

    /**
     * contains the target language as key
     */
    target?: T;

    /**
     * a config block for different transpiler targets
     */
    targetConfig?: SupportedTargetConfig[T];

    /**
     * the name of the directory where your sourcecode lies in.
     * @default "src"
     */
    directoryWithSource?: string;
}

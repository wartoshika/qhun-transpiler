export interface DefaultConfigGetter<C> {

    /**
     * get the default config block entry for the target
     */
    getDefaultConfig(): Partial<C> & { [index: string]: any };
}

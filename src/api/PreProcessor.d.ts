/**
 * dynamicly requires a class by its path
 * @param namespace the complete relative path from the project root folder including the file name when no exported class name is given
 * @param exportedClassName the name of the class export
 */
declare function QHUN_TRANSPILER_REQUIRE<T extends Object>(namespace: string, exportedClassName: string): T;
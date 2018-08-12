import * as ts from "typescript";

export class LuaSpecialFunctions {

    /**
     * resolves shorhand parameters
     * @param argumentStack the current argument stack
     */
    public static resolveShorthandCallback(argumentStack: ts.NodeArray<ts.Expression>, typeChecker: ts.TypeChecker): ts.NodeArray<ts.Expression> {

        return ts.createNodeArray(argumentStack.map(arg => {
            if (ts.isArrowFunction(arg)) {

                // test if the given body is an expression instead of a block
                if (!ts.isBlock(arg.body)) {
                    // create a block and append the return statement
                    const returnStatement = ts.createReturn(arg.body);
                    arg.body = ts.createBlock(
                        ts.createNodeArray([returnStatement])
                    );
                }
            }

            return arg;
        }));
    }
}

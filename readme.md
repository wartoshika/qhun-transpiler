# Qhun Transpiler

[![npm version](https://badge.fury.io/js/%40wartoshika%2Fqhun-transpiler.svg)](https://www.npmjs.com/package/@wartoshika/qhun-transpiler)
[![Dependencies](https://david-dm.org/wartoshika/qhun-transpiler.svg)](https://david-dm.org/wartoshika/qhun-transpiler)
[![Known Vulnerabilities](https://snyk.io/test/npm/@wartoshika/qhun-transpiler/badge.svg)](https://snyk.io/test/npm/@wartoshika/qhun-transpiler)

Service | Master | Dev  |
----    | ----   | ---- |
CI Status | [![Build Status](https://travis-ci.org/wartoshika/qhun-transpiler.svg?branch=master)](https://travis-ci.org/wartoshika/qhun-transpiler) | [![Build Status](https://travis-ci.org/wartoshika/qhun-transpiler.svg?branch=dev)](https://travis-ci.org/wartoshika/qhun-transpiler) |
Coverage | [![Coverage Status](https://coveralls.io/repos/github/wartoshika/qhun-transpiler/badge.svg?branch=master)](https://coveralls.io/github/wartoshika/qhun-transpiler?branch=master) | [![Coverage Status](https://coveralls.io/repos/github/wartoshika/qhun-transpiler/badge.svg?branch=dev)](https://coveralls.io/github/wartoshika/qhun-transpiler?branch=dev) |


## **Description**

This tool helps to transpile [Typescript](https://github.com/Microsoft/TypeScript) into lua. The main goal was to support every aspect of Typescript. Typescript 2 and 3 are supported!

**The following languages are currently supported:**
- [LUA](https://www.lua.org/)
- World of Warcraft LUA Addon interpreter

## **Installation & Help**

```console
$ npm install -g --save-dev @wartoshika/qhun-transpiler
$ qhun-transpiler -h
```

## **Setup**

You can run `qhun-transpiler --init` on the command line to automaticly create a `qhun-transpiler.js` file. This file will include the API
and let you transpile all your files. The interfaces of the API are intellisense optimized and if you use a modern editor or IDE you should get
information of the possible options.

This is an example of how your file could look like:

```js
const Transpiler = require("@wartoshika/qhun-transpiler");

new Transpiler.Api("lua", {
    entrypoint: "./src/index.ts"
}).transpile().subscribe(pipeline => {

    pipeline.persistAllFiles()
        .prettyPrintResult()
        .applyPostProjectTranspile();

});
```

**Some explanation**: The first argument will tell the transpiler what your target is. The second argument is completly optional but let you
configure the process of transpiling. These are the supported options:

- **`entrypoint`?: string**: Relative path to the root file of your project
- **`compilerOptions`?: CompilerOptions**: Advanced options used by the Typescript compiler. Use at your risk :)
- **`watch`?: boolean**: Watches for file changes and automaticly trigger the transpiling process
- **`overwrite`?: complex**: See the [overwrite](#Overwrite) section for details.
- **`configuration`?: ApiConfiguration**: More configuration. See below.

**ApiConfiguration**

- **`project`?: complex**: Project related meta information. Missing details will be read from your package.json file.
- **`printFileHeader`?: boolean**: Print a file header in each generated file. This include the owner, version and a description
- **`targetConfig`?: complex**: A config block for different transpiler targets. See the [documentation](#Documentation) section for more details.
- **`directoryWithSource`?: string**: Targets to the sub directory of your project where your sourcecode is located. Eg. src

## **Overwrite**:

When the transpiled result does not fit your needs or you want to include a feature that is not directly supported by the transpiler, you can configure a feature overwrite within this configuration block.

This is an example where the break-keyword transpiling is overwritten:

```js
const Transpiler = require("@wartoshika/qhun-transpiler");
const ts = require("typescript");

new Api("lua", {
    entrypoint: "./src/index.ts",
    overwrite: {
        [ts.SyntaxKind.BreakKeyword]: (node, nodeTranspiler, original) => {

            // yay, some info :)
            console.log("There was a break keyword while transpiling!");

            // use the original transpiler function to transpile a break keyword
            const originalTranspiledCode = original(node);

            // append some other transpiled sourcecode
            // the nodeTranspiler function comes from within the transpiler and
            // is able to transpile every ts.Node type object.
            const appendNewCode = nodeTranspiler(
                // this will transpile the numeric literal 2
                ts.createNumericLiteral("2")
            );

            // add the new code after the break keyword
            // the result in this example will be: break 2
            return originalTranspiledCode + " " + appendNewCode;
        }
    }
}).transpile().subscribe(pipeline => {

    pipeline.persistAllFiles().prettyPrintResult().applyPostProjectTranspile();

});
```

## **Documentation**

You can find a documentation file for the desired target in the `doc` folder.
  
- [Lua documentation](./doc/lua.md)
- [WoW documentation](./doc/wow.md)

## **Known bugs in latest release**
- When using a number indexed object at default values in functions.
- BITOPS OR does not work as expected in certain cases

## **License**

MIT license. See [LICENSE](./LICENSE) for more details.
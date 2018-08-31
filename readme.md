# Qhun Transpiler

[![npm version](https://badge.fury.io/js/%40wartoshika%2Fqhun-transpiler.svg)](https://www.npmjs.com/package/@wartoshika/qhun-transpiler)
![Dependencies](https://david-dm.org/wartoshika/qhun-transpiler.svg)
[![Known Vulnerabilities](https://snyk.io/test/npm/@wartoshika/qhun-transpiler/badge.svg)](https://snyk.io/test/npm/@wartoshika/qhun-transpiler)
| Service | Master | Dev |
| ------- | ------ | --- |
| CI Status | [![Build Status](https://travis-ci.org/wartoshika/qhun-transpiler.svg?branch=master)](https://travis-ci.org/wartoshika/qhun-transpiler) | [![Build Status](https://travis-ci.org/wartoshika/qhun-transpiler.svg?branch=dev)](https://travis-ci.org/wartoshika/qhun-transpiler) |
| Coverage | [![Coverage Status](https://coveralls.io/repos/github/wartoshika/qhun-transpiler/badge.svg?branch=master)](https://coveralls.io/github/wartoshika/qhun-transpiler?branch=master) | [![Coverage Status](https://coveralls.io/repos/github/wartoshika/qhun-transpiler/badge.svg?branch=dev)](https://coveralls.io/github/wartoshika/qhun-transpiler?branch=dev) |


## **Description**

This command line tool helps to transpile [Typescript](https://github.com/Microsoft/TypeScript) into other languages. The main goal was to support every aspect of Typescript. Every Typescript version >= 2 & < 3 is supported. Typescript 3 will be supported when my dependencies can handle Typescript 3.

**The following languages are currently supported:**
- [LUA](https://www.lua.org/)
- World of Warcraft LUA Addon interpreter

## **Installation & Help**

```console
$ npm install -g --save-dev @wartoshika/qhun-transpiler
$ qhun-transpiler -h
```

There are two possible ways of transpiling your sourcecode into other languages.
1. Creating a JSON file containing project relevant information (recommended).
2. Passing required data via command line arguments.

## **Requirements and usage when using the JSON based setup**

- You need to create a JSON file next to a `tsconfig.json` file.
- Call the executable file of qhun-transpiler using the `-p` argument.
    - *Example*: `$ qhun-transpiler -p ./qhun-transpiler.json`

The `qhun-transpiler.json` file must have the following structure:

```json
{
    "name": "The name of your program/project",
    "version": "The version number as string of your program/project",
    "author": "Your name",
    "licence": "Your licence",
    "description": "A longer description of your program/project",
    "printFileHeader": true, // a boolean value that indicates that a text will be added to each file.
    "stripOutDir": "src",  // the name of the folder where you put your sourcecode in. Eg. src. Leave this empty if your code is not stored in one source folder
    "target": "The target name. Eg. lua",
    "tsconfig": "the relative path to the tsconfig.json file including its name",
    "config": {
        // A config block that varies between each target. See the target documentation for details
    }
}
```

The `tsconfig.json` file will tell the transpiler wich files shoule be transpiled. Please refer to the [tsconfig.json Documentation](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html).

Every file will be translated into the given target language. The directory where to put those files is stored in the `tsconfig.json` file. Please refer to its [documentation](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html).

## **Requirements and usage when using arguments**

- There are no requirements.
- Call the executale and pass the following arguments:
    - `-t` The target language. Eg. lua
    - `-f` The path to the file that should be transpiled

An example executable path could be `$ qhun-transpiler -t lua -f ./myTypescriptFile.ts`

The transpiles file will be placed next to the original file. The file extension will be changed to the target language's file extension.

## **Documentation**

You can find a documentation file for the desired target in the `doc` folder.
  
- [Lua documentation](./doc/lua.md)
- [WoW documentation](./doc/wow.md)

## **License**

MIT license. See [LICENSE](./LICENSE) for more details.
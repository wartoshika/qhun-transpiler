# QhunCli

This command line tool helps to transpile [Typescript](https://github.com/Microsoft/TypeScript) into other languages. The main goal was to support every aspect of Typescript. 

**The following languages are currently supported:**
- [LUA](https://www.lua.org/)
- World of Warcraft LUA Addon interpreter

## **Installation & Help**

```console
$ npm install -g --save-dev @wartoshika/qhun-cli
$ qhun-cli -h
```

After the installation you need to create a `qhun-cli.json` file at project root level.

## **Requirements**

- Your project need to have a valid `tsconfig.json` at project root level.
    - The module resolution shoule be `node`

## **Usage**

Here are some examples for the usage:
- `qhun-cli -p .` *(Transpiles everything in your current project)*
- `qhun-cli -p ../../path/to/your/project` *(Will try to locate your project)*
- `qhun-cli -h` *(prints the help page)*

## **Supported Typescript -> LUA features**

- Variable declaration
- Binary expressions (including Unary prefix and postfix)
- Class declaration and heritage, class usage, interfaces
    - Private, protected and public declaration of constructor properties
    - Static and non static property declaration
    - Abstract and non abstract methods
    - Decorators (Currently property decorators only)
- Function and Arrowfunction declaration
- If, switch and for statements
- Special functions (*Array.forEach(), Array.join(), Array.push(), Object.keys(), String.length, String.trim(), String.split(), String.replace(), String.substr()*)
- Named module import / export
- Typeof and instanceof checks
- Enums
- String, numeric, object and array literals
- Computed properties

# `qhun-cli.json` file structure

This is the definition of the structure:

```ts
declare type QhunCliData = {
    name: string,           // The name of your project
    version: string,        // the version of your project
    author: string,         // The author(s)
    description: string,    // A longer description
    licence: string,        // The licence of your project
    entry: string,          // The entry file including the file extension
    outDir: string,         // The destination directory where to put the transpiled files
    copy: {                 // All files that shoule be copied to the destination folder
        from: string,
        to: string,
        relative: string
    }[],
    config: {}              // A target depenting config (see each section for a declaration and description)
}
```

<details><summary>Structure with examples for <b>LUA</b> target</summary>
<p>

```json
{
    "name": "YourProgramName",
    "version": "1.0.0",
    "author": "Your name",
    "description": "A long description!",
    "licence": "Your licence",
    "entry": "./src/index.ts",
    "target": "lua",
    "outDir": "./dist",
    "copy": [
        {
            "from": "./lib/lua/Library.lua",
            "to": "./lib/Library.lua",
            "relative": "lib/Library.lua"
        }
    ],
    "config": {}
}
```

</p>
</details>

<details><summary>Structure with examples for <b>WoW</b> target</summary>
<p>

```json
{
    "name": "QhunCoreTS",
    "version": "1.0.0",
    "author": "wartoshika <dev@qhun.de>",
    "description": "A long description!",
    "licence": "MIT",
    "entry": "./src/core.ts",
    "target": "wow",
    "outDir": "./dist",
    "copy": [
        {
            "from": "./lib/lua/Library.lua",
            "to": "./lib/Library.lua",
            "relative": "lib/Library.lua"
        }
    ],
    "config": {
        "visibleName": "QhunCore|c00ff0000TS |c0000ff00[Lib]",
        "interface": 80000,
        "optionalDependencies": [
            "QhunDebug",
            "QhunUnitTest"
        ],
        "dependencies": [],
        "savedVariables": [],
        "savedVariablesPerCharacter": []
    }
}
```

</p>
</details>
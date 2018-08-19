# Qhun Transpiler -> WoW target

This transpiler target is called `wow` and can be used to transpile Typescript into a World of Warcraft compatible addon. Since the target language is LUA, most of the supported LUA statements are supported in the `wow` target.

If you are developing a World of Warcraft addon in Typescript you should always use a json config file.

## What you should keep in mind when writing typescript code:

1. Please have a look at the `lua` target [keep in mind section](./lua.md).
2. The World of Warcraft addon system need an aditional TOC file to load your addon. This file will be generated automaticly including metadata and a reference to all files. These files are sorted by usage (Entry point goes last, files with no dependencies goes first).
3. The addon system doens't have a `require()` mechanism. To load more than one file a library class will be generated to support multiple files.
4. The generated TOC file name is sanitized to fit the naming conversion. The name is taken from the `qhun-transpiler.json` section `name` and only supported chars will stay.
5. There is currently no support for `xml` files. You need to setup your interface in the program source.

## WoW target config block

The config block of your `qhun-transpiler.json` file looks like the following structure:

```json
{
    "other config entries...": "",
    "config": {
        "visibleName": "Your addon name in the interface",
        "interface": 80000,
        "optionalDependencies": [
            "Optional dependencies as string array"
        ],
        "dependencies": [
            "Forced dependencies as string array"
        ],
        "savedVariables": [
            "the name of global saved variables"
        ],
        "savedVariablesPerCharacter": [
            "the name of saved variables per character"
        ]
    }
}
```

**Step by step:**
- `visibleName`: This name will be visible when viewing the addon overview. You can use colors. An example can be: `QhunUnitHealth|c00ff0000TS`
- `interface`: The supported interface version as number
- `optionalDependencies`: Every optional addon dependency. You can add multiple addon names.
- `dependencies`: Every addon that needs to be available before your addon loads. If one addon is missing, your addon wont load.
- `savedVariables`: All variables that will be persisted between game sessions. This variable will be shared between all Characters of all realms.
- `savedVariablesPerCharacter`: All variables that will be persisted for one character only.
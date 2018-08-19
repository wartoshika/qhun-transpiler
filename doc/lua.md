# Qhun Transpiler -> LUA target

This transpiler target is called `lua` and can be used to transpile Typescript into LUA. The emitted lua output is compatible with LUA version 5.1. I am sure that newer LUA version are supported as well, but i havn't tested it.

## What is supported?

- [Classes and heritage](https://www.typescriptlang.org/docs/handbook/classes.html)
- New expressions
- [Interfaces](https://www.typescriptlang.org/docs/handbook/interfaces.html) *(Will be omitted in the output)*
- [Enums](https://www.typescriptlang.org/docs/handbook/enums.html)
- [Named module and namespace imports](https://www.typescriptlang.org/docs/handbook/modules.html)
- [Named and namespace exports](https://www.typescriptlang.org/docs/handbook/modules.html)
- Multiple return values (See below)
- [Functions and arrowfunctions](https://www.typescriptlang.org/docs/handbook/functions.html) including signature overload
- [Delete operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/delete)
- [Variable declarations](https://www.typescriptlang.org/docs/handbook/variable-declarations.html)
- [Literal expressions](https://www.typescriptlang.org/docs/handbook/advanced-types.html)
- [Prefix and suffix unary expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Arithmetic_Operators#Inkrement_())
- Binary expressions including [bitops](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators)
- Template strings
- Typeof and instanceof statements
- For, ForIn, ~~ForOf~~, Do and While statements
- [Spread element](https://basarat.gitbooks.io/typescript/docs/spread-operator.html) in every context
- Computed properties
- Builtin Array functions
    - [Array.join()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/join)
    - [Array.push()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push)
    - [Array.forEach()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/foreach)
    - [Array.map()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)
    - [Array.filter()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)
- Builtin String functions
    - [String.replace()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace)
    - [String.split()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/split)
    - [String.substr()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/substr)
    - [String.trim()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/trim)
- Builtin Object functions
    - [Object.keys()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys)
- Builtin Math functions
    - The lua equivalent will be used. [See the lua documentation for more help](http://lua-users.org/wiki/MathLibraryTutorial).
- [Switch statements](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/switch)
- [If, else, elseif](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else)
- [Try catch finally](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch)
- [Throw statement](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/throw)
- [Type casts](https://basarat.gitbooks.io/typescript/docs/types/type-assertion.html) *(Will be omitted in the emitted files)*
- [Conditional expressions (Tenary expressions)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator)
- Magic properties
    - [Array.length](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/length)
    - [String.length](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/length)
- [Decorators](https://www.typescriptlang.org/docs/handbook/decorators.html)
    - ~~Class level decorators~~
    - Property level decorator
    - Method level decorator *(Not fully supported)*
    - ~~Parameter level decorator~~
    - Decorator factories

## What you should keep in mind when writing typescript code:

1. Lua does not know about the difference between the `let` and `const` statement. Same as javascript `ES5`. These are just hints at compilertime and will be lost at runtime.
2. You should use array destructing only for getting values from a multireturn function. See this example:
```typescript
// myTypescriptFile.ts
const [a, b, c, , e] = myMultiReturnFunction()
```
Will be transpiled to:
```lua
-- theGeneratedLuaFile.lua
local a, b, c, _, e = myMultiReturnFunction()
```
3. To support multireturn the tuple or array literal is used to achive this. When returning an array literal, the transpiler will use a multireturn. If a variable is returned, no matter the type, it will not be a multireturn. Example:
```ts
// this function will return multiple values
function myFunc(): [number, string] {
    return [1, "test"]
}
// this function will NOT return multiple values
function myOtherFunc(): [number, string] {
    const a = [1, "test"];
    return a;
}
```
Will be transpiled to:
```lua
-- this function will return multiple values
local function myFunc()
    return 1, "test"
end
-- this function will NOT return multiple values
local function myOtherFunc()
    local a = {1, "test"}
    return a
end
```

## Config block

Each target has a config block section in the `qhun-transpiler.json` file. So LUA does does. This block is currently empty and is reversed for future releases to configure the transpiling process.
# Changelog

The qhun-transpiler project uses [Semantic Versioning](https://semver.org/spec/v2.0.0.html). Please consider every version below 1.0.0 as developement release and it may be unstable.

## Todo for the next release

- Nothing

##  Implemented but unreleased

- Fixed a bug where wow target could not reflect class expressions

## **0.7.0** released 2018-11-17

- Support for ClassExpressions (#2)
- Transpiler now exit with a correct exit code (#1)

## **0.6.0** released 2018-11-10

- Fixed a bug in lua and wow target that causes string literals in an object context to be generated without the nessesary computed property wrapper brackets.
- Fixed a bug in wow target where path building for external files targeted the wrong file.
- Fixed a bug in lua and wow target where MappedTypes with array values were not detected as arrays
- Fixed a bug in String.match.
- Added Array.some(...)
- Fixed a bug in lua and wow target where shorthand arrow function usage has been transpiled without return statement

##  **0.5.0** released 2018-10-20

- Added the possability to add external node_modules sources as embeded dependency (targets: lua, wow)
- [Wow target] Global __library var is now unique per addon to allow multiple addons that uses qhun-transpiler for ts->lua transpiling
- Fixed a bug where non static properties in classes using the this keyword outside of functions breaks because of the non existing self var
- Fixed a bug in the wow post transpiling process where saved variables were not added to the toc file
- Added namespace reflection to adress the origin path of the file relative to its project root at compile time
- [Wow target] Added a preprocessor function to dynamicly require files by its namespace and class name
- [Wow target] Added a file meta var to get vararg values like addon name. Variable name is __FILE_META
- Added an api folder that contains transpiler specific preprocessor functions and may contain future api files to the transpiler

## **0.4.0** released 2018-10-06

- Reflection for the lua and wow target
- This arg support when declaring a function that has an explicit this arg.
- Array.slice() partial support
- Class decorators experimental support
- Parameter decorator experimental support
- DotDotDot token for array destructing assignment
- fixed some minor and major bugs in the class heritage design
- added more unit tests to cover more features
- String.match() and RegularExpressionLiteral support for lua and wow target
- Function.bind(...) added
- *.toString(base?) added

## **0.3.0** released 2018-09-01

- Added changelog file for future feature change tracking.
- Added documentation for currently supported targets.
- Added most of the typescript feature to `lua` and `wow` target
- Support of Typescript 3
- string.charAt()
- string.split()
- string.toLowerCase()
- string.toUpperCase()
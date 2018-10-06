# Changelog

The qhun-transpiler project uses [Semantic Versioning](https://semver.org/spec/v2.0.0.html). Please consider every version below 1.0.0 as developement release and it may be unstable.

## Todo for the next release

- Nothing

##  Implemented but unreleased

- Nothing

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
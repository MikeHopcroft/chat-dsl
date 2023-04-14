## Instructions for GitHub Codespaces

1. Navigate your browser to [the repo](https://github.com/MikeHopcroft/chat-dsl).
1. Click on the green button labeled `<> Code`.
![Codespaces](/docs/assets/codespaces.png)
1. Click the `+` button to the right of the text that says *"Codespaces, Your Workspaces in the Cloud"*.
1. A new Codespace will start up. It will take a few minutes for it to build the dev container.
1. When the Codespace is ready, Visual Studio Code will open in the browser.
1. In the terminal at the bottom of Visual Studio Code, type the following:
~~~shell
@User ➜ /workspaces/chat-dsl (main) $ yarn install
@User ➜ /workspaces/chat-dsl (main) $ tsc
@User ➜ /workspaces/chat-dsl (main) $ node build/src/apps/example1.js
~~~

## Domain Specific Language
`Syngery` provides a minimalist dataflow-style programming language for LLMs to perform computations.
A function in this language, consists of a number of alias bindings, followed by a single `return` or `use` statement. In the following example, the first three lines define aliases that are referenced in expressions on the last three lines. The last line defines an expression that represents the return value of the function, which in this case is the result of calling the `foobar()` function.

~~~
a = 1
b = mul(c, 2)
c = add(a, 3)
return foobar(b, true, "hello")
~~~

Note that the alias bindings are not assignments of values to variables - they just associate an alias with an expression, so that the expression can be referenced elsewhere in the program. This allows on to construct dataflows that are directed acyclic graphs or DAGs.

Note, also, that the expression bound to an alias will never be executed more than once, even if the alias appears in multiple expressions.

Finally, keep in mind that all functions run asynchonously. The execution model is to evaluate the return expression and everything it depends on with maximal parallelism. Any reachable function will be evaluated as soon as its parameters become available.

### Primitives
* Numbers - anything that matches `-?\d+(\.\d+)?`. The intention is to extend this to handle any type that is valid for the Javascript `Number()` function.
* Booleans - `true` and `false`.
* Strings - anything that matches `/^"[^"]*"/`. The intention is to eventually support all Javascript string literals and escaping.

### Tuples
Tuples are comma-separted lists of expressions, e.g.:
* []
* [1, 2, 3]
* [1, true, "hello"]
* [[false, [1, 2]], ["hello", true], 3]
* [a, b, add(3, 4), 2]

### Aliases
Anything that matches `/[a-zA-Z_]+[a-zA-Z_0-9]*/` and is not a reserved word like `true`, `false`, and `return`. The intention is to eventually support any valid Javascript identifier. Examples include
* abc
* foo123
* foo_bar3_baz

### Function Calls
TBD - write about skills and skill repository here.

### Comments and whitespace
TBD - write about comments and whitespace here.

### Return and Use
All DSL programs end with either a `return` statement or a `use` statement. 

The `return` statement indicates that the value of its expression should be exported to the return value of the LLM skill that authored the DSL program. This is typically the way LLM skills return answers. Here are two examples. 

The first is a degenerate dsl just returns a string literal that was provided by the LLM as the answer to its prompt:

```
~~~dsl
return "The meaning of life is 52!"
~~~
```

The second returns a value produced by another skill:
```
~~~dsl
return prime_factorization(125)
~~~
```
The `use` statement indicates that the value of its expression should be returned to the LLM skill that authored the DSL program, so that it can continue processing. In this case, the LLM will be asked for a new completion, based on the concatenation of the original prompt, the dsl program, and the value returned by the `use` statement.


### Grammar

~~~
PROGRAM: ALIAS_DEC* RETURN | USE

ALIAS_DEC: ALIAS '=' EXPRESSION

RETURN: 'return' EXPRESSION

USE: 'use' EXPRESSION

EXPRESSION: <number> | <boolean> | <string> | <identifier> | TUPLE | FUNCTION_CALL

TUPLE: '[' (EXPRESSION (',' EXPRESSION)*)? ']'

FUNCTION_CALL: <identifier> '(' (EXPRESSION (',' EXPRESSION)*)? ')'
~~~

## Invoking DSL Programs

An LLM can invoke a DSL program by generating a response that is a fenced-code block of type `dsl`. For example, an LLM could generate the following response:

```
~~~dsl
fragments = searchVectorStore("cats")
return summarize(fragments)
~~~
```

This would search the vector store for text fragments relating to cats, and then pass the resulting fragments to another function that produces a summary of the fragments. That second function is probably implemented as an LLM skill with a prompt that specifies how to summarize the fragments.

The LLM skill returns the answer as a fenced code block of the type `answer`:

```
~~~answer
Cats are a common household pet, known for their independent and often aloof nature. They are carnivorous mammals with sharp claws and teeth, and are skilled hunters. They come in a variety of breeds, sizes, and colors, and are known for their playful and curious personalities. Cats are also valued for their ability to provide companionship and emotional support to their owners.
~~~
```


# TODO List

* Cleanup
  * x index.ts files for subdirs
  * x result() method to skills folder
  * x run() method to dsl folder
  * x apps folder
    * x program.ts to example.ts
    * x Update README.md
  * x any in llm-skill
  * Rename parse-results.ts and evaluate()
  * Tags for regions
  * Chat memory (scenario: execute code block, append result, continue)
    * How do you know when the LLM is done?
* Handlebars option for HTML escaping
* Better example and documentation
* Logging
  * By UUID and time stamp.
  * Print log
    * Call tree
    * Verbose mode
* Running DSLs in skills
* Filtering skills in repository
* Running different types of fenced code blocks (e.g. dsl, TypeScript)
* Tactical
  * Generate entire prompt with
    * Instructions for writing DSLs
    * Documentation for skills
    * Example skills
  * LLM skill
    * x Prompt skeleton
    * x Handlebars templates
    * x Injecting parameters
    * . Extracting results
    * . Run method
    * . Extracting return values from skills
* Parser
  * Numbers - floats, NaN, Infinity
  * Strings - single + double quotes, escaping
* Repo structure
  * Separate node.js dependencies from web dependencies
  * Monrepo for react app?
  * x Move dsl to dsl folder
* REPL
  * commander
  * REPL
    * chat:
    * dsl:
    * prompt prompt_name
    * log/trace on/off, level, names 
    * quit
  * History
  * History save
* Skills repository
  * Skills repository query and continue from skill
  * Skill chaining
* LLMSkill
  * Configure system message with building blocks
    * System message builder / template
  * Async axios call for completion
  * Extract DSL
  * Run DSL
* Better error message for type mismatch
  * Error decoding
  * Need type serializer
* Skills repository
  * Global skills repository
  * LLM skill template
  * Skill summaries
  * x ASTFunction takes function name, rather than lambda
  * x Consider combining Skill and FunctionDeclaration
  * x Consider typing skills by function type instead of P and R
  * x check() looks up skill
  * x eval() looks up skill
  * x Parser generates ASTFunction
  * x Unit tests
* Parser
  * Floats
  * x Negative numbers
  * x Functions
    * x Skill repository
    * x Type checking
* Unit tests
  * Skill repository
  * x ASTTuple
  * . Cycle detection
    * Error formatting
    * Chalk formatting
  * x SymbolTable
  * . TypeCheckingContext
  * x EvaluationContext
  * Parser
* x Implement tuple node
* x Type system unit tests
* Combine type validation with cycle detection
  * May prefer class over function because of need for type checking method that is specific to type of node.
* Type checking
  * Convert from functions to classes
    * Payload
      * x Line number or character span (TokenPosition)
      * References (for cycle detection and type checking)
      * x io-ts (or other) type
      * Parser for type annotations
  * Compile time
    * Investigate io-ts
    * Implement a slice of io-ts
  * Runtime
* x Cycle detection for references - runtime or compile time
  * x Runtime check - add enter/leave context calls
  * x Compile time checks
    * Annotate function with set of direct references. Compute indirect reference chains after compilation. Might want to add line number parameter to function.
    * Replace function with a class. Have method for refernce graph and method for eval graph.
* x README.md
* x Dev container and CodeSpaces
* x Grammar for DSL
* x Parser for DSL
* x Set up unit testing


Typing scenarios
* Ensure that DSL programs are well-formed
  * Know literal types (string, number, boolean)
  * Know skill parameter and return types
  * Know composite types
    * Array
    * Tuple
    * |
    * Optional
  * Any
* Reduce the chance that skills are incorrectly typed
  * Compile-time t.TypeOf<X> method used to verify function signature
  * Run-time t.toString() method used to generate TS type as a string for skill registration

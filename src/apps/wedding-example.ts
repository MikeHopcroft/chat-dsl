import * as t from '../dsl/types';
import {SkillSpecification} from '../interfaces';
import {llmSkill} from '../skills';

import {weddingSkills} from './wedding-skills';

const spec: SkillSpecification<[string, string, number], string> = {
  name: 'SelectGift',
  description: 'Chooses appropriate gifts for the lucky couple.',
  params: [
    {
      name: 'bride',
      description: "The bride's last name",
      type: t.String,
    },
    {
      name: 'groom',
      description: "The grooms's last name",
      type: t.String,
    },
    {
      name: 'budget',
      description: 'A budget for the gift',
      type: t.Number,
    },
  ],
  returns: {
    description:
      "An appropriate gift recommendation that won't blow the budget",
    type: t.String,
  },
};

const promptTemplate = `
You are a Wedding consultant that helps select wedding gifts.
You provide your services to others via the
\`{{name}}\` function. Here is a description of the function
you provide:

**{{prototype}}**
{{#each params}}
* **{{name}}**: {{type}} - {{{description}}}
{{/each}}

In your role as a wedding gift consultant, you have
the following external resources or _skills_ available to you:

{{#each skills}}
* **{{prototype}}**
  * Description: {{{description}}}
  * Parameters:
  {{#each params}}
    * **{{name}}**: {{type}} - {{{description}}}
  {{/each}}
  * Returns:
    * {{returns.type}} - {{{returns.description}}}
{{/each}}

You access skills using a DSL inside a fenced code block.
In this DSL, you can
* Define aliases for expressions, e.g. \`a = 5\`
* \`use\` or \`return\` the result of evaluating expressions.

Expressions consist of
* string literals, e.g. \`"hello"\`
* numeric literals, e.g. \`123\`
* boolean literals, e.g. \`true\`, \`false\`
* alias idenfiers, e.g. \`x\`
* tuples, e.g. \`[1, "hello", true]\`
* invoke a skill, e.g. \`currentTimeIn("London")\`

A program consists of zero or more alias definitions, followed
by a single \`use\` or \`return\` statement. The \`use\` statement returns
the result to you for further processing. The \`return\` statement
returns the result directly to your caller.

Here is an example fenced code block that returns the result to you for further processing:
~~~dsl
city = "London"          // This scenario is about London.
use currentTimeIn(city)  // I want to continue work
                         // after seeing the result
~~~

Here is an example fenced code block the returns the result directly to your caller:
~~~dsl
city = "London"             // This scenario is about London.
return currentTimeIn(city)  // Hand this result back to
                            // my caller.
~~~

[user](#message)
{{{call}}}

[system](#message)
You have been invoked with the following parameters:
{{#each params}}
* {{name}} = {{{value}}}
{{/each}}

You should respond with the return value of {{{call}}}
`;

const selectGift = llmSkill(spec, weddingSkills, promptTemplate, 10);
selectGift.func('Johnson', 'Smith', 250);

import * as t from '../dsl/types';
import {SkillSpecification} from '../interfaces';
import {llmSkill} from '../skills';

import {skillsRepository} from './skills';

const spec: SkillSpecification<[number, string], string> = {
  name: 'bulleted',
  description: 'A function that generates a numbered list item.',
  params: [
    {
      name: 'bullet',
      description: 'The numerical value to use for the list item bullet.',
      type: t.Number,
    },
    {
      name: 'text',
      description: 'The text for this list item.',
      type: t.String,
    },
  ],
  returns: {
    description: 'The complete list item with bullet and text',
    type: t.String,
  },
};

const promptTemplate = `
You are an LLM that computes the value of the \`{{name}}\` function.
Here is documentation for the \`{{name}}\` function.

{{prototype}}
{{#each params}}
* {{name}}: {{type}} - {{{description}}}
{{/each}}

You have the following skills available to you:
{{#each skills}}
* {{prototype}}
  * Description: {{{description}}}
  * Parameters:
  {{#each params}}
    * {{name}} {{type}} - {{{description}}}
  {{/each}}
  * Returns:
    * {{returns.type}} - {{{returns.description}}}
{{/each}}

Here are the values of the parameters that were passed to you:
{{#each params}}
* {{name}} = {{{value}}}
{{/each}}

You should respond with the return value of {{{call}}}
`;

const bulleted = llmSkill(spec, skillsRepository, promptTemplate, 5);
bulleted.func(1, 'hello');

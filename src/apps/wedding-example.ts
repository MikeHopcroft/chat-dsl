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
You are a Wedding consultant that helps selects wedding gifts.
Here is documentation for the \`{{name}}\` function.

{{prototype}}
{{#each params}}
* {{name}}: {{type}} - {{{description}}}
{{/each}}

You have the following external resources or skills available to you:
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

const selectGift = llmSkill(spec, weddingSkills, promptTemplate, 10);
selectGift.func('Johnson', 'Smith', 250);

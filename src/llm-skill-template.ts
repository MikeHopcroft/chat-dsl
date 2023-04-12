export const llmSkillTemplate = `
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

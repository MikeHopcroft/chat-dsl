import chalk from 'chalk';

export async function invokeMockLLM(
  prompt: string,
  uuid: string,
  call: string,
  iteration: number
) {
  console.log(
    chalk.green(
      `LLM call ${uuid}: ${call} ${iteration && `(iteration ${iteration})`}`
    )
  );

  // TODO: log uuid, call site, and prompt here.

  // Pretend to make call to LLM and then return hard-coded response
  // here, based on the call.
  let result = '';
  if (call === 'bulleted(1, "hello")') {
    if (iteration === 0) {
      // First iteration hard-coded to demonstrate `use` semantics.
      result = '~~~dsl\na=1\nb=2\nuse add(a,b)\n~~~';
    } else {
      // Second iteration hard-coded to demonstrate `return` semantics.
      result = '~~~dsl\na=3\nb=4\nreturn mul(a,b)\n~~~';
    }
  } else {
    result = '~~~dsl\nreturn 123\n~~~';
  }

  return result;
}

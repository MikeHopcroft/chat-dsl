export async function invokeLLM(prompt: string, uuid: string, call: string) {
  console.log('======================================');
  console.log(`LLM call ${uuid}: ${call} `);
  console.log('Prompt:');
  console.log(prompt);

  // TODO: log uuid, call site, and prompt here.

  let result = '';
  if (call === 'bulleted(1, "hello")') {
    result = '~~~dsl\na=1\nb =2\nreturn add(a,b)\n~~~';
  } else {
    result = '~~~dsl\nreturn 123\n~~~';
  }

  console.log('LLM returns:');
  console.log(result);

  return result;
}

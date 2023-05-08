import chalk from 'chalk';

const johnsonBio =
  'Elizabeth Johnson is a 27-year-old marketing professional from New York City. She grew up in a close-knit family and has always been passionate about art and design. Elizabeth is known for her impeccable sense of style and her ability to make anyone feel at ease in her presence. She loves spending time outdoors and enjoys hiking and camping in her spare time.';
const smithBio =
  'Henry Smith is a 30-year-old software engineer from San Francisco. He is a bit of a tech nerd and has always been fascinated by how things work. Henry is a problem solver by nature and enjoys the challenge of tackling complex coding projects. In his free time, he enjoys playing video games and watching science fiction movies. Henry is also an avid traveler and has been to over 20 countries around the world.';

export async function invokeMockLLM(
  prompt: string,
  uuid: string,
  call: string,
  iteration: number
) {
  console.log(
    chalk.green(`LLM call ${uuid}: ${call} (iteration ${iteration})`)
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
  } else if (call === 'SelectGift("Johnson", "Smith", 250)') {
    const steps = [
      `~~~dsl
gifts = WeddingRegistryFor("Johnson", "Smith")
use Prices(gifts)
~~~`,
      `
~~~dsl
johnsonBio = Research("Johnson")
smithBio = Research("Smith")
use [johnsonBio, smithBio]
~~~`,
      `
~~~dsl
return ChooseGift(["toaster oven: $199","blender: $79","Hawaii cruise: $2000"], "${johnsonBio}", "${smithBio}", 250)
~~~`,
    ];
    result = steps[iteration];
  } else {
    result = '~~~dsl\nreturn 123\n~~~';
  }

  return result;
}

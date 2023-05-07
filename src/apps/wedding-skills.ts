import * as t from '../dsl/types';
import {Skill} from '../interfaces';
import {SkillsRepository} from '../skills';

const weddingRegistryFor: Skill<[string, string], [string, string, string]> = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  func: (bride: string, groom: string) =>
    Promise.resolve(['toaster oven', 'blender', 'Hawaii cruise']),
  params: [
    {name: 'bride', description: "Bride's last name", type: t.String},
    {name: 'groom', description: "Groom's last name", type: t.String},
  ],
  returns: {
    description: 'Top three gifts in registry',
    type: t.Tuple(t.String, t.String, t.String),
  },
  name: 'WeddingRegistryFor',
  description: 'Look up gifts in a wedding registry.',
};

const prices: Skill<[[string, string, string]], [string, string, string]> = {
  func: (gifts: [string, string, string]) =>
    Promise.resolve([
      `${gifts[0]}: $199`,
      `${gifts[1]}: $79`,
      `${gifts[2]}: $2000`,
    ]),
  params: [
    {
      name: 'gifts',
      description: 'A tuple of three gifts',
      type: t.Tuple(t.String, t.String, t.String),
    },
  ],
  returns: {
    description: 'Tuples of gifts with prices',
    type: t.Tuple(t.String, t.String, t.String),
  },
  name: 'Prices',
  description: 'Look up prices for gifts.',
};

export const johnsonBio =
  'Elizabeth Johnson is a 27-year-old marketing professional from New York City. She grew up in a close-knit family and has always been passionate about art and design. Elizabeth is known for her impeccable sense of style and her ability to make anyone feel at ease in her presence. She loves spending time outdoors and enjoys hiking and camping in her spare time.';
export const smithBio =
  'Henry Smith is a 30-year-old software engineer from San Francisco. He is a bit of a tech nerd and has always been fascinated by how things work. Henry is a problem solver by nature and enjoys the challenge of tackling complex coding projects. In his free time, he enjoys playing video games and watching science fiction movies. Henry is also an avid traveler and has been to over 20 countries around the world.';

const research: Skill<[string], string> = {
  func: (lastName: string) => {
    if (lastName === 'Johnson') {
      return Promise.resolve(johnsonBio);
    } else if (lastName === 'Smith') {
      return Promise.resolve(smithBio);
    } else {
      return Promise.resolve(`No information available for ${lastName}`);
    }
  },
  params: [{name: 'lastName', description: 'Last name', type: t.String}],
  returns: {description: 'A biographical sketch', type: t.String},
  name: 'Research',
  description: "Research a person's gift preferences.",
};

const chooseGift: Skill<
  [[string, string, string], string, string, number],
  string
> = {
  func: (
    pricedGifts: [string, string, string],
    brideBio: string,
    groomBio: string,
    budget
  ) =>
    Promise.resolve(
      pricedGifts[(brideBio.length + groomBio.length + budget) % 3]
    ),
  params: [
    {
      name: 'pricedGifts',
      description: 'A tuple of three gifts with prices',
      type: t.Tuple(t.String, t.String, t.String),
    },
    {
      name: 'brideBio',
      description: 'A brief biography of the bride',
      type: t.String,
    },
    {
      name: 'groomBio',
      description: 'A brief biography of the groom',
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
      "A recommendation for an appropriate gift that doesn't break the budget",
    type: t.String,
  },
  name: 'ChooseGift',
  description:
    "Chooses an appropriate gift for the bride and groom, that doesn't break the budget.",
};

export const weddingSkills = new SkillsRepository();
weddingSkills.add(weddingRegistryFor);
weddingSkills.add(prices);
weddingSkills.add(research);
weddingSkills.add(chooseGift);

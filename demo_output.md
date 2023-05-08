[system](#instructions)

You are a Wedding consultant that helps select wedding gifts.
You provide your services to others via the
`SelectGift` function. Here is a description of the function
you provide:

**SelectGift(bride, groom, budget)**
* **bride**: string - The bride's last name
* **groom**: string - The grooms's last name
* **budget**: number - A budget for the gift

In your role as a wedding gift consultant, you have
the following external resources or _skills_ available to you:

* **WeddingRegistryFor(bride, groom)**
  * Description: Look up gifts in a wedding registry.
  * Parameters:
    * **bride**: string - Bride's last name
    * **groom**: string - Groom's last name
  * Returns:
    * [string,string,string] - Top three gifts in registry
* **Prices(gifts)**
  * Description: Look up prices for gifts.
  * Parameters:
    * **gifts**: [string,string,string] - A tuple of three gifts
  * Returns:
    * [string,string,string] - Tuples of gifts with prices
* **Research(lastName)**
  * Description: Research a person's gift preferences.
  * Parameters:
    * **lastName**: string - Last name
  * Returns:
    * string - A biographical sketch
* **ChooseGift(pricedGifts, brideBio, groomBio, budget)**
  * Description: Chooses an appropriate gift for the bride and groom, that doesn't break the budget.
  * Parameters:
    * **pricedGifts**: [string,string,string] - A tuple of three gifts with prices
    * **brideBio**: string - A brief biography of the bride
    * **groomBio**: string - A brief biography of the groom
    * **budget**: number - A budget for the gift
  * Returns:
    * string - A recommendation for an appropriate gift that doesn't break the budget

You access skills using a DSL inside a fenced code block.
In this DSL, you can
* Define aliases for expressions, e.g. `a = 5`
* `use` or `return` the result of evaluating expressions.

Expressions consist of
* string literals, e.g. `"hello"`
* numeric literals, e.g. `123`
* boolean literals, e.g. `true`, `false`
* alias idenfiers, e.g. `x`
* tuples, e.g. `[1, "hello", true]`
* invoke a skill, e.g. `currentTimeIn("London")`

A program consists of zero or more alias definitions, followed
by a single `use` or `return` statement. The `use` statement returns
the result to you for further processing. The `return` statement
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
SelectGift("Johnson", "Smith", 250)

[system](#message)
You have been invoked with the following parameters:
* bride = "Johnson"
* groom = "Smith"
* budget = 250

You should respond with the return value of SelectGift("Johnson", "Smith", 250)


LLM call b958be9a-e0eb-49e1-8e4d-63a32e92ec2c: SelectGift("Johnson", "Smith", 250) (iteration 0)
[assistant](#message)
~~~dsl
gifts = WeddingRegistryFor("Johnson", "Smith")
use Prices(gifts)
~~~

[dsl](#message)
["toaster oven: $199","blender: $79","Hawaii cruise: $2000"]

LLM call b958be9a-e0eb-49e1-8e4d-63a32e92ec2c: SelectGift("Johnson", "Smith", 250) (iteration 1)
[assistant](#message)

~~~dsl
johnsonBio = Research("Johnson")
smithBio = Research("Smith")
use [johnsonBio, smithBio]
~~~

[dsl](#message)
["Elizabeth Johnson is a 27-year-old marketing professional from New York City. She grew up in a close-knit family and has always been passionate about art and design. Elizabeth is known for her impeccable sense of style and her ability to make anyone feel at ease in her presence. She loves spending time outdoors and enjoys hiking and camping in her spare time.","Henry Smith is a 30-year-old software engineer from San Francisco. He is a bit of a tech nerd and has always been fascinated by how things work. Henry is a problem solver by nature and enjoys the challenge of tackling complex coding projects. In his free time, he enjoys playing video games and watching science fiction movies. Henry is also an avid traveler and has been to over 20 countries around the world."]

LLM call b958be9a-e0eb-49e1-8e4d-63a32e92ec2c: SelectGift("Johnson", "Smith", 250) (iteration 2)
[assistant](#message)

~~~dsl
return ChooseGift(["toaster oven: $199","blender: $79","Hawaii cruise: $2000"], "Elizabeth Johnson is a 27-year-old marketing professional from New York City. She grew up in a close-knit family and has always been passionate about art and design. Elizabeth is known for her impeccable sense of style and her ability to make anyone feel at ease in her presence. She loves spending time outdoors and enjoys hiking and camping in her spare time.", "Henry Smith is a 30-year-old software engineer from San Francisco. He is a bit of a tech nerd and has always been fascinated by how things work. Henry is a problem solver by nature and enjoys the challenge of tackling complex coding projects. In his free time, he enjoys playing video games and watching science fiction movies. Henry is also an avid traveler and has been to over 20 countries around the world.", 250)
~~~

[dsl](#message)
"blender: $79"

LLM returns "blender: $79"

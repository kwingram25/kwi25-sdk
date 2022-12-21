# kwi26-sdk

This is a basic promise-based TypeScript SDK for [TheOneApi](https://the-one-api.dev).

```ts
import { TheOneApi, Character } from 'kwingram25-sdk';

const lotr = new TheOneApi({ apiKey: 'YOUR_API_KEY' });

// Fetch all characters
const characters = lotr.character.list()
    .then((characters: Character[]) => {
        console.log(characters);
    })
    .catch(console.error);

// Fetch one movie
const rotk = lotr.movie.withId('5cd95395de30eff6ebccde5d');
console.log(await rotk.get());

// Fetch all quotes from a movie
console.log(await rotk.quotes());

// Fetch book chapters
const chapters = await lotr.book.withId(')

// Search for quotes
const quotes = await lotr.quotes.list({
    filter: { 'dialog': { 'eq': '/[Ss]amwise/' } },
    sort: { key: 'book', asc: true }
})
```

## List Querying
```ts
// Each lotr.*.list() call, as well as *.quotes() and *.chapters(), accepts the following options:
type ListOptions<D extends Document> = {
  pagination?: {
    offset?: number;
    limit?: number;
    page?: number;
  };
  sort?: {
    key: keyof D;
    asc: boolean;
  };
  filter?: {
    [key in keyof D]?:
      | { gt: number }     // Greater than
      | { lt: number }     // Less than
      | { gte: number }    // Greater than or equal
      | { inc: string[] }  // Includes
      | { exc: string[] }  // Excludes
      | { exist: boolean } // Exists: true/false
      | { eq: string }     // Match or regex match
      | { neq: string };   // Does not match or regex match
  };
};
```

## Dependencies
* [Typescript-Starter](https://github.com/bitjson/typescript-starter) - initial module/ESM boilerplate
* [Axios](https://axios.io) - browser/Node friendly fetching

## Running
```
git clone https://github.com/kwingram25-sdk
cd ./kwingram25-sdk
yarn install

# Tests
TEST_API_KEY=your-key yarn test
```

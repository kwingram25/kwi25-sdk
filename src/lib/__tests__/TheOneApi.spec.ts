import test from 'ava';

import TheOneApi from '../TheOneApi';

const apiKey = process.env.TEST_API_KEY || '';

const fotrBook = '5cf5805fb53e011a64671582';
const rotkMovie = '5cd95395de30eff6ebccde5d';
const aragorn = '5cd99d4bde30eff6ebccfbe6';

const ones = {
  book: [fotrBook, 'name', 'The Fellowship Of The Ring'],
  chapter: ['6091b6d6d58360f988133b8b', 'chapterName', 'A Long-expected Party'],
  character: [aragorn, 'name', 'Aragorn II Elessar'],
  movie: [rotkMovie, 'name', 'The Return of the King'],
  quote: [
    '5cd96e05de30eff6ebcce80b',
    'dialog',
    'Now come the days of the King. May they be blessed.',
  ],
};

let lotr: TheOneApi;

test.before(() => {
  lotr = new TheOneApi({ apiKey });
});

['movie', 'character', 'book', 'quote', 'chapter'].forEach((domain) => {
  test(`${domain}: list`, async (t) => {
    const list = await lotr[domain].list();

    t.not(list.length, 0);
    t.snapshot(list);
  });

  test(`${domain}: get one`, async (t) => {
    const [id, key, value] = ones[domain];

    const one = await lotr[domain].withId(id).get();

    t.truthy(one);
    t.is(one && one[key], value);
  });
});

test('movies: get quotes', async (t) => {
  const quotes = await lotr.movie.withId(rotkMovie).quotes();

  t.truthy(quotes);
  t.truthy(quotes.length > 0);
});

test('characters: get quotes', async (t) => {
  const quotes = await lotr.character.withId(aragorn).quotes();

  t.truthy(quotes);
  t.truthy(quotes.length > 0);
});

test('books: get chapters', async (t) => {
  const chapters = await lotr.book.withId(fotrBook).chapters();

  t.truthy(chapters);
  t.truthy(chapters.length > 0);
});

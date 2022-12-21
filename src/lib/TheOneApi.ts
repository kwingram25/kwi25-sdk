import axios, { AxiosRequestConfig } from 'axios';

import {
  ApiDomain,
  ApiObject,
  ApiOptions,
  ApiResult,
  BookDocument,
  BookObject,
  ChapterDocument,
  ChapterObject,
  CharacterDocument,
  CharacterObject,
  Document,
  Domain,
  Domain$WithQuotes,
  ListOptions,
  MovieDocument,
  MovieObject,
  QuoteDocument,
  QuoteObject,
} from '../types';

import { prepareListParams } from './prepareListParams';

const API_BASE_URL = 'https://the-one-api.dev/v2';

/**
 * The primary class for using this SDK. Instantiate one instance and
 * provide a valid API key from your the-one-api account.
 *
 * ### Example
 * ```js
 * import { TheOneApi } from 'kwingram25-sdk';
 *
 * export const lotr = new TheOneApi({ apiKey: 'YOUR_API_KEY' });
 * ```
 *
 * @param options - initialization options
 * @param options.apiKey - your API key
 */
export default class TheOneApi {
  /**
   * Base axios fetch method
   * @param path The api fragment to append to the base URL
   * @param params GET query parameters in object form
   * @param withToken Indicates whether to provide the API key - done in all calls except for Books
   * @returns
   */
  async #fetch<D extends Document>(
    path: string,
    params: AxiosRequestConfig<unknown>['params'],
    withToken?: boolean
  ) {
    return this.#axios.get<ApiResult<D>>(path, {
      params,
      headers: {
        'Content-Type': 'application/json',
        ...(withToken ? { Authorization: `Bearer ${this.#apiKey}` } : {}),
      },
    });
  }

  /**
   * Fetches an array of documents, mapping to one of the primary list endpoints
   * @param domain The desired object type
   * @param options The query options, to be converted to GET parameters
   * @returns The resulting array of documents
   */
  async #list<D extends Document>(
    domain: Domain,
    options: ListOptions<D> = {}
  ): Promise<D[] | null> {
    return this.#fetch<D>(
      domain,
      prepareListParams(options),
      domain !== Domain.Book
    )
      .then((response) => {
        return response.data.docs || null;
      })
      .catch((e) => {
        console.error(e);

        return null;
      });
  }

  /**
   * Fetches a single record of the passed type with the provided ID
   */
  async #get<D extends Document>(
    domain: Domain,
    id: string
  ): Promise<D | null> {
    return this.#fetch<D>(`${domain}/${id}`, {}, domain !== Domain.Book)
      .then((response) => {
        if (response.data.docs.length === 0) {
          return null;
        }
        return response.data.docs[0];
      })
      .catch((e) => {
        console.error(e);

        return null;
      });
  }

  /**
   * Fetches quotes associated with the passed entity, either a Movie or Character id
   */
  async #getQuotes(
    domain: Domain$WithQuotes,
    id: string,
    options: ListOptions<QuoteDocument>
  ) {
    return this.#fetch<QuoteDocument>(
      `${domain}/${id}/quote`,
      prepareListParams(options),
      true
    )
      .then((response) => {
        return response.data.docs || null;
      })
      .catch((e) => {
        console.error(e);

        return null;
      });
  }

  /**
   * Fetches quotes associated with the passed Book id
   */
  async #getChapters(id: string, options: ListOptions<ChapterDocument>) {
    return this.#fetch<ChapterDocument>(
      `/book/${id}/chapter`,
      prepareListParams(options),
      true
    )
      .then((response) => {
        return response.data.docs || null;
      })
      .catch((e) => {
        console.error(e);

        return null;
      });
  }

  /**
   * Creates an ```ApiDomain``` interface with ```list``` and ```get``` query methods
   */
  #createDomain<D extends Document, O extends ApiObject<D>>(
    domain: Domain
  ): ApiDomain<D, O> {
    const withQuotes = [Domain.Movie, Domain.Character].includes(domain);
    const withChapters = domain === Domain.Book;

    return {
      list: (params) => this.#list<D>(domain, params),
      withId: (id) => ({
        get: () => this.#get<D>(domain, id),
        ...(withChapters
          ? {
              chapters: (options: ListOptions<ChapterDocument>) =>
                this.#getChapters(id, options),
            }
          : {}),
        ...(withQuotes
          ? {
              quotes: (options: ListOptions<QuoteDocument>) =>
                this.#getQuotes(domain as Domain$WithQuotes, id, options),
            }
          : {}),
      }),
    } as unknown as ApiDomain<D, O>;
  }

  /**
   * Creates a new TheOneApi instance with domain methods for book, chapter, character, movie, and quote
   * @param options The options to pass on construction, currently limited to the desired api key
   */
  constructor({ apiKey }: ApiOptions) {
    if (!apiKey) {
      throw new Error('You must provide a valid API key');
    }

    this.#apiKey = apiKey;

    this.book = this.#createDomain(Domain.Book);
    this.chapter = this.#createDomain(Domain.Chapter);
    this.character = this.#createDomain(Domain.Character);
    this.movie = this.#createDomain(Domain.Movie);
    this.quote = this.#createDomain(Domain.Quote);
  }

  #apiKey: string;
  #axios = axios.create({
    baseURL: API_BASE_URL,
  });

  /**
   * Interface for querying books
   *
   * ```js
   * // Fetch all books
   * const allBooks = await lotr.book.list();
   *
   * // Fetch a book with the specified ID
   * const book = await lotr.book.withId('5cf5805fb53e011a64671582').get();
   * // { 'name: 'The Fellowship of the Ring', ... }
   *
   * // Fetch a book's chapters
   * const chapters = await lotr.book.withId('5cf5805fb53e011a64671582').chapters();
   * ```
   */
  public book: ApiDomain<BookDocument, BookObject>;

  /**
   * Interface for querying movies
   *
   * ```js
   * // Fetch all movies
   * const allMovies = await lotr.movie.list();
   *
   * // Fetch a movies with the specified ID
   * const rotk = await lotr.movie.withId('5cd95395de30eff6ebccde5d');
   * console.log(await rotk.get());
   * // { 'name: 'The Return of the King', ... }
   *
   * // Fetch a character's quotes
   * console.log(await rotk.quotes());
   * ```
   */
  public movie: ApiDomain<MovieDocument, MovieObject>;

  /**
   * Interface for querying characters
   *
   * js```
   * // Fetch all characters
   * const allCharacters = await lotr.character.list();
   *
   * // Fetch a character with the specified ID
   * const aragorn = lotr.character.withId('5cd99d4bde30eff6ebccfbe6');
   * console.log(await aragorn.json());
   * // { 'name: 'Aragorn II Elessar', ... }
   *
   * // Fetch a character's quotes
   * console.log(await aragorn.quotes());
   * ```
   */
  public character: ApiDomain<CharacterDocument, CharacterObject>;

  /**
   * Interface for querying quotes
   *
   * js```
   * // Fetch all quotes
   * const allQuotes = await lotr.quote.list();
   *
   * // Fetch a quote with the specified ID
   * const quote = await lotr.quote.withId('5cd96e05de30eff6ebcce80b').get();
   * // { 'dialog: 'Now come the days of the King. May they be blessed.', ... }
   * ```
   */
  public quote: ApiDomain<QuoteDocument, QuoteObject>;

  /**
   * Interface for querying book chapters
   *
   * js```
   * // Get a list of all chapters
   * const allChapters = lotr.chapter.list();
   *
   * // Get a chapter with the specified ID
   * const chapterOne = lotr.chapter.withId('6091b6d6d58360f988133b8b').get();
   * // { 'chapterName: 'A Long-expected Party', ... }
   * ```
   */
  public chapter: ApiDomain<ChapterDocument, ChapterObject>;
}

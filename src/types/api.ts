import {
  BookDocument,
  ChapterDocument,
  CharacterDocument,
  Document,
  MovieDocument,
  QuoteDocument,
} from './models';

/**
 * Represents the basic data models and their associated API endpoint fragment
 */
export enum Domain {
  Book = '/book',
  Chapter = '/chapter',
  Movie = '/movie',
  Character = '/character',
  Quote = '/quote',
}

/**
 * Helper to indicate domains that require the ```quotes``` list method
 */
export type Domain$WithQuotes = typeof Domain.Movie | typeof Domain.Character;

/**
 * API class initialization object
 */
export interface ApiOptions {
  apiKey: string;
}

/**
 * Interface for a returned API result
 */
export interface ApiResult<T extends Document> {
  docs: T[];
  total: number;
  limit: number;
  offset: number;
  page: number;
  pages: number;
}

/**
 * The main interface for querying one of the main five data types,
 * either as a filtered/paginated/sorted list or by a single id
 */
export interface ApiDomain<D extends Document, O extends ApiObject<D>> {
  /**
   * Fetch a list of documents with the given options applied
   */
  list: (_?: ListOptions<D>) => Promise<D[] | null>;
  /**
   * Exposes a ```get``` accessor and helper functions for the object with the given id
   */
  withId: (_: string) => O;
}

/**
 * Collection query options
 */
export type ListOptions<D extends Document> = {
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
      | { gt: number }
      | { lt: number }
      | { gte: number }
      | { inc: string[] }
      | { exc: string[] }
      | { exist: boolean }
      | { eq: string }
      | { neq: string };
  };
};

/**
 * Represents a single document to be retrieved by its ID, with a method
 * to fetch immediately and potentially ones for fetching related records
 */
export interface ApiObject<D extends Document> {
  get: () => Promise<D | null>;
}

/**
 * ```Book``` object with ```get``` and ```chapters``` list queries
 */
export interface BookObject extends ApiObject<BookDocument> {
  chapters: (
    _?: ListOptions<ChapterDocument>
  ) => Promise<ChapterDocument[] | null>;
}

/**
 * ```Movie``` object with ```get``` and ```quotes``` list queries
 */
export interface MovieObject extends ApiObject<MovieDocument> {
  quotes: (_?: ListOptions<QuoteDocument>) => Promise<QuoteDocument[] | null>;
}

/**
 * ```Character``` object with ```get``` and ```quotes``` list queries
 */
export interface CharacterObject extends ApiObject<CharacterDocument> {
  quotes: (_?: ListOptions<QuoteDocument>) => Promise<QuoteDocument[] | null>;
}

/**
 * ```Chapter``` object with a ```get``` query
 */
export type ChapterObject = ApiObject<ChapterDocument>;

/**
 * ```Quote``` object with a ```get``` query
 */
export type QuoteObject = ApiObject<QuoteDocument>;

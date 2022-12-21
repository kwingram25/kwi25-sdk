/**
 * Base type for a retrieved document
 */
export interface Document {
  id: string;
}

/**
 * Interface for a returned Book result
 */
export interface BookDocument extends Document {
  name: string;
}

/**
 * Interface for a returned Chapter result
 */
export interface ChapterDocument extends Document {
  chapterName: string;
  book: string;
}

/**
 * Interface for a returned Movie result
 */
export interface MovieDocument extends Document {
  name: string;
  runtimeInMinutes: number;
  budgetInMillions: number;
  boxOfficeRevenueInMillions: number;
  academyAwardNominations: number;
  academyAwardWins: number;
  rottenTomatoesScore: number;
}

/**
 * Interface for a returned Character result
 */
export interface CharacterDocument extends Document {
  height: string;
  race: string;
  gender: string;
  birth: string;
  spouse: string;
  death: string;
  realm: string;
  hair: string;
  name: string;
  wikiUrl: string;
}

/**
 * Interface for a returned Quote result
 */
export interface QuoteDocument extends Document {
  dialog: string;
  movie: string;
  character: string;
}

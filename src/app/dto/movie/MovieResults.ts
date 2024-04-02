import {MovieDto} from "./MovieDto";

export interface MovieResults {
  page: number;
  results: MovieDto[];
  total_results: number;
  total_pages: number;
}

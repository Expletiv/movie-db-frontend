import {Injectable} from '@angular/core';
import {MovieDetails, SortOption, TMDB} from "tmdb-ts";
import {environment} from "../../../environments/environment";
import {MovieResults} from "../../dto/movie/MovieResults";
import {map, Observable} from "rxjs";
import {fromPromise} from "rxjs/internal/observable/innerFrom";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {MyWatchProviders} from "../../dto/providers/watch-providers";

@Injectable({
  providedIn: 'root'
})
export class TmdbApiService {

  private tmdbApi: TMDB = new TMDB(environment.tmdbToken);
  private language: string = 'de';

  constructor(private http: HttpClient) {
  }

  movieDetails(id: number): Observable<MovieDetails> {
    return fromPromise(this.tmdbApi.movies.details(id, undefined, this.language));
  }

  streamingProviders(id: number): Observable<MyWatchProviders> {
    // TMDB-Api Library does not contain "flatrate" for Germany (why?)
    // Therefore, using my own classes
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${environment.tmdbToken}`);
    return this.http.get<MyWatchProviders>(`https://api.themoviedb.org/3/movie/${id}/watch/providers`, {headers: headers});
  }

  popularMovies(page?: number): Observable<MovieResults> {
    return fromPromise(this.tmdbApi.movies.popular({page: page ?? 1, language: this.language}));
  }

  recommendedMovies(id: number, page?: number): Observable<MovieResults> {
    page = page ?? 1;
    return fromPromise(this.tmdbApi.movies.recommendations(id, {page: page, language: this.language}))
      .pipe(
        map(recommendations => {
          if (page == 1) {
            recommendations.results.pop();
          }
          return recommendations;
        })
      );
  }

  discoverMovies(page?: number, sortBy?: SortOption, year?: number): Observable<MovieResults> {
    return fromPromise(this.tmdbApi.discover.movie({sort_by: sortBy, page: page ?? 1, primary_release_year: year, language: this.language}));
  }

  topRated(page?: number): Observable<MovieResults> {
    return fromPromise(this.tmdbApi.movies.topRated({page: page ?? 1, language: this.language}));
  }

  searchMovies(query: string, page?: number): Observable<MovieResults> {
    return fromPromise(this.tmdbApi.search.movies({query: query, page: page ?? 1, language: this.language}));
  }
}

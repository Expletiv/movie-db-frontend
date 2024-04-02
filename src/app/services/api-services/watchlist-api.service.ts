import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {MovieDto} from "../../dto/movie/MovieDto";
import {map, Observable} from "rxjs";
import {MovieResults} from "../../dto/movie/MovieResults";
import {WatchlistMovieDataDto} from "../../dto/movie/WatchlistMovieDataDto";
import {AuthToken} from "../../dto/auth/auth-token";

@Injectable({
  providedIn: 'root'
})
export class WatchlistApiService {

  private baseURL: string = environment.watchlistBaseURL;
  private apiBaseURL: string = environment.watchlistApiURL;

  private PAGE_START: number = 0; // the watchlist api starts counting at page 0 in contrast to tmdb


  constructor(private http: HttpClient) {
  }

  addMovie(movie: MovieDto) {
    return this.http.post<MovieDto>(`${this.apiBaseURL}/add/movie`, movie);
  }

  deleteMovie(movie: MovieDto) {
    return this.http.post<MovieDto>(`${this.apiBaseURL}/delete/movie`, movie);
  }

  getMovies(page?: number) {
    return this.http.get<MovieResults>(`${this.apiBaseURL}/movies`, {params: {page: page ?? this.PAGE_START}});
  }

  // Returns a map of movie.id() mapping to WatchlistData
  getWatchlistData(movies: MovieDto[]): Observable<Map<number, WatchlistMovieDataDto>> {
    const ids = movies.map(m => m.id).join();
    return this.http.get<WatchlistMovieDataDto[]>(`${this.apiBaseURL}/data`, {params: {id: ids}})
      .pipe(
        map((movies) => {
          return new Map(movies.map(movie => [movie.id, movie]));
        })
      );
  }

  getGraphApiToken(): Observable<AuthToken> {
    return this.http.get<AuthToken>(`${this.baseURL}/graph/token`);
  }

  sendRegistration(email: string, name: string): Observable<any> {
   return this.http.post(`${this.baseURL}/registration`, {email: email, name: name});
  }
}

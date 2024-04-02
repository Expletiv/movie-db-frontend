import {Component} from '@angular/core';
import {Observable} from "rxjs";
import {MovieResults} from "../../../../dto/movie/MovieResults";
import {TmdbApiService} from "../../../../services/api-services/tmdb-api.service";
import {MoviePreviewsContainerComponent} from "../movie-previews-container/movie-previews-container.component";

@Component({
  selector: 'app-top-movies',
  standalone: true,
  imports: [
    MoviePreviewsContainerComponent
  ],
  templateUrl: './top-movies.component.html',
  styleUrl: './top-movies.component.css'
})
export class TopMoviesComponent {

  fetchMovies = (page?: number): Observable<MovieResults> => {
    return this.tmdb.topRated(page);
  }

  constructor(private tmdb: TmdbApiService) {
  }

}

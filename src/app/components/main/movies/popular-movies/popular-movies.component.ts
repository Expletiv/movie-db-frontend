import {Component} from '@angular/core';
import {TmdbApiService} from "../../../../services/api-services/tmdb-api.service";
import {MoviePreviewsContainerComponent} from "../movie-previews-container/movie-previews-container.component";
import {MovieResults} from "../../../../dto/movie/MovieResults";
import {Observable} from "rxjs";

@Component({
  selector: 'app-popular-movies',
  standalone: true,
  imports: [
    MoviePreviewsContainerComponent
  ],
  templateUrl: './popular-movies.component.html',
  styleUrl: './popular-movies.component.css'
})
export class PopularMoviesComponent {

  fetchMovies = (page?: number): Observable<MovieResults> => {
    return this.tmdb.popularMovies(page);
  }

  constructor(private tmdb: TmdbApiService) {
  }

}

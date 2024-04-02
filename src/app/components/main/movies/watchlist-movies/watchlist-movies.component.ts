import {Component} from '@angular/core';
import {WatchlistApiService} from "../../../../services/api-services/watchlist-api.service";
import {MoviePreviewComponent} from "../movie-preview/movie-preview.component";
import {NgForOf} from "@angular/common";
import {MovieResults} from "../../../../dto/movie/MovieResults";
import {Observable} from "rxjs";
import {MoviePreviewsContainerComponent} from "../movie-previews-container/movie-previews-container.component";

@Component({
  selector: 'app-watchlist-movies',
  standalone: true,
  imports: [
    MoviePreviewComponent,
    NgForOf,
    MoviePreviewsContainerComponent,
  ],
  templateUrl: './watchlist-movies.component.html',
  styleUrl: './watchlist-movies.component.css'
})
export class WatchlistMoviesComponent {

  fetchMovies = (page?: number): Observable<MovieResults> => {
    return this.watchlist.getMovies(page);
  }

  constructor(private watchlist: WatchlistApiService) {
  }
}

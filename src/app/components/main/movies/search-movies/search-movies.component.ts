import {Component, OnInit, ViewChild} from '@angular/core';
import {TmdbApiService} from "../../../../services/api-services/tmdb-api.service";
import {ActivatedRoute} from "@angular/router";
import {MoviePreviewsContainerComponent} from "../movie-previews-container/movie-previews-container.component";
import {MovieResults} from "../../../../dto/movie/MovieResults";
import {Observable} from "rxjs";

@Component({
  selector: 'app-search-movies',
  standalone: true,
  imports: [
    MoviePreviewsContainerComponent
  ],
  templateUrl: './search-movies.component.html',
  styleUrl: './search-movies.component.css'
})
export class SearchMoviesComponent implements OnInit {

  @ViewChild(MoviePreviewsContainerComponent, {static: false})
  moviePreviews: MoviePreviewsContainerComponent | undefined;
  query!: string;

  fetchMovies!: (page?: number) => Observable<MovieResults>;

  constructor(private route: ActivatedRoute, private tmdb: TmdbApiService) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.query = params['query'];
      this.fetchMovies = (page) => {
        return this.tmdb.searchMovies(this.query, page);
      }
    });
  }
}

import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {MovieDetails} from "tmdb-ts";
import {TmdbApiService} from "../../../../services/api-services/tmdb-api.service";
import {DatePipe, DecimalPipe, NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {environment} from "../../../../../environments/environment";
import {MoviePreviewsContainerComponent} from "../movie-previews-container/movie-previews-container.component";
import {MovieResults} from "../../../../dto/movie/MovieResults";
import {Observable} from "rxjs";
import {MyWatchProviders} from "../../../../dto/providers/watch-providers";

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [
    DecimalPipe,
    DatePipe,
    NgIf,
    NgForOf,
    NgOptimizedImage,
    MoviePreviewsContainerComponent
  ],
  templateUrl: './movie-details.component.html',
  styleUrl: './movie-details.component.css'
})
export class MovieDetailsComponent implements OnInit {

  movie: MovieDetails | undefined;
  watchProviders: MyWatchProviders | undefined;

  @ViewChild(MoviePreviewsContainerComponent, {static: false})
  recommendedMovies: MoviePreviewsContainerComponent | undefined;

  fetchRecommendedMovies!: ((page?: number) => Observable<MovieResults>);

  protected readonly environment = environment;

  constructor(private route: ActivatedRoute, private tmdb: TmdbApiService) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {

      this.tmdb.movieDetails(params['id']).subscribe(movie => {
        this.movie = movie;
        document.querySelectorAll(".placeholder").forEach(e => e.remove());
      });
      this.tmdb.streamingProviders(params['id']).subscribe((resp) => {
        this.watchProviders = resp;
      });
      this.fetchRecommendedMovies = (page) => {
        return this.tmdb.recommendedMovies(params['id'], page);
      }
    });
  }

  get title() {
    return this.movie?.title;
  }

  get overview() {
    return this.movie?.overview;
  }

  get posterPath() {
    return this.movie?.poster_path;
  }

  get backdropPath() {
    return this.movie?.backdrop_path;
  }

  get tagline() {
    return this.movie?.tagline;
  }

  get genres() {
    return this.movie?.genres;
  }

  get runtime() {
    return this.movie?.runtime;
  }

  get releaseDate() {
    return this.movie?.release_date;
  }

  get status() {
    return this.movie?.status;
  }

  get budget() {
    return this.movie?.budget;
  }

  get revenue() {
    return this.movie?.revenue;
  }

  get id() {
    return this.movie?.id;
  }

  get imdbId() {
    return this.movie?.imdb_id;
  }

  get tmdbRating() {
    return this.movie?.vote_average;
  }

  get tmdbRatingsCount() {
    return this.movie?.vote_count;
  }

  // for coloring the ratings
  ratingToHsl(rating: number) {
    // 8 is the "good" value here. We are taking rating²
    // in order to get a wider disparity between the values
    const hue = (rating * rating / 8 * (10));
    return 'hsl(' + hue + ', 100%, 50%)';
  }
}

import {Component, Input, OnChanges} from '@angular/core';
import {WatchlistApiService} from "../../../../services/api-services/watchlist-api.service";
import {MovieResults} from "../../../../dto/movie/MovieResults";
import {MoviePreviewComponent} from "../movie-preview/movie-preview.component";
import {NgForOf, NgIf} from "@angular/common";
import {MovieDto} from "../../../../dto/movie/MovieDto";
import {map, Observable} from "rxjs";
import {ToastService} from "../../../../services/toast.service";
import {AuthService} from "../../../../services/auth.service";

@Component({
  selector: 'app-movie-previews-container',
  standalone: true,
  imports: [
    MoviePreviewComponent,
    NgForOf,
    NgIf,
  ],
  templateUrl: './movie-previews-container.component.html',
  styleUrl: './movie-previews-container.component.css'
})
export class MoviePreviewsContainerComponent implements OnChanges {

  @Input({required: true})
  fetchMovies!: (page?: number) => Observable<MovieResults>;

  @Input()
  isOnWatchlistPage: boolean = false;

  movies: MovieResults | undefined;

  constructor(private watchlist: WatchlistApiService,
              private toastService: ToastService,
              private auth: AuthService) {
    this.auth.listenForLogin().subscribe( () => this.ngOnChanges());
  }

  ngOnChanges() {
    this.movies = undefined;
    this.fetchMovies()
      .pipe(
        map(results => {
          this.movies = results;
          return this.movies.results;
        }),
        map(movies => this.loadWatchlistData(movies)))
      .subscribe();
  }

  loadWatchlistData(movies: MovieDto[]) {
    if (this.isOnWatchlistPage || !this.auth.hasValidToken()) {
      return;
    }
    this.watchlist.getWatchlistData(movies).subscribe(data => {
      data.forEach((value, key) => {
        const movie = this.movies?.results.find(movie => movie.id == key);
        if (movie) {
         movie.watchlistData = value;
        }
      });
    });
  }

  loadNextPage() {
    if (this.movies!.page < this.movies!.total_pages) {
      this.fetchMovies(this.movies!.page + 1)
        .pipe(
          map(results => {
            this.movies?.results.push(...results.results);
            this.movies!.page = results.page;
            return results.results;
          }),
          map(movies => this.loadWatchlistData(movies))
        )
        .subscribe();
    }
  }

  addToWatchlist(movie: MovieDto) {
    this.loadWatchlistData([movie]);
    this.toastService.emitToastEvent(`${movie.title} wurde zur Watchlist hinzugefügt.`);
  }

  deleteFromWatchlist(movie: MovieDto) {
    if (this.isOnWatchlistPage) {
      this.removeMovie(movie);
    }
    this.removeWatchlistData(movie);
    this.toastService.emitToastEvent(`${movie.title} wurde von der Watchlist entfernt.`);
  }

  private removeWatchlistData(movie: MovieDto) {
    const element = this.movies?.results.find(m => m.id == movie.id);
    if (element) {
      element.watchlistData = undefined;
    }
  }

  private removeMovie(movie: MovieDto) {
    if (this.movies) {
      const i = this.movies.results.findIndex(m => m.id == movie.id);
      if (i > -1) {
        this.movies?.results.splice(i, 1);
      }
    }
  }
}

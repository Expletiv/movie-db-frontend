import {Component, ElementRef, ViewChild} from '@angular/core';
import {MoviePreviewsContainerComponent} from "../movie-previews-container/movie-previews-container.component";
import {Observable} from "rxjs";
import {MovieResults} from "../../../../dto/movie/MovieResults";
import {TmdbApiService} from "../../../../services/api-services/tmdb-api.service";
import {SortOption} from "tmdb-ts";

@Component({
  selector: 'app-discover-movies',
  standalone: true,
  imports: [
    MoviePreviewsContainerComponent
  ],
  templateUrl: './discover-movies.component.html',
  styleUrl: './discover-movies.component.css'
})
export class DiscoverMoviesComponent {

  @ViewChild("selectCategory")
  selectCategory: ElementRef<HTMLSelectElement> | undefined;
  @ViewChild("selectDirection")
  selectDirection: ElementRef<HTMLSelectElement> | undefined;
  @ViewChild("year")
  year: ElementRef<HTMLInputElement> | undefined;

  sortBy: SortOption = "vote_count.desc";

  fetchMovies!: (page?: number) => Observable<MovieResults>;

  constructor(private tmdb: TmdbApiService) {
    this.updateFetchMovies();
  }

  updateFetchMovies() {
    this.fetchMovies = (page?: number): Observable<MovieResults> => {
      return this.tmdb.discoverMovies(page, this.sortBy, this.year?.nativeElement.value as number | undefined);
    }
  }

  changeSorting() {
    if (this.selectCategory && this.selectDirection) {
      this.sortBy = (this.selectCategory.nativeElement.value + this.selectDirection.nativeElement.value) as SortOption;
      this.updateFetchMovies();
    }
  }
}

import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {DatePipe, DecimalPipe, NgIf, NgOptimizedImage} from "@angular/common";
import {environment} from "../../../../../environments/environment";
import {Router} from "@angular/router";
import {WatchlistApiService} from "../../../../services/api-services/watchlist-api.service";
import {MovieDto} from "../../../../dto/movie/MovieDto";
import {OAuthService} from "angular-oauth2-oidc";
import {registerMgtPersonComponent} from "@microsoft/mgt";
import {ToastService} from "../../../../services/toast.service";

@Component({
  selector: 'app-movie-preview',
  standalone: true,
  imports: [
    DatePipe,
    NgOptimizedImage,
    NgIf,
    DecimalPipe
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './movie-preview.component.html',
  styleUrl: './movie-preview.component.css'
})
export class MoviePreviewComponent implements OnInit {

  @ViewChild('card')
  card: ElementRef<HTMLDivElement> | undefined;
  isScrolledIntoView: boolean = false;

  @Input({required: true}) movie: MovieDto | undefined;
  @Output() added = new EventEmitter<MovieDto>();
  @Output() deleted = new EventEmitter<MovieDto>();

  isProcessingRequest: boolean = false;
  personCardExpand: "click" | "hover" = "click";

  protected readonly environment = environment;

  constructor(private router: Router,
              private watchlist: WatchlistApiService,
              protected auth: OAuthService,
              private toastService: ToastService) {
  }

  ngOnInit() {
    registerMgtPersonComponent();
    if (!this.isTouchDevice()) {
      this.personCardExpand = "hover";
    }
  }

  @HostListener('window:scroll', ['$event'])
  updateIsScrolledIntoView() {
    if (this.card) {
      const rect = this.card.nativeElement.getBoundingClientRect();
      const topShown = rect.top >= 0;
      const bottomShown = rect.bottom <= window.innerHeight;
      this.isScrolledIntoView = (topShown && bottomShown) && (this.isTouchDevice());
    }
  }

  isTouchDevice() {
    return window.matchMedia("(pointer: coarse)").matches;
  }

  getMovieDetails() {
    this.router.navigate(['movie/', this.movie?.id])
      .catch(err => console.log(err));
  }

  addToWatchlist($event: Event) {
    if (this.auth.hasValidAccessToken() && !this.isProcessingRequest) {
      this.isProcessingRequest = true;
      this.watchlist.addMovie(this.movie!)
        .subscribe({
          next: () => this.added.emit(this.movie),
          error: () => {
            this.isProcessingRequest = false;
            this.toastService.emitErrorEvent(`${this.movie?.title}: Fehler. Film konnte nicht hinzugefügt werden.`);
          },
          complete: () => this.isProcessingRequest = false
        });
    } else {
      this.toastService.emitUnauthenticatedEvent();
    }
    $event.stopPropagation();
  }

  deleteFromWatchlist($event: Event) {
    if (this.auth.hasValidAccessToken() && !this.isProcessingRequest) {
      this.isProcessingRequest = true;
      this.watchlist.deleteMovie(this.movie!)
        .subscribe({
          next: () => this.deleted.emit(this.movie),
          error: () => {
            this.isProcessingRequest = false;
            this.toastService.emitErrorEvent(`${this.movie?.title}: Fehler. Film konnte nicht entfernt werden.`);
          },
          complete: () => this.isProcessingRequest = false
        });
    } else {
      this.toastService.emitUnauthenticatedEvent();
    }
    $event.stopPropagation();
  }

  // for coloring the ratings
  ratingToHsl(rating: number) {
    // 8 is the "good" value here. We are taking rating²
    // in order to get a wider disparity between the values
    const hue = (rating * rating / 8 * (10));
    return 'hsl(' + hue + ', 100%, 50%)';
  }
}

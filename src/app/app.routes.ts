import { Routes } from '@angular/router';
import {PopularMoviesComponent} from "./components/main/movies/popular-movies/popular-movies.component";
import {MovieDetailsComponent} from "./components/main/movies/movie-details/movie-details.component";
import {SearchMoviesComponent} from "./components/main/movies/search-movies/search-movies.component";
import {WatchlistMoviesComponent} from "./components/main/movies/watchlist-movies/watchlist-movies.component";
import {authGuard} from "./config/auth-guard";
import {RegistrationComponent} from "./components/main/registration/registration.component";
import {DiscoverMoviesComponent} from "./components/main/movies/discover-movies/discover-movies.component";
import {TopMoviesComponent} from "./components/main/movies/top-movies/top-movies.component";

export const routes: Routes = [
  {path: 'popular', component: PopularMoviesComponent},
  {path: 'top', component: TopMoviesComponent},
  {path: 'discover', component: DiscoverMoviesComponent},
  {path: 'search', component: SearchMoviesComponent},
  {path: 'movie/:id', component: MovieDetailsComponent},
  {path: 'watchlist', component: WatchlistMoviesComponent, canActivate: [authGuard]},
  {path: 'registration', component: RegistrationComponent}
];

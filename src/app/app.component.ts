import {Component, CUSTOM_ELEMENTS_SCHEMA, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {NavbarComponent} from "./components/navbar/navbar.component";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {ToastComponent} from "./components/main/toasts/toast/toast.component";
import {NgIf} from "@angular/common";
import {AuthService} from "./services/auth.service";
import {AuthProvider} from "./config/mgt/auth-provider";
import "./config/mgt/MgtComponentConfig";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, ToastComponent, NgIf],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  animations: [
    trigger('loading', [
      state('0', style({
        width: '0'
      })),
      state('100', style({
        width: '100%'
      })),
      transition('void => 100', [
        animate('0.3s ease-in'),
      ]),
      transition('100 => 0', [])
    ])
  ]
})
export class AppComponent implements OnInit {
  title = 'Movie-Database';
  loadingPercentage: string | undefined;

  constructor(private auth: AuthService,
              private authProvider: AuthProvider) {
  }

  ngOnInit() {
    this.auth.init(this.authProvider);
    this.loadingPercentage = '100';
  }
}

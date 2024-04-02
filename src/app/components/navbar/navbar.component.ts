import {Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, OnInit, Output} from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from "@angular/router";
import {NgIf} from "@angular/common";
import {
  applyTheme,
  registerMgtLoginComponent,
  registerMgtPersonComponent, registerMgtSearchBoxComponent,
} from "@microsoft/mgt";
import {OAuthService} from "angular-oauth2-oidc";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    NgIf
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {

  @Output() login = new EventEmitter<any>();
  @Output() logout = new EventEmitter<any>();

  theme: 'dark' | 'light' = 'dark';

  constructor(private router: Router, protected auth: OAuthService) {
    const theme = localStorage.getItem('theme');
    if (theme && (theme == 'dark' || theme == 'light')) {
      this.theme = theme;
      document.documentElement.setAttribute('data-bs-theme', this.theme);
    }
    applyTheme(this.theme);
    localStorage.setItem('theme', this.theme);
  }

  ngOnInit() {
    registerMgtSearchBoxComponent()
    registerMgtLoginComponent();
    registerMgtPersonComponent();

    document.querySelector('mgt-search-box')?.addEventListener('searchTermChanged', (e: any) => {
      this.doSearch(e.detail);
    })
  }

  toggleTheme() {
    if (this.theme == 'dark') {
      this.theme = 'light';
    } else {
      this.theme = 'dark';
    }
    localStorage.setItem('theme', this.theme);
    document.documentElement.setAttribute('data-bs-theme', this.theme);
    applyTheme(this.theme);
  }

  doSearch(query: string) {
    this.router.navigate(['search'],
      {queryParams: {query: query}})
      .catch(err => console.log(err));
  }
}

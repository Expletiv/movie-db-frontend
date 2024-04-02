import {EventEmitter, Injectable} from '@angular/core';
import {OAuthErrorEvent, OAuthService} from "angular-oauth2-oidc";
import {authCodeFlowConfig} from "../config/auth-config";
import {Providers, ProviderState} from "@microsoft/mgt";
import {AuthProvider} from "../config/mgt/auth-provider";
import {ToastService} from "./toast.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  loginSuccessEvent = new EventEmitter();

  constructor(private _oauthService: OAuthService,
              private toastService: ToastService) {
  }

  listenForLogin() {
    return this.loginSuccessEvent.asObservable();
  }

  init(authProvider: AuthProvider) {
    this._oauthService.configure(authCodeFlowConfig);
    this._oauthService.loadDiscoveryDocumentAndTryLogin();
    this._oauthService.setupAutomaticSilentRefresh();

    Providers.globalProvider = authProvider;

    Providers.globalProvider.onStateChanged(() => {
      if (Providers.globalProvider.state == ProviderState.SignedIn) {
        this.loginSuccessEvent.emit();
      }
    });

    Providers.globalProvider.setState(
      this._oauthService.hasValidAccessToken() ? ProviderState.SignedIn : ProviderState.SignedOut);

    this._oauthService.events.subscribe(e => {
      switch (e.type) {
        case "token_received":
          Providers.globalProvider.setState(ProviderState.SignedIn);
          this.toastService.emitToastEvent('Erfolgreich angemeldet.');
          break;
        case "logout":
          Providers.globalProvider.setState(ProviderState.SignedOut);
          authProvider.removeTokenFromStorage();
          this.toastService.emitToastEvent('Erfolgreich abgemeldet.');
          break;
      }
    });
  }

  /* See here:
  https://dev.to/yuriburger/azure-active-directory-b2c-with-pkce-for-your-angular-app-1dcg   */
  login() {
    // The convenience method mentioned in the docs (loadDiscoveryDocumentAndLogin) won't work
    // since we need a way to modify the token endpoint
    this._oauthService
      .loadDiscoveryDocument()
      .then((_) => {
        if (this.userHasEnteredPasswordResetFlow()) {
          // We need to change to token endpoint to match the reset-password flow
          this._oauthService.tokenEndpoint!.replace(
            'b2c_1_signupandsignin',
            'b2c_1_passwordreset'
          );
        }

        return this._oauthService.tryLoginCodeFlow();
      })
      .then((_) => {
        if (!this._oauthService.hasValidAccessToken()) {
          this._oauthService.initCodeFlow();
        }
      })
      .catch((err) => {
        if (this.userHasRequestedPasswordReset(err)) {
          // In this case we need to enter a different flow on the Azure AD B2C side.
          // This is still a valid Code + PKCE flow, but uses a different form to support self service password reset
          this._oauthService.loginUrl = this._oauthService.loginUrl!.replace(
            'b2c_1_signupandsignin',
            'b2c_1_passwordreset'
          );
          // Add this to the state as we need it on our way back
          this._oauthService.initCodeFlow('PASSWORD_RESET');
        } else {
          // Another error has occurred, e.g. the user cancelled the reset-password flow.
          // In that case, simply retry the login.
          this._oauthService.initCodeFlow();
        }
      });
  }

  private userHasEnteredPasswordResetFlow(): boolean {
    return window.location.search.indexOf('PASSWORD_RESET') > -1;
  }

  private userHasRequestedPasswordReset(err: OAuthErrorEvent): boolean {
    // @ts-ignore
    return (err.params['error_description'] as string).startsWith(
      'AADB2C90118'
    );
  }

  logout() {
    this._oauthService.logOut();
  }

  get oauthService(): OAuthService {
    return this._oauthService;
  }

  hasValidToken() {
    return this._oauthService.hasValidAccessToken();
  }
}

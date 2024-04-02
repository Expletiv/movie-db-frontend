import {IProviderAccount, SimpleProvider} from "@microsoft/mgt";
import {AuthService} from "../../services/auth.service";
import {WatchlistApiService} from "../../services/api-services/watchlist-api.service";
import {Injectable} from "@angular/core";
import {AuthToken} from "../../dto/auth/auth-token";
import {lastValueFrom, map, Observable, take} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthProvider extends SimpleProvider {

  private _graphTokenProvider: () => Observable<AuthToken>;

  constructor(private auth: AuthService, private watchlist: WatchlistApiService) {
    super(
      () => this.getAccessToken(),
      () => this.login(),
      () => this.logout());
    this._graphTokenProvider = () => this.watchlist.getGraphApiToken();
  }

  getGraphToken(): Promise<string> {
    const token = this.fetchTokenFromStorage();

    if (token && new Date(token.expiresAt) > new Date()) {
      return Promise.resolve(token.tokenValue);
    } else {
      return lastValueFrom(this._graphTokenProvider()
        .pipe(take(1),
          map(token => {
            this.saveTokenToStorage(token);
            return token.tokenValue;
          })));
    }
  }

  fetchTokenFromStorage(): AuthToken | undefined {
    const st = localStorage;
    const tokenValue = st.getItem('access_token');
    const token_type = st.getItem('token_type');
    const expiresAt = st.getItem('expires_at');
    const issued_at = st.getItem('issued_at');
    if (tokenValue && token_type && expiresAt && issued_at) {
      return {
        tokenValue: tokenValue,
        tokenType: {value: token_type},
        expiresAt: expiresAt,
        issuedAt: issued_at,
        scopes: []
      }
    } else {
      return undefined;
    }
  }

  saveTokenToStorage(token: AuthToken) {
    const st = localStorage;
    st.setItem('access_token', token.tokenValue);
    st.setItem('token_type', token.tokenType.value);
    st.setItem('expires_at', token.expiresAt);
    st.setItem('issued_at', token.issuedAt);
  }

  removeTokenFromStorage() {
    const st = localStorage;
    st.removeItem('access_token');
    st.removeItem('token_type');
    st.removeItem('expires_at');
    st.removeItem('issued_at');
  }

  override getAccessToken(): Promise<string> {
    return this.getGraphToken();
  }

  override login(): Promise<void> {
    return Promise.resolve(this.auth.login());
  }

  override logout(): Promise<void> {
    return Promise.resolve(this.auth.logout());
  }

  override getActiveAccount(): IProviderAccount {
    return {id: this.auth.oauthService.getIdentityClaims()['oid']};
  }
}

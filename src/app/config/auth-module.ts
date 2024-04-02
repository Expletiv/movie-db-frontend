import {OAuthModule} from "angular-oauth2-oidc";
import {environment} from "../../environments/environment";


/** Provider for the Auth Interceptor. */
export const authModule = OAuthModule.forRoot({
  resourceServer: {
    allowedUrls: [environment.watchlistBaseURL],
    sendAccessToken: true
  }
})

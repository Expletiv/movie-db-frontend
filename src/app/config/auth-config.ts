import {AuthConfig} from "angular-oauth2-oidc";

export const authCodeFlowConfig: AuthConfig = {
  issuer: 'https://login.microsoftonline.com/b10e101d-fea3-46a1-8171-76d6e1d0bd9d/v2.0',
  redirectUri: window.location.origin + "/popular",
  clientId: '8887b53f-6769-49aa-9070-100cad58353a',
  responseType: 'code',
  scope: 'openid profile email offline_access api://8887b53f-6769-49aa-9070-100cad58353a/Watchlist.User',
  strictDiscoveryDocumentValidation: false, // microsoft does not support this
  showDebugInformation: true
}

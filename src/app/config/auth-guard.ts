import {inject} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot} from "@angular/router";
import {OAuthService} from "angular-oauth2-oidc";
import {ToastService} from "../services/toast.service";

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const auth = inject(OAuthService);
  const toast = inject(ToastService);
  if (auth.hasValidAccessToken()) {
    return true;
  } else {
    toast.emitUnauthenticatedEvent();
    return false;
  }
}

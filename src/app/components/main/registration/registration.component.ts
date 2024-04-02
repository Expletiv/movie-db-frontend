import {Component} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {WatchlistApiService} from "../../../services/api-services/watchlist-api.service";
import {OAuthService} from "angular-oauth2-oidc";
import {ToastService} from "../../../services/toast.service";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent {

  formGroup = new FormGroup({
      userEmail: new FormControl('', [
        Validators.required,
        Validators.email
      ]),
      userDisplayName: new FormControl('', [
        Validators.required,
        Validators.pattern('[a-zA-Z0-9]*')
      ])
    }
  )

  isProcessingRegistration: boolean = false;

  constructor(private watchlist: WatchlistApiService,
              private auth: OAuthService,
              private toastService: ToastService) {
  }

  sendRegistration() {
    const inputMail = this.formGroup.get('userEmail');
    const inputName = this.formGroup.get('userDisplayName');

    if (!inputMail || inputMail.invalid || inputMail.value == null) {
      this.toastService.emitErrorEvent("Die E-Mail ist ungültig.");
      return;
    } else if (!inputName || inputName.invalid || inputName.value == null) {
      this.toastService.emitErrorEvent("Der Benutzername ist ungültig.");
      return;
    } else {
      const mail = inputMail.value;
      const name = inputName.value;
      if (!this.auth.hasValidAccessToken() && !this.isProcessingRegistration) {
        this.isProcessingRegistration = true;
        this.watchlist.sendRegistration(mail, name).subscribe({
          error: () => this.toastService.emitToastEvent("Fehler beim Erstellen des Accounts."),
          complete: () => {
            this.toastService.emitToastEvent("Account wurde erstellt. Du kannst dich anmelden.");
            this.isProcessingRegistration = false;
          }
        });
      }
    }
  }

}

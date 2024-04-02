import {Injectable} from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  private sendToastEvent = new Subject<ToastOptions>();

  emitToastEvent(msg: string, type?: 'success' | 'danger' | 'info') {
    this.sendToastEvent.next(new ToastOptions(msg, type))
  }

  emitUnauthenticatedEvent(msg?: string) {
    this.emitToastEvent(msg ?? 'Bitte melde dich erst an.', 'danger');
  }

  emitErrorEvent(msg?: string) {
    this.emitToastEvent(msg ?? 'Ein Fehler ist aufgetreten.', 'danger');
  }

  toastEventListener() {
    return this.sendToastEvent.asObservable();
  }

}

export class ToastOptions {
  msg: string;
  type: 'success' | 'danger' | 'info';

  constructor(msg: string, type?: "success" | "danger" | "info") {
    this.msg = msg;
    this.type = type ?? 'success';
  }
}

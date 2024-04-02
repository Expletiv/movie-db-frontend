import {Component, ElementRef, ViewChild} from '@angular/core';
import {Toast} from "bootstrap";
import {ToastService} from "../../../../services/toast.service";

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css'
})
export class ToastComponent {

  @ViewChild('liveToast') toastElement: ElementRef<HTMLDivElement> | undefined;
  message: string | undefined;
  type: "success" | "danger" | "info" = "success";

  constructor(private toastService: ToastService) {
    this.toastService.toastEventListener().subscribe(
      options => {
        this.type = options.type;
        this.showToast(options.msg);
      }
    );
  }

  showToast(message: string) {
    if (this.toastElement) {
      this.message = message;
      Toast.getOrCreateInstance(this.toastElement.nativeElement).show();
    }
  }
}

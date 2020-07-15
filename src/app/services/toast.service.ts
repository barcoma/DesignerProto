import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  readonly duration: number = 3000;

  constructor(private toastCtrl: ToastController) {}

  async createToast(message: string, color?: string): Promise<void> {
    const toast = await this.toastCtrl.create({
      message,
      duration: this.duration,
      position: 'bottom',
      color,
      cssClass: 'toast-middle',
    });
    return toast.present();
  }
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BarcodesPageRoutingModule } from './barcodes-routing.module';

import { BarcodesPage } from './barcodes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BarcodesPageRoutingModule
  ],
  declarations: [BarcodesPage]
})
export class BarcodesPageModule {}

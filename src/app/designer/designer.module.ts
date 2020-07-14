import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DesignerPageRoutingModule } from './designer-routing.module';

import { DesignerPage } from './designer.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DesignerPageRoutingModule
  ],
  declarations: [DesignerPage]
})
export class DesignerPageModule {}

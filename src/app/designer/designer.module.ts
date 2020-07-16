import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { MaterialModule } from 'src/app/material.module';


import { IonicModule } from '@ionic/angular';

import { DesignerPageRoutingModule } from './designer-routing.module';

import { DesignerPage } from './designer.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DesignerPageRoutingModule,
    PipesModule,
    MaterialModule
  ],
  declarations: [DesignerPage]
})
export class DesignerPageModule {}

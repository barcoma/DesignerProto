import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BarcodesPage } from './barcodes.page';

const routes: Routes = [
  {
    path: '',
    component: BarcodesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BarcodesPageRoutingModule {}

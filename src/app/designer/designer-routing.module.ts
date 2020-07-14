import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DesignerPage } from './designer.page';

const routes: Routes = [
  {
    path: '',
    component: DesignerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DesignerPageRoutingModule {}

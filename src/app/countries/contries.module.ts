import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { ContriesRoutingModule } from './contries-routing.module';
import { SelectorPageComponent } from './pages/selector-page/selector-page.component';


@NgModule({
  declarations: [
    SelectorPageComponent
  ],
  imports: [
    CommonModule,
    ContriesRoutingModule,
    ReactiveFormsModule
    
  ]
})
export class ContriesModule { }

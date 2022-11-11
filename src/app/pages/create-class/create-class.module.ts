import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateClassPageRoutingModule } from './create-class-routing.module';

import { CreateClassPage } from './create-class.page';
import { QRCodeModule } from 'angularx-qrcode';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    CreateClassPageRoutingModule,
    QRCodeModule,
  ],
  declarations: [CreateClassPage],
})
export class CreateClassPageModule {}

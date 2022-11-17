import { NgModule } from '@angular/core';
import { provideFirebaseApp } from '@angular/fire/app';
import { provideAuth } from '@angular/fire/auth';
import { provideFirestore } from '@angular/fire/firestore';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { environment } from 'src/environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LottieModule } from 'ngx-lottie';
import player from 'lottie-web';
import { HttpClientModule } from '@angular/common/http';
import { SwiperModule } from 'swiper/angular';
import { QRCodeModule } from 'angularx-qrcode';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { Ng9PasswordStrengthBarModule } from 'ng9-password-strength-bar';

export function playerFactory() {
  return player;
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    LottieModule.forRoot({ player: playerFactory }),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
    provideStorage(() => getStorage()),

    ReactiveFormsModule,
    FormsModule,
    SwiperModule,
    HttpClientModule,
    QRCodeModule,
    Ng2SearchPipeModule,
    Ng9PasswordStrengthBarModule,
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}

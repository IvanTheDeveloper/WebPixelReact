import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAnalytics, provideAnalytics } from '@angular/fire/analytics';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { getFunctions, provideFunctions } from '@angular/fire/functions';

import { environment as dev } from 'src/environments/environment.development';
import { environment as prod } from 'src/environments/environment';
import { devModeEnabled } from '../others/globalProperties';
export const firebaseConfig = devModeEnabled ? dev.firebaseConfig : prod.firebaseConfig

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAnalytics(() => getAnalytics(initializeApp(firebaseConfig))),
    provideAuth(() => getAuth()),
    provideDatabase(() => getDatabase()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    provideFunctions(() => getFunctions())
  ]
})
export class FirebaseModule { }
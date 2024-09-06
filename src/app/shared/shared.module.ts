import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ReactiveFormsModule } from "@angular/forms";
import { LayoutModule } from '@angular/cdk/layout';

import { environment } from '../../environments/environment';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { provideAuth, getAuth } from '@angular/fire/auth';

const MODULES = [
  FormsModule,
  ReactiveFormsModule,
  LayoutModule
];

const FIREBASE = [
  provideFirebaseApp(() => initializeApp(environment.firebase)),
  provideFirestore(() => getFirestore()),
  provideStorage(() => getStorage()),
  provideAuth(() => getAuth())
]

@NgModule({
  declarations: [],
  imports: [
    ...MODULES,
    ...FIREBASE
  ],
  exports: [
    ...MODULES
  ]
})
export class SharedModule { }

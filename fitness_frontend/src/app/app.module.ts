import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar.component';
import { SidenavComponent } from './sidenav.component';
import { AuthComponent } from './auth.component';
import { DataEntryComponent } from './data-entry.component';
import { ExercisesComponent } from './exercises.component';
import { ProofUploadComponent } from './proof-upload.component';
import { DashboardComponent } from './dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SidenavComponent,
    AuthComponent,
    DataEntryComponent,
    ExercisesComponent,
    ProofUploadComponent,
    DashboardComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

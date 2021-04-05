import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule, appRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ScheduleBuilderComponent } from './schedule-builder/schedule-builder.component';
import { HttpClientModule } from '@angular/common/http';
import { DevicesPageComponent } from './devices-page/devices-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
@NgModule({
  declarations: [
    AppComponent,
    ScheduleBuilderComponent,
    DevicesPageComponent,
    LoginPageComponent
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule

  ],
  exports: [
    ScheduleBuilderComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

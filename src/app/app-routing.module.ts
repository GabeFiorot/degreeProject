
import { DevicesPageComponent } from './devices-page/devices-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { ScheduleBuilderComponent } from './schedule-builder/schedule-builder.component';

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';



const routes: Routes = [
{path: '', component: LoginPageComponent },
{path: 'devices', component: DevicesPageComponent},
{path: 'schedule', component: ScheduleBuilderComponent},

//default redirect
{path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

export const appRoutingModule = RouterModule.forRoot(routes);

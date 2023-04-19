import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { QueryComponent } from './query/query.component';
import { SearchDateTimeComponent } from './search-date-time/search-date-time.component';
import { AuthGuard } from 'src/guard/auth.guard';

const routes: Routes = [
  {path: '', redirectTo: '/dashboard', pathMatch: 'full'},
  {path:'login', component: LoginComponent},
  {path:'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
  {path:'query/:ID', component: QueryComponent, canActivate: [AuthGuard]},
  {path:'searchDateTime', component: SearchDateTimeComponent, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

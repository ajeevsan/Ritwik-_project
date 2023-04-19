import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { QueryComponent } from './query/query.component';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { LoginComponent } from './login/login.component';
import { SearchDateTimeComponent } from './search-date-time/search-date-time.component';
import { DataTablesModule } from "angular-datatables";

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    QueryComponent,
    LoginComponent,
    SearchDateTimeComponent
  ],
  imports: [
    NgMultiSelectDropDownModule.forRoot(),
    DataTablesModule,
    HttpClientModule,
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

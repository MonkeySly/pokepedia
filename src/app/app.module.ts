import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './home/home.component';
import { SettingsComponent } from './settings/settings.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LeftPanelComponent } from './home/leftPanel/leftpanel.component';
import { RightPanelComponent } from './home/rightPanel/rightpanel.component';
import { HttpClientModule } from '@angular/common/http';
import { HttpService } from './home/services/httpService';
import { PanelService } from './home/services/panelService';
import { FormsModule } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RightPanelTopBarComponent } from './home/rightPanel/rightPanelTopBar/rightpaneltopbar.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    LeftPanelComponent,
    RightPanelComponent,
    RightPanelTopBarComponent,
    SettingsComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    FontAwesomeModule,
  ],
  providers: [
    HttpService,
    PanelService,
    LeftPanelComponent,
    RightPanelComponent,
    SettingsComponent,
    ToastrService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

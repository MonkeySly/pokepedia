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

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    LeftPanelComponent,
    RightPanelComponent,
    SettingsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
  ],
  providers: [HttpService, PanelService, LeftPanelComponent, RightPanelComponent, SettingsComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }

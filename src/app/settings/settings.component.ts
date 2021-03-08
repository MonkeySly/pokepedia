import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CookieService } from 'ng2-cookies';
import { ToastrService } from 'ngx-toastr';
import { SettingsService } from '../home/services/settingsService';
import { Settings } from './settings';

@Component({
  selector: 'settings-component',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})

export class SettingsComponent implements OnInit {
    constructor(
      private cookieService: CookieService,
      private settingsService: SettingsService,
      private toast: ToastrService,
    ) {}

    // Settings
    settingsDict: Settings = new Settings(20, false); // Default values init

    tmpTheme: boolean;

    nbPkmnByPageChoices = [
      5,
      10,
      15,
      20,
      30,
      50
    ]

    currentNbPkmnByPage: number = 0;

    // Cookies
    settingsCookie: any;
    settingsCookieName: string = 'settings_cookie'

    // Service used to update the right panel when selecting a pokémon on the left panel list
    sendNewSettingsDict(): void {
      this.settingsService.sendCustomEvent(this.settingsDict);
    }
    
    ngOnInit() {
      this.updateCookies();
      this.tmpTheme = this.settingsDict.isDarkTheme;
    }

    switchTheme() {
      this.tmpTheme = !this.tmpTheme;
    }

    saveSettings() {
      this.settingsDict.isDarkTheme = this.tmpTheme;
      this.addCookie();
      this.toast.success("Settings succesfully saved!", 'Settings');
    }

    resetSettings() {
      this.settingsDict = new Settings(20, false);
      this.addCookie();
      this.updateCookies();
    }

    addCookie() {
      this.cookieService.set(this.settingsCookieName, JSON.stringify(this.settingsDict));
      this.updateCookies();
      this.sendNewSettingsDict();
    }

    removeCookies() {
      this.cookieService.deleteAll();
      location.reload();
    }

    updateCookies() {
      this.settingsCookie = this.cookieService.get(this.settingsCookieName);
      if (this.settingsCookie && typeof this.settingsCookie === 'string') {
        Object.assign(this.settingsDict, JSON.parse(this.settingsCookie));
      }
    }

}
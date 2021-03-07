import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CookieService } from 'ng2-cookies';
import { ToastrService } from 'ngx-toastr';
import { SettingsService } from '../home/services/settingsService';

@Component({
  selector: 'settings-component',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})

export class SettingsComponent implements OnInit {
    constructor(
      private route: ActivatedRoute,
      private cookieService: CookieService,
      private settingsService: SettingsService,
      private toast: ToastrService,
    ) {}

    // Settings
    settingsDict = {
      nbPkmnByPage: 20,
    }

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
      console.log('settings page loaded');
      this.updateCookies();
    }

    saveSettings() {
      this.addCookie();
      this.toast.success("Settings succesfully saved!", 'Settings');
    }

    resetSettings() {
      this.settingsDict.nbPkmnByPage = 20; // Default value
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
      this.updateCookies();
    }

    updateCookies() {
      this.settingsCookie = this.cookieService.get(this.settingsCookieName);
      this.settingsDict = JSON.parse(this.settingsCookie);
    }

}
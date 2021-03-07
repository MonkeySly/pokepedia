import { Component, Input, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { CookieService } from 'ng2-cookies';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { SettingsComponent } from 'src/app/settings/settings.component';
import { RightPanelComponent } from '../rightPanel/rightpanel.component';
import { HttpService } from '../services/httpService';
import { PanelService } from '../services/panelService';
import { SettingsService } from '../services/settingsService';

@Component({
  selector: 'left-panel-component',
  templateUrl: './leftpanel.component.html',
  styleUrls: ['./leftpanel.component.scss']
})
export class LeftPanelComponent {

  constructor(
    private httpService: HttpService,
    private panelService: PanelService,
    private settingsService: SettingsService,
    private cookieService: CookieService) {

      this.settingsService.$getEventSubject.subscribe(newSettingsDict => {
        this.settingsDict = newSettingsDict;
      });

    }

    // Inputs
    // Data to display at the top of the left panel
    @Input() nbPkmn: number;
    @Input() nbPkmnGens: number;

    // Settings cookie name
    settingsCookieName: string = 'settings_cookie'

    // Settings Dict refresh with services from the settings page
    settingsDict: any;

    // Urls to fetch at poekapi.co
    urls = {
      pokemon: 'https://pokeapi.co/api/v2/pokemon',
      generation: 'https://pokeapi.co/api/v2/generation',
      arrayPage: 'https://pokeapi.co/api/v2/pokemon?offset=0&limit=',
      prevArrayPage: null,
      nextArrayPage: null,
    }

    // Array of pokémons to show on the left panel
    pkmnArray: Array<any> = [];

    // Pagination data
    page: number = 1; 

    // Service used to update the right panel when selecting a pokémon on the left panel list
    sendPkmnToShow(pkmnName): void {
      this.panelService.sendCustomEvent(pkmnName);
    }

    ngOnInit() {
      console.log('left panel settings dict', this.settingsDict);
      this.getSettingsData();
      this.getPkmnArray(this.urls.arrayPage + this.settingsDict.nbPkmnByPage);
    }

    getSettingsData() {
      let cookie = this.cookieService.get(this.settingsCookieName);
      this.settingsDict = JSON.parse(cookie);
    }

    prevPage() {
      this.page -= 1;
      this.getPkmnArray(this.urls.prevArrayPage);
    }

    nextPage() {
      this.page += 1;
      this.getPkmnArray(this.urls.nextArrayPage);
    }

    getPkmnArray(url: string) {
      this.pkmnArray = [];
      this.httpService.get(url).subscribe(result => {
          let data = this.httpService.requestResultHandler(result);
          this.urls.prevArrayPage = data.previous;
          this.urls.nextArrayPage = data.next;
          console.log('size result', data.results.length);
          for (let pkmn of data.results) {
            this.pkmnArray.push({name: pkmn.name});
          }
        }, error => {
          console.log('error:', error);
        }
      );
    }
  }

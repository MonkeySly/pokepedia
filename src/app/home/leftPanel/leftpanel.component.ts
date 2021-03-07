import { Component, Input, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import { faStar as fasStar, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { CookieService } from 'ng2-cookies';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
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
    private cookieService: CookieService,
    faLibrary: FaIconLibrary) {

      this.settingsService.$getEventSubject.subscribe(newSettingsDict => {
        this.settingsDict = newSettingsDict;
      });

      // FontAwesome icons
      faLibrary.addIcons(fasStar);
      faLibrary.addIcons(farStar);
      faLibrary.addIcons(faChevronRight);
      faLibrary.addIcons(faChevronLeft);
    }

    // Inputs
    // Data to display at the top of the left panel
    @Input() nbPkmn: number;
    @Input() nbPkmnGens: number;

    // Cookie names
    settingsCookieName: string = 'settings_cookie'
    favPkmnCookieName: string = 'fav_cookie'

    // Settings Dict refresh with services from the settings page
    settingsDict: any;

    // Fav Pokémons Dict
    favPkmnsArray = [];

    // Are we in the favourite list page?
    isFavListPage: boolean = false;

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
      this.getSettingsData();
      this.getPkmnArray(this.urls.arrayPage + this.settingsDict.nbPkmnByPage);
      this.getFavPkmnData();
    }

    getSettingsData() {
      let cookie = this.cookieService.get(this.settingsCookieName);
      this.settingsDict = JSON.parse(cookie);
    }

    getFavPkmnData() {
      this.favPkmnsArray = []; // Reset
      let cookie = this.cookieService.get(this.favPkmnCookieName);
      let favPkmnsArrayTmp = cookie.split(','); // Convert from string to array
      if (favPkmnsArrayTmp.length > 0 && favPkmnsArrayTmp[0] != "") {
        this.favPkmnsArray = favPkmnsArrayTmp;
      }
    }

    setNewFavPkmn(pkmnName) {
      this.favPkmnsArray.push(pkmnName);
      this.cookieService.set(this.favPkmnCookieName, this.favPkmnsArray.toString()) // Convert from array to string
    }

    removeFavPkmn(pkmnName) {
      if (this.isFavListPage) {
        let index = 0;
        this.pkmnArray.forEach(elem => {
          if (elem.name === pkmnName) {
              this.pkmnArray.splice(index, 1);
          }
          index += 1;
        })
      }
      this.favPkmnsArray.splice(this.favPkmnsArray.indexOf(pkmnName), 1);
      this.cookieService.set(this.favPkmnCookieName, this.favPkmnsArray.toString()) // Convert from array to string
    }

    allListPage() {
      this.getPkmnArray(this.urls.arrayPage + this.settingsDict.nbPkmnByPage);
      this.isFavListPage = false;
    }

    favListPage() {
      this.getFavPkmnArray();
      this.isFavListPage = true;
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
          for (let pkmn of data.results) {
            this.pkmnArray.push({name: pkmn.name});
          }
        }, error => {
          console.log('error:', error);
        }
      );
    }

    getFavPkmnArray() {
      this.pkmnArray = [];
      for (let pkmnName of this.favPkmnsArray) {
        this.httpService.get('https://pokeapi.co/api/v2/pokemon/' + pkmnName).subscribe(result => {
            let pkmn = this.httpService.requestResultHandler(result);
            this.pkmnArray.push({name: pkmn.name});
          }, error => {
            console.log('error:', error);
          }
        );
      }
    }
  }

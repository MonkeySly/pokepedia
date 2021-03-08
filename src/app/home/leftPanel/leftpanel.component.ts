import { Component, Input, OnInit } from '@angular/core';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import { faStar as fasStar, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { CookieService } from 'ng2-cookies';
import { HttpService } from '../services/httpService';
import { PanelService } from '../services/panelService';
import { SettingsService } from '../services/settingsService';
import { Settings } from '../../settings/settings';

@Component({
  selector: 'left-panel-component',
  templateUrl: './leftpanel.component.html',
  styleUrls: ['./leftpanel.component.scss']
})

export class LeftPanelComponent implements OnInit {

  constructor(
    private httpService: HttpService,
    private panelService: PanelService,
    private settingsService: SettingsService,
    private cookieService: CookieService,
    faLibrary: FaIconLibrary) {

      this.settingsService.$getEventSubject.subscribe(newSettingsDict => {
        this.settingsDict = newSettingsDict;
      });

      // To receive from PanelService to update favourite pokémon FROM RIGHT
      this.panelService.$getUpdateFavPkmnFromRightEventSubject.subscribe(pkmnName => {
          this.updateFavPkmns(pkmnName);
          this.ngOnInit();
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
    settingsDict: Settings = new Settings(20, false);

    // Fav Pokémons Dict
    favPkmnsArray = [];

    // Are we in the favourite list page?
    isFavListPage: boolean = false;

    // Urls to fetch at poekapi.co
    urls = {
      pokemon: 'https://pokeapi.co/api/v2/pokemon',
      generation: 'https://pokeapi.co/api/v2/generation',
      arrayPage: 'https://pokeapi.co/api/v2/pokemon?offset=0&limit=',
      goToArrayPage: 'https://pokeapi.co/api/v2/pokemon/',
      prevArrayPage: null,
      nextArrayPage: null,
    }

    // Array of pokémons to show on the left panel
    pkmnArray: Array<any> = [];

    // Pagination data
    page: number = 1; 

    // Service used to update the right panel when selecting a pokémon on the left panel list
    sendPkmnToShow(pkmnName): void {
      this.panelService.sendPkmnToDisplayEvent(pkmnName);
    }

    // Update list of fav pkmns after an action was done on the right panel
    updateFavPkmns(pkmnName) {
      if (this.favPkmnsArray.includes(pkmnName)) {
          this.favPkmnsArray.splice(this.favPkmnsArray.indexOf(pkmnName), 1);
      } else {
        this.favPkmnsArray.push(pkmnName);
      }
    }

    ngOnInit() {
      this.getSettingsData();
      this.requestPkmnArray(this.urls.arrayPage + this.settingsDict.nbPkmnByPage);
      this.getFavPkmnData();
    }

    getSettingsData() {
      let cookie = this.cookieService.get(this.settingsCookieName);
      if (cookie) {
        Object.assign(this.settingsDict, JSON.parse(cookie));
      }
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
      this.cookieService.set(this.favPkmnCookieName, this.favPkmnsArray.toString()) // Convert from ARRAY to STRING
      this.panelService.sendUpdateFavPkmnToRightEvent(pkmnName);
    }

    removeFavPkmn(pkmnName: string): boolean {
      if (this.isFavListPage) {
        let index = 0;
        this.pkmnArray.forEach(elem => {
          if (elem.name === pkmnName) {
              this.pkmnArray.splice(index, 1);
          }
          index += 1;
        })
      }

      if (this.favPkmnsArray.indexOf(pkmnName) != -1) {
        this.favPkmnsArray.splice(this.favPkmnsArray.indexOf(pkmnName), 1);
        this.cookieService.set(this.favPkmnCookieName, this.favPkmnsArray.toString()) // Convert from ARRAY to STRING
        this.panelService.sendUpdateFavPkmnToRightEvent(pkmnName);
        return true;
      } else {
        return false;
      }
    }

    allListPage() {
      this.requestPkmnArray(this.urls.arrayPage + this.settingsDict.nbPkmnByPage);
      this.isFavListPage = false;
    }

    favListPage() {
      this.requestFavPkmnArray();
      this.isFavListPage = true;
    }

    prevPage(): boolean {
      if (this.page > 1) {
        this.page -= 1;
        this.requestPkmnArray(this.urls.prevArrayPage);
        return true;
      }
      return false;
    }

    nextPage(): boolean {
      if (this.urls.nextArrayPage && this.urls.nextArrayPage.startsWith('https://pokemon.co/api/v2/pokemon')) {
        this.page += 1;
        this.requestPkmnArray(this.urls.nextArrayPage);
        return true;
      }
      return false;
    }

    // Not yet implemented
    goToPage(page: number): boolean {
      let limit = this.settingsDict.nbPkmnByPage;
      let offset = page * this.settingsDict.nbPkmnByPage;
      if (offset < this.nbPkmn) {
        let url = this.urls.goToArrayPage + '?offset=' + offset.toString() + '&limit=' + limit.toString();
        this.requestPkmnArray(url);
        return true;
      } else {
        return false;
      }
    }

    requestPkmnArray(url: string) {
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

    requestFavPkmnArray() {
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

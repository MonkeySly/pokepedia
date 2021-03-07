import { Component, Input, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { SettingsComponent } from 'src/app/settings/settings.component';
import { RightPanelComponent } from '../rightPanel/rightpanel.component';
import { HttpService } from '../services/httpService';
import { PanelService } from '../services/panelService';

@Component({
  selector: 'left-panel-component',
  templateUrl: './leftpanel.component.html',
  styleUrls: ['./leftpanel.component.scss']
})
export class LeftPanelComponent {

  constructor(
    private httpHandler: HttpService,
    private settings: SettingsComponent,
    private panelService: PanelService) {}

    // Inputs
    // Data to display at the top of the left panel
    @Input() nbPkmn: number;
    @Input() nbPkmnGens: number;

    // Urls to fetch at poekapi.co
    urls = {
      pokemon: 'https://pokeapi.co/api/v2/pokemon',
      generation: 'https://pokeapi.co/api/v2/generation',
      arrayPage: 'https://pokeapi.co/api/v2/pokemon?offset=0&count=' + this.settings.nbPkmnByPage,
      prevArrayPage: null,
      nextArrayPage: null,
    }

    // Array of pokémons to show on the left panel
    pkmnArray: Array<any> = [];

    // Pagination data
    page: number = 1; 

    // Service used to update the right panel when selecting a pokémon on the left panel list
    sendMessage(pkmnName): void {
      this.panelService.sendCustomEvent(pkmnName);
    }

    ngOnInit() {
      this.getPkmnArray(this.urls.arrayPage);
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
      this.httpHandler.get(url).subscribe(result => {
          let data = this.httpHandler.requestResultHandler(result);
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
  }

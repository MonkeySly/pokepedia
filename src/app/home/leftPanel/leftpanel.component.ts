import { HttpHandler } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { SettingsComponent } from 'src/app/settings/settings.component';
import { HttpService } from '../services/httpService';

@Component({
  selector: 'left-panel-component',
  templateUrl: './leftpanel.component.html',
  styleUrls: ['./leftpanel.component.scss']
})
export class LeftPanelComponent {

  constructor(
    private router: Router,
    private httpHandler: HttpService,
    private settings: SettingsComponent) {}

    pkmnArray: Array<any> = [];
    page: number = 1;

  urls = {
    pokemon: 'https://pokeapi.co/api/v2/pokemon',
    generation: 'https://pokeapi.co/api/v2/generation',
    arrayPage: 'https://pokeapi.co/api/v2/pokemon?offset=0&count=' + this.settings.nbPkmnByPage,
    prevArrayPage: null,
    nextArrayPage: null,
  }


    data: JSON;
    pkmnNb: number;
    pkmnNbGens: number;


    ngOnInit() {
      console.log("left panel loaded");
      this.getNbPkmn();
      this.getPkmnNbGenerations();
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

    getNbPkmn() {
      this.httpHandler.get(this.urls.pokemon).subscribe(result => {
          this.pkmnNb = this.httpHandler.requestResultHandler(result).count;
        }, error => {
          console.log('error:', error);
        }
      );
    }

    getPkmnNbGenerations() {
      this.httpHandler.get(this.urls.generation).subscribe(result => {
          this.pkmnNbGens = this.httpHandler.requestResultHandler(result).count;
        }, error => {
          console.log('error:', error);
        }
      );
    }
  }

import { Component, OnInit, ViewChildren } from '@angular/core';
import {Router} from '@angular/router';
import { throwError } from 'rxjs';
import { HttpService } from './services/httpService';

@Component({
  selector: 'home-component',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  constructor(
    private httpService: HttpService,
  ) {}

  nbPkmn: number = 0;
  nbPkmnGens: number = 0;

  ngOnInit() {
    this.getNbPkmn();
    this.getPkmnNbGenerations();
    console.log('%c Oh my! Time to get some coffee and get these sweet EVs!', 'color: #FF0000');
  }

  getNbPkmn() {
    this.httpService.get('https://pokeapi.co/api/v2/pokemon/').subscribe(result => {
        this.nbPkmn = this.httpService.requestResultHandler(result).count;
      }, error => {
        console.log('error:', error);
        return throwError(error);
      }
    );
  }

  getPkmnNbGenerations() {
    this.httpService.get('https://pokeapi.co/api/v2/generation/').subscribe(result => {
        this.nbPkmnGens = this.httpService.requestResultHandler(result).count;
      }, error => {
        console.log('error:', error);
        return throwError(error);
      }
    );
  }

}

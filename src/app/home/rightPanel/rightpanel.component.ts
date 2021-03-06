import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { HttpService } from '../services/httpService';
import { PanelService } from '../services/panelService';

@Component({
  selector: 'right-panel-component',
  templateUrl: './rightpanel.component.html',
  styleUrls: ['./rightpanel.component.scss']
})
export class RightPanelComponent implements OnInit {

    dataReceived: boolean = false;

    pkmnName: string = 'haunter';

    pkmnData: any;
    abilitiesData: Array<any> = [];
    movesData: Array<any> = [];

    private subscriptionPknmName: Subscription;

  constructor(
    private router: Router,
    private httpService: HttpService,
    private panelService: PanelService,
    ) {

      this.panelService.$getEventSubject.subscribe(newPkmnName => {
          this.pkmnName = newPkmnName;
          this.ngOnInit();
      });

    }

    ngOnInit() {
      console.log("right panel loaded");
      this.getPkmnData();
    }

    getPkmnData() {
      this.httpService.get('https://pokeapi.co/api/v2/pokemon/' + this.pkmnName).subscribe(result => {
        this.pkmnData = this.httpService.requestResultHandler(result);
        console.log(this.pkmnData);
        this.getAbilitiesData()
        this.getMovesData();
        
        this.dataReceived = true;
      }, error => {
        console.log('error: ', error);
      })
    }

    getAbilitiesData() {
      this.abilitiesData = [];
      for (let ability of this.pkmnData.abilities) {
          this.httpService.get('https://pokeapi.co/api/v2/ability/' + ability.ability.name).subscribe(result => {
            let abilityArray = this.httpService.requestResultHandler(result);
            abilityArray.is_hidden = ability.is_hidden;
            this.abilitiesData.push(abilityArray);
          }, error => {
            console.log('error: ', error);
          })
      }
    }

    getMovesData() {
      this.movesData = [];
      for (let move of this.pkmnData.moves) {
        if (move.version_group_details[0].move_learn_method.name != 'machine' && move.version_group_details[0].move_learn_method.name != 'egg') {
            this.httpService.get('https://pokeapi.co/api/v2/move/' + move.move.name).subscribe(result => {
              let tmp = this.httpService.requestResultHandler(result);
              tmp.level_learned_at = move.version_group_details[0].level_learned_at;
              this.movesData.push(tmp);
            }, error => {
              console.log('error: ', error)
            });
        }
      }
    }

    displayEnglishAbilityEffect(ability) {
      for (let effect of ability.effect_entries) {
          if (effect.language.name === 'en') {
              return effect.effect;
          }
      }
      return "No english description found."
    }

    capitalize(str: string) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    // In Kilograms
    convertWeight(weight: number) {
      if (weight) {
        return weight / 10;
      } else {
        return "Error, no weight found."
      }
    }

    // In Meter
    convertHeight(height: number) {
      if (height) {
        return height / 10;
      } else {
        return "Error, no height found."
      }
    }
}

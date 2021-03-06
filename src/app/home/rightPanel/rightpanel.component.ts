import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { HttpService } from '../services/httpService';

@Component({
  selector: 'right-panel-component',
  templateUrl: './rightpanel.component.html',
  styleUrls: ['./rightpanel.component.scss']
})
export class RightPanelComponent {
  constructor(
    private router: Router,
    private httpService: HttpService
    ) {}

    dataReceived: boolean = false;

    pkmnId: number = 1;

    pkmnData: any;
    abilitiesData: Array<any> = [];
    movesData: Array<any> = [];


    ngOnInit() {
      console.log("right panel loaded");
      this.getPkmnData();
    }

    getPkmnData() {
      this.httpService.get('https://pokeapi.co/api/v2/pokemon/' + this.pkmnId).subscribe(result => {
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

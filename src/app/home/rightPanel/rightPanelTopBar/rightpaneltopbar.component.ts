import { Component, Input, OnInit } from "@angular/core";
import { HttpService } from "../../services/httpService";
import { PanelService } from "../../services/panelService";

 @Component({
     selector: 'right-panel-top-bar',
     templateUrl: './rightpaneltopbar.component.html',
     styleUrls: ['./rightpaneltopbar.component.scss'],
 })

 export class RightPanelTopBarComponent implements OnInit {

    constructor(
        private httpService: HttpService,
        private panelService: PanelService
    ) {}

    @Input() nbPkmn: number = 0;
    @Input() pkmnData: any = [];

    // Next and previous pkmns to display on top bar
    pkmnAround: any = {prev: [], next: []};

    // Service used to update the right panel when selecting a pokémon on the left panel list
    sendPkmnToShow(pkmnName): void {
      this.panelService.sendCustomEvent(pkmnName);
    }

    ngOnInit() {
      this.getAroundPkmn(this.pkmnData.id);
    }

    ngOnChanges() {
      this.getAroundPkmn(this.pkmnData.id);
    }

    getAroundPkmn(pkmnId) {
        if (pkmnId > 1) {
          this.httpService.get('https://pokeapi.co/api/v2/pokemon/' + (pkmnId-1)).subscribe(result => {
            this.pkmnAround.prev = this.httpService.requestResultHandler(result);
          }, error => {
            console.log('error', error)
          });
        }
        if (pkmnId < this.nbPkmn) {
          this.httpService.get('https://pokeapi.co/api/v2/pokemon/' + (pkmnId+1)).subscribe(result => {
            this.pkmnAround.next = this.httpService.requestResultHandler(result);
          }, error => {
            console.log('error', error)
          });
        } 
      }

    capitalize(str: string) {
        if (!str) {
            return '';
        }
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
 }
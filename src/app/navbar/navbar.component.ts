import { Component } from '@angular/core';
import {Router} from '@angular/router';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { PanelService } from '../home/services/panelService';

@Component({
  selector: 'navbar-component',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
    constructor(
      private panelService: PanelService) {}

    // FontAwesome Icons
    faSearch = faSearch;

    pkmnToSearch: string = "";

    // Service used to update the right panel when selecting a pokémon on the left panel list
    searchPkmn(): void {
      let a = this.panelService.sendCustomEvent(this.pkmnToSearch);
      this.pkmnToSearch = "";
    }

    ngOnInit() {
      console.log("navbar loaded");
    }
}

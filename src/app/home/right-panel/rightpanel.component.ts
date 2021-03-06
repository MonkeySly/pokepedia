import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'right-panel-component',
  templateUrl: './rightpanel.component.html',
  styleUrls: ['./rightpanel.component.scss']
})
export class RightPanelComponent {
  constructor(private router: Router) {}

  ngOnInit() {
    console.log("right panel loaded");
  }
}

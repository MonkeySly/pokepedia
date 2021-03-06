import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'left-panel-component',
  templateUrl: './leftpanel.component.html',
  styleUrls: ['./leftpanel.component.scss']
})
export class LeftPanelComponent {
  constructor(private router: Router) {}

  ngOnInit() {
    console.log("left panel loaded");
  }
}

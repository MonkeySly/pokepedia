import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'settings-component',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})

export class SettingsComponent implements OnInit {
  constructor(private route: ActivatedRoute) { }

  nbPkmnByPage = 20;

  ngOnInit() {
    console.log('settings page loaded');
  }

}
import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-inline-help',
  templateUrl: './inline-help.component.html',
  styles: []
})
export class InlineHelpComponent implements OnInit {

  defaultVisible: boolean = false;

  id: string = '_' + Math.random().toString(36).substr(2, 9)

  @Input()
  text: string = "";

  constructor() { }

  ngOnInit() {
  }

  toggleDefault() {
    this.defaultVisible = !this.defaultVisible;
  }

}

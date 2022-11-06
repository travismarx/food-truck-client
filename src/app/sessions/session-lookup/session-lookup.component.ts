import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-session-lookup',
  templateUrl: './session-lookup.component.html',
  styleUrls: ['./session-lookup.component.scss'],
})
export class SessionLookupComponent implements OnInit {
  @Output() dateSelect = new EventEmitter();
  @Output() textInput = new EventEmitter();
  value: Date;
  text;

  maxDate = new Date();
  constructor() {}

  ngOnInit(): void {}

  onDateSelect(event) {
    this.dateSelect.emit(event);
  }

  onTextInput(event) {
    this.textInput.emit(event);
  }
}

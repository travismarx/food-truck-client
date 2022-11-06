import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-session-options',
  templateUrl: './session-options.component.html',
  styleUrls: ['./session-options.component.scss'],
})
export class SessionOptionsComponent implements OnInit {
  @Input() incompleteOrdersLength;
  @Input() sessionStatus;
  @Output() endSession = new EventEmitter();

  items;

  constructor(private confirmationService: ConfirmationService) {}

  ngOnInit(): void {
    // console.log(this.incompleteOrdersLength);
    this.items = [
      {
        label: 'Home Page',
        icon: 'pi pi-fw pi-home',
        routerLink: [''],
      },
      {
        label: 'End Session',
        icon: 'pi pi-fw pi-power-off',
        command: ($event) => {
          this.confirmationService.confirm({
            target: event.target,
            message:
              'Are you sure that you want to end this session? This cannot be undone.',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
              //confirm action
              this.endSession.emit();
            },
            reject: () => {
              //reject action
            },
          });
        },
      },
    ];
  }

  endSessionCommand() {
    this.endSession.emit();
  }
}

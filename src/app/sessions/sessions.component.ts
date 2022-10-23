import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionsService } from './sessions.service';
// import { ConfirmationService } from 'primeng/api';

interface SessionType {
  sessionTypeId: number;
  title: string;
}

@Component({
  selector: 'app-sessions',
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.scss'],
})
export class SessionsComponent implements OnInit {
  loadingOptions = false;
  sessionOptions: any;
  openSessions: any;
  menuOptions: any[] = [];
  showStartSessionDialog = false;
  startingSessionType: any;
  newSessionTitle: string = '';
  newSessionMenuType: any;
  newMenuTitle = '';
  saveNewMenu = false;
  isStartingSession = false;

  constructor(
    private sessionsService: SessionsService,
    private router: Router // private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loadOptions();
    this.loadOpenSessions();
    this.loadMenuOptions();
  }

  loadOptions() {
    this.sessionsService.getSessionOptions().subscribe((options) => {
      this.sessionOptions = options;
    });
  }

  loadOpenSessions() {
    this.sessionsService.getOpenSessions().subscribe((sessions) => {
      this.openSessions = sessions;
    });
  }

  loadMenuOptions() {
    this.sessionsService.getMenuOptions().subscribe((options) => {
      console.log('MENU OPTIONS: ', options);
      this.menuOptions = JSON.parse(JSON.stringify(options)).map((group) => {
        for (let item of group.items) {
          item.enabled = true;
        }
        return group;
      });
      console.log(this.menuOptions, 'menu options');
    });
  }

  openStartSessionDialog(sessionType: SessionType) {
    console.log(sessionType);
    this.startingSessionType = sessionType;
    this.newSessionTitle = `${
      sessionType.title
    } - ${new Date().toLocaleDateString()}`;
    this.showStartSessionDialog = true;
  }

  startNewSession(sessionType: SessionType) {
    console.log('start new session with type: ', sessionType);
    const newSessionBody = {
      sessionTypeId: sessionType.sessionTypeId,
      sessionTitle: this.newSessionTitle,
      menu: {
        ...this.newSessionMenuType,
        newMenuTitle: this.newMenuTitle,
        saveNewMenu: this.saveNewMenu,
      },
    };
    console.log('NEW SESSION BODY: ', newSessionBody);
    this.isStartingSession = true;
    this.sessionsService
      .startNewSession(newSessionBody)
      .subscribe((res: any) => {
        console.log(res, 'res for new session');
        this.isStartingSession = false;
        this.router.navigate([`/sessions/${res.sessionId}`]);
      });
  }

  cancelNewSession() {
    this.startingSessionType = null;
    this.showStartSessionDialog = false;
    this.newSessionTitle = '';
    this.isStartingSession = false;
  }

  incrementPrice(idx: any) {
    this.newSessionMenuType.items[idx].price++;
  }

  decrementPrice(idx: any) {
    this.newSessionMenuType.items[idx].price--;
  }

  joinExistingSession(session: any) {
    console.log('join this session: ', session);
    this.router.navigate([`/sessions/${session.sessionId}`]);
  }
}

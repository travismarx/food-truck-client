import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionsService } from './sessions.service';
import { Message, MessageService } from 'primeng/api';
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
  loadingOpenSessions = false;
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
  sessionLookupResults = [];
  loadingLookups = false;
  lookupDate = null;
  lookupText = null;

  constructor(
    private sessionsService: SessionsService,
    private messageService: MessageService,
    private router: Router // private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loadOptions();
    this.loadOpenSessions();
    this.loadMenuOptions();
  }

  loadOptions() {
    this.loadingOptions = true;
    this.sessionsService.getSessionOptions().subscribe(
      (options) => {
        this.loadingOptions = false;
        this.sessionOptions = options;
      },
      (err) => {
        this.loadingOptions = false;
        this.showToast(
          'error',
          'Error',
          'An error occurred while loading menu options.',
          5000
        );
      }
    );
  }

  loadOpenSessions() {
    this.loadingOpenSessions = true;
    this.sessionsService.getOpenSessions().subscribe(
      (sessions) => {
        this.loadingOpenSessions = false;
        this.openSessions = sessions;
      },
      (err) => {
        this.loadingOpenSessions = false;
        this.showToast(
          'error',
          'Error',
          'An error occurred while loading open sessions.',
          5000
        );
      }
    );
  }

  loadMenuOptions() {
    this.sessionsService.getMenuOptions().subscribe((options) => {
      this.menuOptions = JSON.parse(JSON.stringify(options)).map((group) => {
        for (let item of group.items) {
          item.enabled = true;
        }
        return group;
      });
    });
  }

  openStartSessionDialog(sessionType: SessionType) {
    this.startingSessionType = sessionType;
    this.newSessionTitle = `${
      sessionType.title
    } - ${new Date().toLocaleDateString()}`;
    this.showStartSessionDialog = true;
  }

  startNewSession(sessionType: SessionType) {
    const newSessionBody = {
      sessionTypeId: sessionType.sessionTypeId,
      sessionTitle: this.newSessionTitle,
      menu: {
        ...this.newSessionMenuType,
        newMenuTitle: this.newMenuTitle,
        saveNewMenu: this.saveNewMenu,
      },
    };
    this.isStartingSession = true;
    this.sessionsService.startNewSession(newSessionBody).subscribe(
      (res: any) => {
        this.isStartingSession = false;
        this.router.navigate([`/sessions/${res.sessionId}`]);
      },
      (err) => {
        this.showToast(
          'error',
          'Error',
          'An error occurred while starting the session. Please try again.',
          5000
        );
      }
    );
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
    this.router.navigate([`/sessions/${session.sessionId}`]);
  }

  onLookupDateSelect(date) {
    this.lookupDate = date;
  }

  onLookupTextInput(text) {
    this.lookupText = text;
  }

  lookupSessions() {
    this.loadingLookups = true;
    this.sessionsService
      .searchSessions(this.lookupDate, this.lookupText)
      .subscribe(
        (res: any[]) => {
          this.loadingLookups = false;
          this.sessionLookupResults = res;
        },
        (err) => {
          this.showToast(
            'error',
            'Error',
            'An error occurred while searching for sessions. Please try again',
            5000
          );
        }
      );
  }

  showToast(severity, summary, detail, clearAfter) {
    this.messageService.add({
      severity: severity,
      summary: summary,
      detail: detail,
    });
    setTimeout(() => {
      this.messageService.clear();
    }, clearAfter);
  }
}

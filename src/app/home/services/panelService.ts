import { Injectable } from '@angular/core';
import { Observable, Subject, ReplaySubject } from 'rxjs';

@Injectable()
export class PanelService {

    private pkmnNameSubject: Subject<any> = new ReplaySubject(1);

    get $getEventSubject(): Observable<any> {
        return this.pkmnNameSubject.asObservable();
    }
    resetEventObserver(): void {
        this.pkmnNameSubject = new ReplaySubject(1);
    }

    sendCustomEvent(newPkmnName):void {
        this.pkmnNameSubject.next(newPkmnName);
    }
}
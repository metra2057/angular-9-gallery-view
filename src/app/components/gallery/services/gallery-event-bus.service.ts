import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { IGalleryEvent } from '../gallery.models';
import { filter } from 'rxjs/operators';

@Injectable()
export class GalleryEventBusService {
  protected eventSbg$: BehaviorSubject<IGalleryEvent> = new BehaviorSubject(null);

  constructor() {
  }

  public on(): Observable<IGalleryEvent> {
    return this.eventSbg$.pipe(
      filter(event => Boolean(event?.action)),
    );
  }

  public emit(event: IGalleryEvent): void {
    this.eventSbg$.next(event);
  }
}

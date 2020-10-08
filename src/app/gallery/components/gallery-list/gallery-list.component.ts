import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IGalleryListItemConfig } from '../../interfaces/gallery-list-item-config.interface';

@Component({
  selector: 'app-gallery-list',
  templateUrl: './gallery-list.component.html',
  styleUrls: ['./gallery-list.component.scss'],
})
export class GalleryListComponent {
  @Input() public defaultImage: string;
  @Input() public images: string [];
  @Input() public imagesConfig: IGalleryListItemConfig [];
  @Output() private emitItemClick: EventEmitter<any> = new EventEmitter<any>();
  @Output() private emitListItemPointerDown: EventEmitter<string> = new EventEmitter<string>();

  constructor() {
  }

  public trackByImageUrl(item): string {
    if (!item) {
      return;
    }

    return item.imageUrl;
  }

  public getImageConfig(url: string) {
    if (!this.imagesConfig?.length) {
      return;
    }

    return this.imagesConfig.find((item) => item.imageUrl === url);
  }

  public onListItemClick(event: string) {
    this.emitItemClick.emit(event);
  }
}

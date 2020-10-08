import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IGalleryListItemConfig } from '../../../interfaces/gallery-list-item-config.interface';

@Component({
  selector: 'app-gallery-list-item',
  templateUrl: './gallery-list-item.component.html',
  styleUrls: ['./gallery-list-item.component.scss'],
})
export class GalleryListItemComponent implements OnInit {
  @Input() image: string;
  @Input() imageConfig: IGalleryListItemConfig;
  @Output() emitClick: EventEmitter<string> = new EventEmitter<string>();

  constructor() {
  }

  ngOnInit(): void {
  }

  public onClick(): void {
    this.emitClick.emit(this.image);
  }
}

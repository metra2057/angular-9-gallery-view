import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-gallery-list',
  templateUrl: './gallery-list.component.html',
  styleUrls: ['./gallery-list.component.scss'],
})
export class GalleryListComponent implements OnInit {
  @Input() public defaultImage: string;
  @Input() public items: string [];
  @Input() public itemsState = [];
  @Output() private emitItemClick: EventEmitter<any> = new EventEmitter<any>();
  @Output() private emitListItemPointerDown: EventEmitter<string> = new EventEmitter<string>();

  constructor() {
  }

  ngOnInit(): void {
  }

  public onListItemClick(url: string, index: number): void {
    this.emitItemClick.emit({url, index});
  }

  public onItemPointerDown(): void {
    this.emitListItemPointerDown.emit();
  }
}

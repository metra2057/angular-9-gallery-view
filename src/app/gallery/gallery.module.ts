import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GalleryComponent } from './components/gallery.component';
import { GalleryListComponent } from './components/gallery-list/gallery-list.component';
import { GalleryListItemComponent } from './components/gallery-list/gallery-list-item/gallery-list-item.component';

@NgModule({
  imports: [CommonModule],
  declarations: [
    GalleryComponent,
    GalleryListComponent,
    GalleryListItemComponent,
  ],
  exports: [
    GalleryComponent,
    GalleryListComponent
  ]
})

export class GalleryModule {
}

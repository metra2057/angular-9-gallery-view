import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GalleryComponent } from './components/gallery.component';
import { GalleryListComponent } from './components/gallery-list/gallery-list.component';

@NgModule({
  imports: [CommonModule],
  declarations: [
    GalleryComponent,
    GalleryListComponent,
  ],
  exports: [
    GalleryComponent,
    GalleryListComponent
  ]
})

export class GalleryModule {
}

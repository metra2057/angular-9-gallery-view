import { Injectable } from '@angular/core';

/** Provides default configuration values for gallery */
@Injectable()
export class GalleryConfig {
  animationTransition = '.4s';
  animationType = 'ease-in-out';
  showControls = true;
  defaultImage = null;
  images = [];
  listItemsAutoWidth = true;
  listItemsMinWidth = '120px';
  listItemsTransition = '.3s';
  listItemsTransitionType = 'ease-in-out';
  listItemsTransitionSelector = 'all';
  listItemsTransitionDelay = '0s';
}

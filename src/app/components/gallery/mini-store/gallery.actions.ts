import { Injectable } from '@angular/core';
import { IGalleryMiniStoreAction } from '../gallery.models';
import { setGalleryStoreAction } from '../gallery.utils';

@Injectable()
export class GalleryActions {
  static readonly UPDATE_POINTER_STATE_ACTION = '[Gallery] Update pointer state';
  static readonly UPDATE_MOVABLE_HELPER_STATE_ACTION = '[Gallery] Update movable helper state';
  static readonly UPDATE_IMAGE_WRAPPER_STATE_ACTION = '[Gallery] Update image wrapper state';
  static readonly UPDATE_IMAGE_STATE_ACTION = '[Gallery] Update image state';
  static readonly UPDATE_LIST_ITEMS_STYLES_STATE_ACTION = '[Gallery] Update list items styles state';

  static updatePointerStateAction(payload: any): IGalleryMiniStoreAction {
    return setGalleryStoreAction(GalleryActions.UPDATE_POINTER_STATE_ACTION, payload);
  }

  static updateMovableHelperStateAction(payload: any): IGalleryMiniStoreAction {
    return setGalleryStoreAction(GalleryActions.UPDATE_MOVABLE_HELPER_STATE_ACTION, payload);
  }

  static updateImageWrapperStateAction(payload: any): IGalleryMiniStoreAction {
    return setGalleryStoreAction(GalleryActions.UPDATE_IMAGE_WRAPPER_STATE_ACTION, payload);
  }

  static updateImageStateAction(payload: any): IGalleryMiniStoreAction {
    return setGalleryStoreAction(GalleryActions.UPDATE_IMAGE_STATE_ACTION, payload);
  }

  static updateListItemsStylesStateAction(payload: any): IGalleryMiniStoreAction {
    return setGalleryStoreAction(GalleryActions.UPDATE_LIST_ITEMS_STYLES_STATE_ACTION, payload);
  }
}

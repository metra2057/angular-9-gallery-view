import { Injectable } from '@angular/core';
import { setGalleryStoreAction } from '../gallery.utils';
import { IGalleryMiniStoreAction } from '../interfaces/gallery-store.action';

@Injectable()
export class GalleryActions {
  static readonly UPDATE_POINTER_STATE_ACTION = '[Gallery] Update pointer state';
  static readonly UPDATE_MOVABLE_HELPER_STATE_ACTION = '[Gallery] Update movable helper state';
  static readonly UPDATE_IMAGE_WRAPPER_STATE_ACTION = '[Gallery] Update image wrapper state';
  static readonly UPDATE_IMAGE_STATE_ACTION = '[Gallery] Update image state';
  static readonly UPDATE_LIST_ITEMS_STYLES_STATE_ACTION = '[Gallery] Update list items styles state';
  static readonly SWAP_LIST_ITEMS_ACTION = '[Gallery] Swap list items state';

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

  static swapListItemsAction(payload: any): IGalleryMiniStoreAction {
    return setGalleryStoreAction(GalleryActions.SWAP_LIST_ITEMS_ACTION, payload);
  }
}

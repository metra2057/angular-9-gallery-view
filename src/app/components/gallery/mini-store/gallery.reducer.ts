import { GalleryActions } from './gallery.actions';

export function galleryReducer(state, {type, payload}) {
  switch (type) {
    case GalleryActions.UPDATE_POINTER_STATE_ACTION:
      return {
        ...state,
        pointer: {...state.pointer, ...payload}
      };
    case GalleryActions.UPDATE_MOVABLE_HELPER_STATE_ACTION:
      return {
        ...state,
        movableHelper: {...state.movableHelper, ...payload}
      };
    case GalleryActions.UPDATE_IMAGE_WRAPPER_STATE_ACTION:
      return {
        ...state,
        imageWrapper: {...state.imageWrapper, ...payload}
      };
    case GalleryActions.UPDATE_IMAGE_STATE_ACTION:
      return {
        ...state,
        image: {...state.image, ...payload}
      };
    case GalleryActions.UPDATE_LIST_ITEMS_STYLES_STATE_ACTION:
      return {
        ...state,
        list: {...state.list, ...payload}
      };
    default:
      return {...state};
  }
}

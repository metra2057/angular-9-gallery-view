import { IListState } from './gallery-list-state.interface';
import { IPointerState } from './pointer-state.interface';
import { IImageWrapperState } from './image-wrapper-state.interface';
import { IMainImageState } from './main-image-state.interface';
import { IMovableHelperState } from './movable-helper-state.interface';

export interface IGalleryState {
  pointer: IPointerState;
  movableHelper: IMovableHelperState;
  imageWrapper: IImageWrapperState;
  image: IMainImageState;
  list: IListState;
}

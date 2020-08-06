export interface IGalleryState {
  pointer: IPointerState;
  movableHelper: IMovableHelperState;
  imageWrapper: IImageWrapperState;
  image: IImageState;
  list: IListState;
}

export interface IPointerState {
  touchStartPosition: number;
  position: number;
}

export interface IMovableHelperState {
  relativeSide: string;
  attached: boolean;
  position: number;
  src: string;
}

export interface IImageWrapperState {
  touched: boolean;
}

export interface IImageState {
  src: string;
}

export interface IListState {
  list: string [];
  styles: IListItemStyles [];
}

export interface IGalleryEvent {
  action: string;
  initiator: string;
  previousValue: string;
  currentValue: string;
  shuffleStep: number;
}

export interface ITransformStyles {
  transform: string;
  transition?: string;
}

export interface IDynamicItemStyle extends ITransformStyles {
  width: string;
  minWidth: string;
  zIndex: number | string;
  transitionDelay: string;
}

export interface IListItemStyles {
  url: string;
  class: string | string [];
  styles: IDynamicItemStyle;
  index: number;
}

export interface IGalleryMiniStoreAction {
  type: string;
  payload: any;
}


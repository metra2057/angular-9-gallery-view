import { Injectable } from '@angular/core';
import { IGalleryState } from '../gallery.models';
import { galleryReducer } from './gallery.reducer';

@Injectable()
export class GalleryMiniStore {
  private initialState: IGalleryState = {
    pointer: {
      position: null,
      touchStartPosition: null
    },
    movableHelper: {
      src: null,
      position: null,
      attached: false,
      relativeSide: null,
    },
    imageWrapper: {
      touched: false
    },
    image: {
      src: null
    },
    list: {
      styles: null,
      list: null
    }
  };

  constructor() {
    this.initStore(galleryReducer, Object.assign({}, this.initialState));
  }

  private initStore(reducer, state): void {
    this.initialState = Object.freeze(reducer(this.initialState, state));
  }

  public dispatch(action): void {
    this.initialState = Object.freeze(galleryReducer(this.initialState, action));
  }

  public get<T>(key: string): T {
    return this.initialState[key];
  }
}

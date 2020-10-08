import { Injectable } from '@angular/core';
import { galleryReducer } from './gallery.reducer';
import { IGalleryState } from '../interfaces/gallery-state.interface';

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
      list: null,
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

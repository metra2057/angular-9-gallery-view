import { Injectable } from '@angular/core';
import {
  arrayLength,
  arrayMean, fillArrayByRange,
  swapArrayItemsToLeft,
  swapArrayItemsToRight, swapItemToArrayCenter
} from '../gallery.utils';
import { GalleryActions } from '../mini-store/gallery.actions';
import { GalleryMiniStore } from '../mini-store/gallery.store';
import { IMainImageState } from '../interfaces/main-image-state.interface';
import { IGalleryListItemConfig } from '../interfaces/gallery-list-item-config.interface';

@Injectable()
export class GalleryService {
  private readonly LIST_LEFT_ITEM_CLASS = '--left';
  private readonly LIST_RIGHT_ITEM_CLASS = '--right';
  private readonly LIST_CENTER_ITEM_CLASS = '--center';
  private readonly LIST_ITEM_TRANSFORM_STEP_VALUE = 28;
  private readonly NORMALIZE_TRANSFORM_VALUE = 50;

  constructor(
    private galleryStore: GalleryMiniStore
  ) {
  }

  public createSimpleList(initialArray: string [], imageInCenter): string [] {
    const mean = arrayMean(initialArray);
    if (this.checkSameUrlInListItemConfig(initialArray, imageInCenter)) {
      while (initialArray[mean] !== imageInCenter) {
        initialArray = swapArrayItemsToRight(initialArray);
      }
      return initialArray;
    }

    return swapItemToArrayCenter(initialArray, imageInCenter);
  }

  public createConfigList(mainImageUrl: string, list: string []) {
    const mean = arrayMean(list);
    const listLn = arrayLength(list);
    const positions = fillArrayByRange(
      -(mean * this.LIST_ITEM_TRANSFORM_STEP_VALUE) - this.NORMALIZE_TRANSFORM_VALUE,
      mean * this.LIST_ITEM_TRANSFORM_STEP_VALUE - this.NORMALIZE_TRANSFORM_VALUE,
      this.LIST_ITEM_TRANSFORM_STEP_VALUE
    );
    const zIndexes = fillArrayByRange(0, listLn, 1);
    const maxZIndex = listLn + 1;
    return Object.assign([], list)
      .map((url, index) => {
        return this.createListItemConfig(
          url,
          index,
          this.setupListItemStyles(
            index === mean ? maxZIndex : index < mean ? zIndexes[index] : zIndexes[listLn - index],
            positions[index],
          ),
          [this.getItemSideClass(index, mean)]
        );
      });
  }

  public createListItemConfig(
    url: string,
    index: number,
    styles: { zIndex: number; transform: string; },
    classes: string [],
  ): IGalleryListItemConfig {
    return {
      index,
      imageUrl: url,
      cssStyles: styles,
      cssClasses: classes,
    };
  }

  public setupListItemStyles(
    zIndex: number,
    offset: number,
  ) {
    return {
      ...(zIndex && {zIndex}),
      transform: this.getTransform(offset)
    };
  }

  private getItemSideClass(index: number, mean: number): string {
    return index === mean
      ? this.LIST_CENTER_ITEM_CLASS
      : index < mean ? this.LIST_LEFT_ITEM_CLASS : this.LIST_RIGHT_ITEM_CLASS;
  }

  public updateListItemsStyles(list): any {
    if (!list?.length) {
      return;
    }

    const mean = arrayMean(list);
    const listLn = arrayLength(list);
    const maxZIndex = listLn + 1;
    const positions = fillArrayByRange(
      -(mean * this.LIST_ITEM_TRANSFORM_STEP_VALUE) - this.NORMALIZE_TRANSFORM_VALUE,
      (mean * this.LIST_ITEM_TRANSFORM_STEP_VALUE) - this.NORMALIZE_TRANSFORM_VALUE,
      this.LIST_ITEM_TRANSFORM_STEP_VALUE
    );
    return list.map((item, index) => {
      const zIndexes = fillArrayByRange(0, listLn, 1);
      const zIndexSetup = index === mean ? maxZIndex : index < mean ? zIndexes[index] : zIndexes[listLn - index];

      return {
        ...item,
        cssStyles: {
          zIndex: zIndexSetup,
          transform: this.getTransform(positions[index])
        },
        cssClasses: [this.getItemSideClass(index, mean)]
      };
    });
  }

  private checkSameUrlInListItemConfig(arrayImages, url: string): boolean {
    if (!arrayImages?.length) {
      return;
    }

    return Boolean(arrayImages.find(imgUrl => imgUrl === url));
  }

  public swapListItems(actionType: string, list): void {
    const mean = arrayMean(list);
    let storageList = list;

    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < list.length; i++) {
      if (!storageList[mean] || storageList[mean].imageUrl === this.getMainItemUrl()) {
        break;
      }

      switch (actionType) {
        case 'NEXT':
          storageList = this.updateListItemsStyles(swapArrayItemsToRight(storageList));
          break;
        case 'PREV':
          storageList = this.updateListItemsStyles(swapArrayItemsToLeft(storageList));
      }

      this.galleryStore.dispatch(
        GalleryActions.updateListItemsStylesStateAction({
          list: storageList
        })
      );
    }
  }

  public getMainItemUrl(): string {
    const image = this.galleryStore.get<IMainImageState>('image');

    if (!image?.src) {
      return '';
    }

    return image.src;
  }

  private getTransform(value: number): string {
    return `translateX(${value}%)`;
  }
}

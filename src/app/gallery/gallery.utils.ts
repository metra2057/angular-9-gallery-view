import { IGalleryMiniStoreAction } from './interfaces/gallery-store.action';

export function arrayMean<T>(array: T []): number {
  return Math.round(actualArrayLength(array) / 2);
}

export function arrayLength<T>(array: T []): number {
  return array.length;
}

export function actualArrayLength<T>(array: T []): number {
  return arrayLength(array) - 1;
}

/*
* @Description: Swap items in array to right on one step
* @Params: array
* @Example: swapArrayItemsToRight([1,2,3,4)) => [4,1,2,3]
* */
export function swapArrayItemsToRight<T>(array: T []): T [] {
  return array.map((item, index, arrayState) => {
    const next = arrayState[index + 1];
    const first = arrayState[0];
    return next ? next : first;
  });
}

/*
* @Description: Swap items in array to left on one step
* @Params: array
* @Example: swapArrayItemsToLeft([1,2,3,4)) => [2,3,4,1]
* */
export function swapArrayItemsToLeft<T>(array: T []): T [] {
  return array.map((item, index, arrayState) => {
    const prev = arrayState[index - 1];
    const last = arrayState[array.length - 1];
    return prev ? prev : last;
  });
}

/*
* @Description: Fill array from min to max values with step
* @Params: min value, max value, step value
* @Example: fillArrayByRange(-124, 124, 22) => [-124, -102, -80, -58, -36, -14, 8, 30, 52, 74, 96, 118]
* */
export const fillArrayByRange = ((min: number, max: number, step: number = 1) =>
  (Array(Math.floor((max - min) / step) + 1)
    .fill(min)
    .map(((x, i) => (x + i * step)))));

/*
* @Description: Push new item to array center and return the new array
* @Params: array, item for push
* @Example: swapItemToArrayCenter([1,2,4,5], 3) => [1,2,3,4,5]
* */
export const swapItemToArrayCenter = (array, item) => {
  const copy = Object.assign([], array);
  copy.splice(
    arrayMean(array),
    0,
    item
  );

  return copy;
};

export const setGalleryStoreAction = <T>(type: string, payload?: T)
  : IGalleryMiniStoreAction => ({type, payload});

import { IGalleryMiniStoreAction } from './gallery.models';

export function arrayMean<T>(array: T []): number {
  return Math.round(actualArrayLength(array) / 2);
}

export function arrayLength<T>(array: T []): number {
  return array.length;
}

export function actualArrayLength<T>(array: T []): number {
  return arrayLength(array) - 1;
}

export function shuffleArrayRight<T>(array: T []): T [] {
  return array.map((item, index, arrayState) => {
    return arrayState[index + 1]
      ? arrayState[index + 1]
      : arrayState[0];
  });
}

export function shuffleArrayLeft<T>(array: T []): T [] {
  return array.map((item, index, arrayState) => {
    return arrayState[index - 1]
      ? arrayState[index - 1]
      : arrayState[array.length - 1];
  });
}

export function getArrayItemIndex<T>(array: T [], comp: T, asObjField?: string): number {
  return array.indexOf(
    asObjField
      ? array.find(det => det[asObjField] === comp)
      : comp
  );
}

export const setGalleryStoreAction = <T>(type: string, payload?: T): IGalleryMiniStoreAction => ({type, payload});

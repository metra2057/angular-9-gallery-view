import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { Subscription } from 'rxjs';
import { arrayMean } from '../gallery.utils';
import { GalleryAnimations } from '../animations/gallery.animations';
import { GalleryConfig } from '../gallery.config';
import { GalleryMiniStore } from '../mini-store/gallery.store';
import { GalleryActions } from '../mini-store/gallery.actions';
import { GalleryEventBusService } from '../services/gallery-event-bus.service';
import { IHelperLeaveAnimationParams } from '../interfaces/helper-leave-animation-params.intercase';
import { IPointerState } from '../interfaces/pointer-state.interface';
import { IImageWrapperState } from '../interfaces/image-wrapper-state.interface';
import { IMainImageState } from '../interfaces/main-image-state.interface';
import { IMovableHelperState } from '../interfaces/movable-helper-state.interface';
import { GalleryService } from '../services/gallery.service';
import { IGalleryListItemConfig } from '../interfaces/gallery-list-item-config.interface';
import { IListState } from '../interfaces/gallery-list-state.interface';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
  animations: GalleryAnimations,
  providers: [GalleryConfig, GalleryMiniStore, GalleryEventBusService, GalleryService],
  encapsulation: ViewEncapsulation.None,
})
export class GalleryComponent implements OnInit, AfterViewInit, OnDestroy {
  /*** Config begin ***/
  @Input() public images: string [];
  @Input() public defaultImage: string;
  @Input() public showControls: boolean;
  @Input() public animationType: string;
  @Input() public animationTransition: string;
  @Input() public listItemsAutoWidth: boolean;
  @Input() public listItemsMinWidth: string;
  @Input() public listItemsTransition: string;
  @Input() public listItemsTransitionType: string;
  @Input() public listItemsTransitionDelay: string;
  @Input() public listItemsTransitionSelector: string;
  /*** Config end ***/

  @ViewChild('mainImageWrapper', {static: true})
  private mainImageWrapper: ElementRef;
  @ViewChild('listWrapper', {static: true})
  private listWrapper: ElementRef;

  protected subscription: Subscription = new Subscription();

  public sortedImages: string [] = [];

  constructor(
    private gConfig: GalleryConfig,
    private galleryStore: GalleryMiniStore,
    private gEventBusService: GalleryEventBusService,
    private cdr: ChangeDetectorRef,
    private galleryService: GalleryService
  ) {
    Object.assign(this, gConfig);
  }

  ngOnInit(): void {
    const mainImage = this.defaultImage ? this.defaultImage : this.images[0];

    this.galleryStore.dispatch(
      GalleryActions.updateImageStateAction({
        src: mainImage
      })
    );

    this.sortedImages = this.galleryService.createSimpleList(this.images, mainImage);
    this.galleryStore.dispatch(
      GalleryActions.updateListItemsStylesStateAction({
        list: this.galleryService.createConfigList(mainImage, this.sortedImages)
      })
    );

    this.subscription.add(
      this.gEventBusService.on().subscribe((event) => {
        const {action, currentValue} = event;

        this.galleryStore.dispatch(
          GalleryActions.updateMovableHelperStateAction({
            relativeSide: action
          })
        );

        this.galleryStore.dispatch(
          GalleryActions.updateImageStateAction({
            src: currentValue
          })
        );

        this.galleryService.swapListItems(action, this.list);

        this.cdr.detectChanges();
        this.unattachedHelper();
      })
    );
  }

  ngAfterViewInit(): void {
    if (!this.mainImageWrapper) {
      throw new Error('Gallery "Image Wrapper" is not defined');
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private getList(): IGalleryListItemConfig [] {
    const {list} = this.galleryStore.get<IListState>('list');
    return list;
  }

  public get helperLeaveAnimationParams(): IHelperLeaveAnimationParams {
    const {relativeSide} = this.galleryStore.get<any>('movableHelper');
    return {
      value: '',
      params: {
        translateX: this.getLeaveBias(relativeSide) + '%',
        transition: this.animationTransition,
        transitionType: 'ease-in-out',
      }
    };
  }

  private getLeaveBias(relativeSide: string): number {
    switch (relativeSide) {
      case 'PREV':
        return 100;
      case 'NEXT':
        return -100;
      default:
        return 0;
    }
  }

  public getHelperSrc(): string {
    const {src} = this.galleryStore.get<IMovableHelperState>('movableHelper');
    return src;
  }

  public get list(): IGalleryListItemConfig [] {
    return this.getList();
  }

  public onListItemClick(event: string): void {
    const visualOrderOfItem = this.list.indexOf(this.list.find(item => item.imageUrl === event));
    const actionType = this.getActionTypeByIndex(visualOrderOfItem);
    if (!event || actionType === 'CENTERED') {
      return;
    }

    this.createAndAttachHelper();
    this.gEventBusService.emit({
      action: actionType,
      initiator: 'LIST_ITEM',
      previousValue: this.getMainItemUrl(),
      currentValue: event,
    });
  }

  public nextItem(): void {
    this.createAndAttachHelper();
    this.gEventBusService.emit({
      action: 'NEXT',
      initiator: 'CONTROLS_BUTTON',
      previousValue: this.getMainItemUrl(),
      currentValue: this.getUrl('NEXT'),
    });
  }

  public prevItem(): void {
    this.createAndAttachHelper();
    this.gEventBusService.emit({
      action: 'PREV',
      initiator: 'CONTROLS_BUTTON',
      previousValue: this.getMainItemUrl(),
      currentValue: this.getUrl('PREV'),
    });
  }

  private getActionTypeByIndex(index: number): string {
    const mean = arrayMean(this.list);
    switch (true) {
      case index < mean:
        return 'PREV';
      case index > mean:
        return 'NEXT';
      default:
        return 'CENTERED';
    }
  }

  private getNextItemUrl(): string {
    const nextIndex = this.list.indexOf(
      this.list.find(item => item.imageUrl === this.getHelperSrc())
    );

    return this.list[nextIndex + 1].imageUrl;
  }

  private getPrevItemUrl(): string {
    const prevIndex = this.list.indexOf(
      this.list.find(item => item.imageUrl === this.getHelperSrc())
    );

    return this.list[prevIndex - 1].imageUrl;
  }

  public getMainItemUrl(): string {
    const image = this.galleryStore.get<IMainImageState>('image');

    return image?.src || '';
  }

  public getMovableItemStyles() {
    const helper = this.galleryStore.get<IMovableHelperState>('movableHelper');
    return {
      transform: `translate(${helper?.position || 0}%, 0)`
    };
  }

  public pointerDown(event: PointerEvent): void {
    const {width, left} = this.getContainerRects(this.mainImageWrapper);
    const positionValue = Math.round((event.clientX - left) / width * 100);

    this.galleryStore.dispatch(
      GalleryActions.updateImageWrapperStateAction({
        touched: true
      })
    );

    this.galleryStore.dispatch(
      GalleryActions.updatePointerStateAction({
        position: positionValue,
        touchStartPosition: positionValue
      })
    );

    this.setHelperSrc();
  }

  @HostListener('window:pointerup', ['$event'])
  protected pointerUp(): void {
    this.galleryStore.dispatch(
      GalleryActions.updateImageWrapperStateAction({touched: false})
    );

    if (!this.isAttached()) {
      return;
    }

    const {relativeSide} = this.galleryStore.get<IMovableHelperState>('movableHelper');
    this.gEventBusService.emit({
      action: relativeSide,
      initiator: 'MOVE_ACTION',
      previousValue: this.getMainItemUrl(),
      currentValue: this.getUrl(relativeSide),
    });
  }

  @HostListener('window:pointermove', ['$event'])
  protected pointermove(event: PointerEvent): void {
    const helper = this.galleryStore.get<IMovableHelperState>('movableHelper');
    const wrapper = this.galleryStore.get<IImageWrapperState>('imageWrapper');
    const pointer = this.galleryStore.get<IPointerState>('pointer');

    if (!wrapper.touched) {
      return;
    }

    if (!helper.attached) {
      this.createAndAttachHelper();
    }

    const pointerPosition = this.getPointerPositionValue(
      event,
      this.getContainerRects(this.mainImageWrapper)
    );
    const relativeSide = this.defineActionByPointerPosition(pointerPosition, pointer.touchStartPosition);
    const helperPosition = pointerPosition - pointer.touchStartPosition;

    this.setHelperPosition(helperPosition);

    this.galleryStore.dispatch(
      GalleryActions.updatePointerStateAction({
        position: helperPosition,
      })
    );

    this.galleryStore.dispatch(
      GalleryActions.updateMovableHelperStateAction({
        relativeSide,
      })
    );

    this.galleryStore.dispatch(
      GalleryActions.updateImageStateAction({
        src: this.getUrl(relativeSide)
      })
    );
  }

  private getPointerPositionValue(event, container): number {
    return Math.round((event.clientX - container.left) / container.width * 100);
  }

  private defineActionByPointerPosition(currentPosition: number, startPosition: number): string {
    return currentPosition < startPosition ? 'NEXT' : 'PREV';
  }

  public getUrl(actionType?: string): string {
    switch (actionType) {
      case 'PREV':
        return this.getPrevItemUrl();
      case 'NEXT':
        return this.getNextItemUrl();
      default:
        return this.getMainItemUrl();
    }
  }

  private setHelperPosition(value: number): void {
    this.galleryStore.dispatch(GalleryActions.updateMovableHelperStateAction({
        position: value
      })
    );
  }

  public isAttached(): boolean {
    const helper = this.galleryStore.get<IMovableHelperState>('movableHelper');
    return helper?.attached ? helper.attached : false;
  }

  private attachHelper(): void {
    this.galleryStore.dispatch(
      GalleryActions.updateMovableHelperStateAction({attached: true})
    );
  }

  private unattachedHelper(): void {
    this.galleryStore.dispatch(
      GalleryActions.updateMovableHelperStateAction({attached: false})
    );
  }

  private getContainerRects(container: ElementRef) {
    return container.nativeElement.getBoundingClientRect();
  }

  public createAndAttachHelper() {
    this.setHelperSrc();
    this.attachHelper();
    this.setHelperPosition(0);
  }

  private setHelperSrc(): void {
    this.galleryStore.dispatch(
      GalleryActions.updateMovableHelperStateAction({
        src: this.getUrl()
      })
    );
  }
}

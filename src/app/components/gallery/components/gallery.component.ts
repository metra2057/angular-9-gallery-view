import {
  AfterViewInit, ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {
  IDynamicItemStyle,
  IImageState,
  IImageWrapperState,
  IListItemStyles,
  IListState,
  IMovableHelperState, IPointerState,
  ITransformStyles
} from '../gallery.models';
import { Subscription } from 'rxjs';
import {
  actualArrayLength,
  arrayLength,
  arrayMean,
  getArrayItemIndex,
  shuffleArrayLeft,
  shuffleArrayRight,
} from '../gallery.utils';
import { GalleryAnimations } from '../animations/gallery.animations';
import { GalleryConfig } from '../gallery.config';
import { GalleryMiniStore } from '../mini-store/gallery.store';
import { GalleryActions } from '../mini-store/gallery.actions';
import { GalleryEventBusService } from '../services/gallery-event-bus.service';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
  animations: GalleryAnimations,
  providers: [GalleryConfig, GalleryMiniStore, GalleryEventBusService],
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

  constructor(
    private gConfig: GalleryConfig,
    private gStore: GalleryMiniStore,
    private gEventBusService: GalleryEventBusService,
    private cdr: ChangeDetectorRef
  ) {
    Object.assign(this, gConfig);
  }

  ngOnInit(): void {
    this.gStore.dispatch(
      GalleryActions.updateImageStateAction({
        src: this.defaultImage ? this.defaultImage : this.images[0]
      })
    );

    const list = this.initList(this.images);

    this.gStore.dispatch(
      GalleryActions.updateListItemsStylesStateAction({
        list
      })
    );

    this.gStore.dispatch(
      GalleryActions.updateListItemsStylesStateAction({
        styles: this.initListItemsConfig(list)
      })
    );

    this.subscription.add(
      this.gEventBusService.on().subscribe((event) => {
        const {action, shuffleStep, currentValue} = event;
        this.gStore.dispatch(
          GalleryActions.updateMovableHelperStateAction({
            relativeSide: action
          })
        );

        this.gStore.dispatch(
          GalleryActions.updateImageStateAction({
            src: currentValue
          })
        );

        this.shuffleListItems(action, shuffleStep);

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

  @HostListener('window:resize')
  private onPageResize(): void {
    this.setListItemsWidth();
  }

  private getList(): string [] {
    const {list} = this.gStore.get<IListState>('list');
    return list || [];
  }

  public getListStyles(): IListItemStyles [] {
    const {styles} = this.gStore.get<IListState>('list');
    return styles || [];
  }

  public get dynamicAnimationParams() {
    const {relativeSide} = this.gStore.get<any>('movableHelper');
    return {
      value: '',
      params: {
        translateX: this.getLeaveBias(relativeSide) + '%',
        transition: this.animationTransition,
        transitionType: 'ease-in-out',
      }
    };
  }

  private getLeaveBias(relativeSide): number {
    switch (relativeSide) {
      case 'PREV':
        return 100;
      case 'NEXT':
        return -100;
      default:
        return 0;
    }
  }

  private shuffleListItems(actionType: string, count: number): void {
    const mean = arrayMean<string>(this.list);
    switch (actionType) {
      case 'NEXT':
        for (let i = 0; i < count - mean; i++) {
          const left = shuffleArrayLeft(this.getListStyles());
          this.gStore.dispatch(
            GalleryActions.updateListItemsStylesStateAction({
              styles: left
            })
          );
        }
        break;
      case 'PREV':
        for (let i = 0; i < mean - count; i++) {
          const right = shuffleArrayRight(this.getListStyles());
          this.gStore.dispatch(
            GalleryActions.updateListItemsStylesStateAction({
              styles: right
            })
          );
        }
        break;
    }
  }

  public getHelperSrc(): string {
    const {src} = this.gStore.get<IMovableHelperState>('movableHelper');
    return src;
  }

  private initList([...spread]: string []) {
    const mean = arrayMean<string>(spread);
    let sorted = spread;

    if (!sorted.includes(this.getMainItemUrl())) {
      sorted.splice(mean, 0, this.getMainItemUrl());
    }

    while (sorted[mean] !== this.getMainItemUrl()) {
      sorted = shuffleArrayRight(sorted);
    }

    return sorted;
  }

  public get list(): string [] {
    return this.getList();
  }

  public onListItemClick({url, index}): void {
    const actionType = this.getActionTypeByIndex(this.getListStyles()[index].index);

    if (actionType === 'CENTERED') {
      return;
    }

    this.createAndAttachHelper();
    this.gEventBusService.emit({
      action: actionType,
      initiator: 'LIST_ITEM',
      previousValue: this.getMainItemUrl(),
      currentValue: url,
      shuffleStep: this.getListStyles()[index].index
    });
  }

  public nextItem(): void {
    this.createAndAttachHelper();
    this.gEventBusService.emit({
      action: 'NEXT',
      initiator: 'CONTROLS_BUTTON',
      previousValue: this.getMainItemUrl(),
      currentValue: this.getUrl('NEXT'),
      shuffleStep: 3
    });
  }

  public prevItem(): void {
    this.createAndAttachHelper();
    this.gEventBusService.emit({
      action: 'PREV',
      initiator: 'CONTROLS_BUTTON',
      previousValue: this.getMainItemUrl(),
      currentValue: this.getUrl('PREV'),
      shuffleStep: 1
    });
  }

  private getActionTypeByIndex(index: number): string {
    const mean = arrayMean<string>(this.list);
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
    const next = getArrayItemIndex(this.list, this.getHelperSrc()) + 1;
    return this.list[
      next >= (actualArrayLength<string>(this.list)) + 1 ? 0 : next];
  }

  private getPrevItemUrl(): string {
    const prev = getArrayItemIndex(this.list, this.getHelperSrc()) - 1;
    return this.list[
      prev === -1 ? (actualArrayLength<string>(this.list)) : prev];
  }

  public getMainItemUrl(): string {
    const {src} = this.gStore.get<IImageState>('image');
    return src;
  }

  public getMovableItemStyles(): ITransformStyles {
    const {position} = this.gStore.get<IMovableHelperState>('movableHelper');
    return {transform: `translate(${position || 0}%, 0)`};
  }

  public pointerDown(event: PointerEvent): void {
    const {width, left} = this.getContainerRects(this.mainImageWrapper);
    const positionValue = Math.round((event.clientX - left) / width * 100);

    this.gStore.dispatch(
      GalleryActions.updateImageWrapperStateAction({
        touched: true
      })
    );

    this.gStore.dispatch(
      GalleryActions.updatePointerStateAction({
        position: positionValue,
        touchStartPosition: positionValue
      })
    );

    this.setHelperSrc();
  }

  @HostListener('window:pointerup', ['$event'])
  protected pointerUp(): void {
    this.gStore.dispatch(
      GalleryActions.updateImageWrapperStateAction({touched: false})
    );

    if (!this.isAttached()) {
      return;
    }

    const {relativeSide} = this.gStore.get<IMovableHelperState>('movableHelper');
    this.gEventBusService.emit({
      action: relativeSide,
      initiator: 'MOVE_ACTION',
      previousValue: this.getMainItemUrl(),
      currentValue: this.getUrl(relativeSide),
      shuffleStep: relativeSide === 'NEXT' ? 3 : 1
    });
  }

  @HostListener('window:pointermove', ['$event'])
  protected pointermove(event: PointerEvent): void {
    const helper = this.gStore.get<IMovableHelperState>('movableHelper');
    const wrapper = this.gStore.get<IImageWrapperState>('imageWrapper');
    const pointer = this.gStore.get<IPointerState>('pointer');

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

    this.gStore.dispatch(
      GalleryActions.updatePointerStateAction({
        position: helperPosition,
      })
    );

    this.gStore.dispatch(
      GalleryActions.updateMovableHelperStateAction({
        relativeSide,
      })
    );

    this.gStore.dispatch(
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
    this.gStore.dispatch(GalleryActions.updateMovableHelperStateAction({
        position: value
      })
    );
  }

  public isAttached(): boolean {
    const helper = this.gStore.get<IMovableHelperState>('movableHelper');
    return helper?.attached ? helper.attached : false;
  }

  private attachHelper(): void {
    this.gStore.dispatch(
      GalleryActions.updateMovableHelperStateAction({attached: true})
    );
  }

  private unattachedHelper(): void {
    this.gStore.dispatch(
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
    this.gStore.dispatch(
      GalleryActions.updateMovableHelperStateAction({
        src: this.getUrl()
      })
    );
  }

  private initListItemsConfig(array: string []): IListItemStyles [] {
    const mean = arrayMean<string>(array);
    const ln = arrayLength<string>(array);
    const dimensionValue = 56;
    const mapped = array.map((url, index) => {
      switch (true) {
        case index === mean:
          return {
            url,
            class: ['--center'],
            styles: this.getNewListItemStyles(
              0,
              ln,
              url
            ),
            index
          };
        case index < mean:
          return {
            url,
            class: ['--left'],
            styles: this.getNewListItemStyles(
              -(dimensionValue - (ln * ln) * index),
              index,
              url
            ),
            index
          };
        case index > mean:
          return {
            url,
            class: ['--right'],
            styles: this.getNewListItemStyles(
              dimensionValue - (ln * ln) * (actualArrayLength<string>(array) - index),
              ln - index,
              url
            ),
            index
          };
      }
    });

    return Object.assign([], mapped);
  }

  private getListWrapperWidth(): number {
    if (this.listWrapper) {
      return this.listWrapper.nativeElement.clientWidth;
    }

    return 0;
  }

  private getNewListItemStyles(position, zIndex: number, url?: string): IDynamicItemStyle {
    return {
      width: this.listItemsAutoWidth
        ? `${this.getListWrapperWidth() / arrayLength<string>(this.list)}px`
        : 'auto',
      minWidth: this.listItemsAutoWidth && this.listItemsMinWidth
        ? this.listItemsMinWidth
        : 'auto',
      transform: url === this.getMainItemUrl()
        ? `translateX(${position}%) scale(1.06)`
        : `translateX(${position}%)`,
      transition: `
        ${this.listItemsTransitionSelector}
        ${this.listItemsTransition}
        ${this.listItemsTransitionType}
      `,
      transitionDelay: this.listItemsTransitionDelay,
      zIndex,
    };
  }

  private setListItemsWidth(): void {
    const styles = this.getListStyles().map((item) => {
      return {
        ...item,
        styles: {
          ...item.styles,
          width: `${this.getListWrapperWidth() / arrayLength<string>(this.list)}px`
        }
      };
    });

    this.gStore.dispatch(
      GalleryActions.updateListItemsStylesStateAction({
        styles
      })
    );
  }
}

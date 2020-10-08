import { animate, animateChild, query, state, style, transition, trigger } from '@angular/animations';

export const GalleryAnimations = [
  trigger('leaveDraggableHelper', [
    transition(':leave', [
      animate('.3s linear',
        style({
          transform: 'translate3d({{translateX}}, 0, 0)'
        })
      )
    ])
  ]),
];

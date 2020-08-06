import { animate, style, transition, trigger } from '@angular/animations';

export const GalleryAnimations = [
  trigger('leaveHelper', [
    transition(':leave', [
      animate('{{transition}} {{transitionType}}',
        style({
          transform: 'translate3d({{translateX}}, 0, 0)'
        })
      )
    ])
  ])
];

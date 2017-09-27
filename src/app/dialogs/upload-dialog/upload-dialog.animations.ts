import { animate, state, style, transition, trigger } from '@angular/animations';

export const openDialog = trigger('openDialog', [
  state('void', style({transform: 'translateY(25%) scale(0.9)', opacity: 0})),
  state('enter', style({transform: 'translateY(0%) scale(1)', opacity: 1})),
  state('exit', style({transform: 'translateY(25%)', opacity: 0})),
  transition('* => *', animate('400ms cubic-bezier(0.25, 0.8, 0.25, 1)')),
]);

export const fadeInOut = trigger('fadeInOut', [
  state(':void', style({transform: 'translate3d(0, 0, 0)', opacity: 1, zIndex: 8})),
  transition(':enter', [
    style({transform: 'translate3d(0, -100%, 0)', opacity: 0, zIndex: -1}),
    animate(150)
  ]),
  transition(':leave', [
    animate(150, style({transform: 'translate3d(0, -100%, 0)', opacity: 0, zIndex: -1}))
  ])
]);

export const fadeOverlay = trigger('fadeOverlay', [
  state(':void', style({opacity: 1})),
  transition(':enter', [
    style({opacity: 0}),
    animate(150)
  ]),
  transition(':leave', [
    animate(150, style({ opacity: 0 }))
  ])
]);

export const slideUp = trigger('slideUp', [
  state('active', style({flex: 1})),
  state('inactive', style({flex: 'unset', maxHeight: '4px'})),
  transition('inactive <=> active', animate('100ms ease-out'))
]);

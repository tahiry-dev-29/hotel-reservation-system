import { Directive, HostListener, signal, WritableSignal } from '@angular/core';

@Directive({
  selector: '[appScrollHide]',
  standalone: true,
  exportAs: 'appScrollHide'
})
export class ScrollHide {
  visible: WritableSignal<boolean> = signal(true);

  private lastScrollY = 0;

  @HostListener('window:scroll') 
  onWindowScroll(): void {
    const currentScrollY = window.scrollY; 
    const scrollThreshold = 50;

    if (currentScrollY === 0) {
      this.visible.set(true);
    } 
    else if (currentScrollY > this.lastScrollY && currentScrollY > scrollThreshold) {
      this.visible.set(false);
    } 
    else if (currentScrollY < this.lastScrollY) {
      this.visible.set(true);
    }
    
    this.lastScrollY = currentScrollY;
  }
}
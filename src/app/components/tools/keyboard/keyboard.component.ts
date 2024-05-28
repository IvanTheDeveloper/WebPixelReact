import { Component, ElementRef, HostListener, Renderer2, ViewChild } from '@angular/core';

interface Arrow {
  lineX1: number;
  lineY1: number;
  lineX2: number;
  lineY2: number;
}

@Component({
  selector: 'app-keyboard',
  templateUrl: './keyboard.component.html',
  styleUrls: ['./keyboard.component.scss']
})
export class KeyboardComponent {
  list: string[] = []

  @ViewChild('svgElement', { static: false }) svgElement!: ElementRef
  arrows: Arrow[] = []

  constructor() { }

  @HostListener('window:resize')
  @HostListener('window:scroll')
  updateLinePositions(): void {
    this.arrows = []

    const originElements = document.querySelectorAll('[id^="origin"]');
    const targetElements = document.querySelectorAll('[id^="target"]');

    originElements.forEach((originElement, index) => {
      const targetId = originElement.id.replace('origin', 'target');
      const targetElement = document.getElementById(targetId);

      if (targetElement && this.svgElement) {
        const originRect = originElement.getBoundingClientRect();
        const targetRect = targetElement.getBoundingClientRect();
        const svgRect = this.svgElement.nativeElement.getBoundingClientRect();

        const arrow: Arrow = {
          lineX1: originRect.left + originRect.width / 2 - svgRect.left,
          lineY1: originRect.top + originRect.height / 2 - svgRect.top,
          lineX2: targetRect.left + targetRect.width / 2 - svgRect.left,
          lineY2: targetRect.top + targetRect.height / 2 - svgRect.top + 10,
        }

        this.arrows.push(arrow)
      }
    })
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    const key = event.keyCode == 32 ? 'space' : event.key.toLowerCase()
    //alert(key)
    if (!this.list.includes(key)) {
      this.list.push(key)
    }
  }

  @HostListener('document:keyup', ['$event'])
  handleKeyupEvent(event: KeyboardEvent) {
    const key = event.keyCode == 32 ? 'space' : event.key.toLowerCase()
    this.list = this.list.filter(k => k != key)
  }

  isKeyActive(key: string): boolean {
    key = key.toLowerCase()
    return this.list.includes(key)
  }

}

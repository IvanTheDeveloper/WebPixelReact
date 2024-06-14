import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-easter-egg',
  templateUrl: './easter-egg.component.html',
  styleUrls: ['./easter-egg.component.scss']
})
export class EasterEggComponent {
  konamiCode: string[] = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
  codeIndex: number = 0
  video = false

  constructor() { }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.code === this.konamiCode[this.codeIndex]) {
      this.codeIndex++;
      if (this.codeIndex === this.konamiCode.length) {
        this.codeIndex = 0;
        this.easterEgg();
      }
    } else {
      this.codeIndex = 0;
    }
  }

  async easterEgg() {
    this.video = true
    await new Promise(f => setTimeout(f, 4 * 1000))
    this.video = false
  }

}
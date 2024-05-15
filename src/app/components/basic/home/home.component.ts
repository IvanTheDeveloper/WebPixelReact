import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  constructor() { }

  @HostListener("window:scroll", [])
  onScroll() {
    const scrollTop = window.scrollY;
    const down = document.getElementById("down");
    if (down) {
      down.style.transform = "translateY(" + scrollTop / 1.2 + "px)";
    }
    const up = document.getElementById("up");
    if (up) {
      up.style.transform = "translateY(" + scrollTop / -1.2 + "px)";
    }
    const left = document.getElementById("left");
    if (left) {
      left.style.transform = "translateX(" + scrollTop / 0.8 + "px)";
    }
    const right = document.getElementById("right");
    if (right) {
      right.style.transform = "translateX(" + scrollTop / -0.8 + "px)";
    }
  }

}
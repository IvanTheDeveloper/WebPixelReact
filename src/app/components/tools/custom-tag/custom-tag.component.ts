import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-custom-tag',
  templateUrl: './custom-tag.component.html',
  styleUrls: ['./custom-tag.component.scss']
})
export class CustomTagComponent {
  @Input() input!: string

  constructor() { }

  ngOnInit() {
    console.log(this.input)
  }

}

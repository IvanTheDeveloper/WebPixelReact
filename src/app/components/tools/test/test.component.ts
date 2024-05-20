import { Component } from '@angular/core';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent {

  constructor() { }

  test() {
    let a: any = 1 //true
    let i = Infinity

    console.log(
      a === 'true',
      a == 'true',
      a === 'false',
      a == 'false',
      a === true,
      a == true,
      a === false,
      a == false,
      a === '1',
      a == '1',
      a === '0',
      a == '0',
      a === 1,
      a == 1,
      a === 0,
      a == 0,
    )
  }

}
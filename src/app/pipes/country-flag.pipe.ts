import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'countryFlag'
})
export class CountryFlagPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}

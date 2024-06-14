import { Injectable } from '@angular/core';
import { devModeEnabled } from '../others/globalProperties';

@Injectable({
  providedIn: 'root'
})
export class DevModeService {
  public devModeEnabled: boolean = devModeEnabled;

  constructor() { }

  toggle() {
    this.devModeEnabled = !this.devModeEnabled;
  }

}

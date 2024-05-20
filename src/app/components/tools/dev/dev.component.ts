import { HttpClient } from '@angular/common/http';
import { Component, HostListener } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { map } from 'rxjs';

@Component({
  selector: 'app-dev',
  templateUrl: './dev.component.html',
  styleUrls: ['./dev.component.scss']
})
export class DevComponent {
  screenResolution = ''
  browserWindowSize = ''
  pageContentSize = ''

  ipAddress = ''
  languages = ''
  device = ''

  url = ''
  ping = ''
  memory = ''
  fps: number = 0
  private lastFrameTime: number = 0
  private frameCount: number = 0

  constructor(private router: Router, private http: HttpClient) { }

  ngOnInit() {
    this.lastFrameTime = performance.now();
    this.updateFps()
    this.getMemory()
    this.getSettings()
    this.url = location.href
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.url = location.href
      }
    });
    this.getIPAddress()
    this.languages = navigator.languages.toString()
    this.device = navigator.userAgent
    setInterval(() => {
      this.getPingTime().subscribe(time => {
        this.ping = time + ' ms'
      })
    }, 1000)
  }

  getMemory() {
    navigator.storage.estimate().then((result) => {
      if (result.usage) {
        this.memory = (result.usage! / (1024 * 1024)).toFixed(2) + ' mb'
      }
    })
  }

  updateFps() {
    const currentTime = performance.now();
    const elapsed = currentTime - this.lastFrameTime;
    this.frameCount++;
    if (elapsed >= 1000) {
      this.fps = Math.round((this.frameCount * 1000) / elapsed);
      this.frameCount = 0;
      this.lastFrameTime = currentTime;
    }
    requestAnimationFrame(() => this.updateFps())
  }

  getPingTime() {
    const startTime = Date.now()
    return this.http.get('https://rest.ensembl.org/info/ping?content-type=application/json', { observe: 'response' }).pipe(
      map(response => Date.now() - startTime)
    )
  }

  getIPAddress() {
    this.http.get('https://api.ipify.org?format=json').subscribe((result: any) => {
      this.ipAddress = result.ip
    })
  }

  @HostListener('window:resize')
  getSettings() {
    this.screenResolution = this.calculateResolution(window.screen.width, window.screen.height)
    this.browserWindowSize = this.calculateResolution(window.innerWidth, window.innerHeight)
    this.pageContentSize = this.calculateResolution(window.outerWidth, window.outerHeight)
  }

  calculateResolution(width: number, height: number) {
    const gcd = this.getGreatestCommonDivisor(width, height)
    return `${width} x ${height} px (${width / gcd}:${height / gcd})`
  }

  getGreatestCommonDivisor(a: number, b: number) {
    while (b != 0) {
      const temp = b
      b = a % b
      a = temp
    }
    return a
  }

}
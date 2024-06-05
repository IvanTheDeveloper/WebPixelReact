import { Component } from '@angular/core';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent {

  async ngOnInit() {
    for (let index = 0; index < 1; index++) {
      await this.openPopupWithDelay(`assets/images/popups/${index}.jpg`);
    }
  }

  async openPopupWithDelay(imageUrl: string) {
    return new Promise<void>((resolve) => {
      const img = new Image();
      img.src = imageUrl;

      img.onload = () => {
        const popupWidth = img.width * 0.72 / 2;
        const popupHeight = img.height / 2;

        const left = Math.random() * (screen.width - popupWidth);
        const top = Math.random() * (screen.height - popupHeight);

        const popup = window.open('', '_blank', `width=${popupWidth},height=${popupHeight},top=${top},left=${left}`);
        if (popup) {
          popup.document.write(`
            <html>
              <head>
                <title>Image Popup</title>
                <style>
                  body {
                    margin: 0;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100%;
                    background-color: #f0f0f0;
                  }
                  img {
                    max-width: 100%;
                    max-height: 100%;
                  }
                </style>
              </head>
              <body>
                <img src="${imageUrl}">
              </body>
            </html>
          `);
          popup.document.close();

          popup.onbeforeunload = () => {
            resolve();
          };
        } else {
          alert('Popup blocked. Please allow popups for this website.');
          resolve(); // Resolve even if the popup is blocked, to avoid getting stuck.
        }
      };

      img.onerror = () => {
        alert('Failed to load image. Please check the URL.');
        resolve(); // Resolve if there is an error loading the image.
      };
    });
  }

}

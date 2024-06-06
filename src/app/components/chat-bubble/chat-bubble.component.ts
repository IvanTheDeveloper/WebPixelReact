import { Component } from '@angular/core';

declare global {
  interface Window {
    DeadSimpleChat: any;
  }
}

@Component({
  selector: 'app-chat-bubble',
  templateUrl: './chat-bubble.component.html',
  styleUrls: ['./chat-bubble.component.scss']
})
export class ChatBubbleComponent {
  placeholderImg = 'assets/images/support.svg'

  ngOnInit() {
    this.loadChatScript()
  }

  loadChatScript() {
    const script = document.createElement('script')
    script.src = 'https://deadsimplechat.com/js/embed.js'
    script.type = 'text/javascript'
    script.onload = () => {
      window.DeadSimpleChat.initBubble({
        location: 'https://deadsimplechat.com',
        size: 'small',
        roomId: 'WV0G5iC-a',
        open: 'true'
      })
    }
    document.body.appendChild(script)
  }

}
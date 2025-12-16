import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [NgFor, NgIf],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  secret: number[] = [];
  msg: string[] = [];
  result: number[] = [];

  @ViewChild('logRef') logRef!: ElementRef<HTMLElement>;

  ngOnInit(): void {
    this.generateSecret();
  }

  private scrollToBottom() {
    // espera o Angular renderizar o novo <li>
    setTimeout(() => {
      const el = this.logRef?.nativeElement;
      if (!el) return;
      el.scrollTop = el.scrollHeight;
    });
  }

  private addMsg(text: string) {
    this.msg.push(text);
    this.scrollToBottom();
  }

  verifyResult(val: number) {
    const current = this.secret[0];

    if (val === current) {
      this.addMsg('✅ ACERTOU !!!');
      this.result.push(val);
      this.secret.shift();
      this.verifyEndGame();
      return;
    }

    if (val < current) {
      this.addMsg(`🔼 É MAIOR que: ${val}`);
      return;
    }

    this.addMsg(`🔽 É MENOR que: ${val}`);
  }

  generateSecret() {
    const pool = [...this.numbers];
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    this.secret = pool.slice(0, 4);
  }


  verifyEndGame() {
    if (this.result.length == 4) {
      this.openWinModal();

    }
  }


  //modal
  showWinModal = false;
  openWinModal() { this.showWinModal = true; }
  closeWinModal() { this.showWinModal = false; }

  restartGame() {
    this.closeWinModal();
    this.msg = [];
    this.result = [];
    this.generateSecret();
  }


}

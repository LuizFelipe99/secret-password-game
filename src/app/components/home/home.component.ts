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

  // agora result começa mascarado e vai revelando
  result: (number | '*')[] = ['*', '*', '*', '*'];

  get resultText(): string {
  return this.result.join('');
}

  @ViewChild('logRef') logRef!: ElementRef<HTMLElement>;

  ngOnInit(): void {
    this.startGame();
  }

  private startGame() {
    this.msg = [];
    this.result = ['*', '*', '*', '*'];
    this.generateSecret();
  }

  private scrollToBottom() {
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

      // posição que estamos acertando (0..3)
      // antes do shift: se secret.length=4 -> pos=0; se 3 -> pos=1; etc.
      const pos = 4 - this.secret.length;

      this.result[pos] = val; // revela o número no lugar do '*'
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
    // terminou quando não existir mais '*'
    if (!this.result.includes('*')) {
      this.openWinModal();
    }
  }

  // modal
  showWinModal = false;
  openWinModal() { this.showWinModal = true; }
  closeWinModal() { this.showWinModal = false; }

  restartGame() {
    this.closeWinModal();
    this.startGame();
  }
}

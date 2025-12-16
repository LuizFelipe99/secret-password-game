import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [NgFor, NgIf],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  secret: number[] = [];
  msg: string[] = [];
  result: (number | '*')[] = ['*', '*', '*', '*'];
  timeLeft: number = 60; // 1 minuto em segundos
  timer: any;
  showWinModal = false;
  isGameOverBlockBtn = false;
  showBtnRestart = false;

  @ViewChild('logRef') logRef!: ElementRef<HTMLElement>;

  // Variável resultText para exibir a senha
  get resultText(): string {
    return this.result.join('');
  }

  ngOnInit(): void {
    this.startGame();
    this.startTimer(); // Começa o timer ao iniciar o jogo
  }

  private startTimer() {
    // Utiliza o método setInterval corretamente para decrementar 1 segundo a cada 1 segundo
    this.timer = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--; // Decrementa o tempo restante
      } else {
        clearInterval(this.timer); // Para o timer quando o tempo acabar
        this.endGame(); // Chama a função de término do jogo
      }
    }, 1000); // Atualiza a cada 1 segundo
  }

  private endGame() {
    this.isGameOverBlockBtn = true;
    this.showBtnRestart = true;
     if (this.msg.indexOf('⏰ O tempo acabou!') === -1) { // Verifica se a mensagem já foi adicionada
      this.addMsg('⏰ O tempo acabou!');
    }
    this.verifyEndGame();
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
      const pos = 4 - this.secret.length;
      this.result[pos] = val;
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
    if (!this.result.includes('*')) {
      this.openWinModal();
      this.showBtnRestart = true;
    }
  }

  openWinModal() { this.showWinModal = true; }
  closeWinModal() { this.showWinModal = false; }

  restartGame() {
    this.closeWinModal();
    this.startGame();
    this.timeLeft = 60; // Reseta o tempo
    this.startTimer(); // Reinicia o timer
    this.isGameOverBlockBtn = false;
    this.showBtnRestart = false;
  }
}

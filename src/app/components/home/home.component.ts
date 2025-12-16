import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [NgFor],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  numbers = [1,2,3,4,5,6,7,8,9];
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
}

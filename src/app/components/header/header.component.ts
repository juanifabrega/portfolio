import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-header',
  imports: [
    CommonModule,
    TranslocoModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {

  activeLang!: string;

  constructor(public transloco: TranslocoService) {}

  ngOnInit(): void {
    this.activeLang = this.transloco.getActiveLang();
  }

  changeLang(lang: string): void {
    this.transloco.setActiveLang(lang);
    this.activeLang = lang;
  }
}

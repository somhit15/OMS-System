import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule],
  template: `
    <div style="padding: 20px; background: #eee;">
      <h1>OMS Portal - Test Header</h1>
      <nav>
        <a routerLink="/login">Login</a>
      </nav>
      <hr>
      <router-outlet></router-outlet>
    </div>
  `,
  styles: []
})
export class App {}

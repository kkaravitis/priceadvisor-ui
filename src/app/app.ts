import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatSlideToggleModule, MatTableModule, MatCardModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected title = 'priceadvisor-ui';
  isDarkMode = false;

  toggleTheme() {
      this.isDarkMode = !this.isDarkMode;
    }

}

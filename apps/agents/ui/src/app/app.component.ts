import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ChatLandingComponent } from '@idl/ngx/chat';
import { ThemeService } from '@idl/ngx/theme';

@Component({
  imports: [ChatLandingComponent, RouterModule],
  selector: 'agents-ui-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
})
export class AppComponent implements OnInit {
  protected title = 'agents-ui';

  private readonly themeService = inject(ThemeService);

  ngOnInit(): void {
    // Initialize theme from localStorage or system preference
    this.themeService.initialize();
  }
}

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';

import { ChatContentComponent } from '../chat-content/chat-content.component';
import { ChatHeaderComponent } from '../chat-header/chat-header.component';
import { ChatSidebarComponent } from '../chat-sidebar/chat-sidebar.component';

/**
 * Main landing component for the chat interface.
 * Contains the header, sidebar, and content areas.
 */
@Component({
  selector: 'ngx-chat-landing',
  imports: [
    CommonModule,
    MatSidenavModule,
    ChatHeaderComponent,
    ChatSidebarComponent,
    ChatContentComponent,
  ],
  templateUrl: './chat-landing.component.html',
  styleUrl: './chat-landing.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ChatLandingComponent {}

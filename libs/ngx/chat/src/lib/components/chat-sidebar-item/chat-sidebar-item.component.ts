import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { ChatSession } from '@idl/types/chat';

/**
 * Presentational list item for a single chat session in the sidebar.
 */
@Component({
  selector: 'ngx-chat-sidebar-item',
  imports: [CommonModule, MatListModule, MatButtonModule, MatIconModule],
  templateUrl: './chat-sidebar-item.component.html',
  styleUrl: './chat-sidebar-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ChatSidebarItemComponent {
  /**
   * Whether this item is the currently selected session
   */
  readonly selected = input<boolean>(false);

  /**
   * The chat session to display
   */
  readonly session = input.required<ChatSession>();

  /**
   * Emits the session ID when the delete button is clicked
   */
  readonly sessionDeleted = output<string>();

  /**
   * Emits the session ID when the item is clicked
   */
  readonly sessionSelected = output<string>();

  /**
   * Handle a click on the delete button, without triggering selection
   */
  protected onDelete(event: Event): void {
    event.stopPropagation();
    this.sessionDeleted.emit(this.session().id);
  }

  /**
   * Handle a click on the item
   */
  protected onSelect(): void {
    this.sessionSelected.emit(this.session().id);
  }
}

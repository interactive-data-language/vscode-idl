import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { TodoItem } from '@idl/types/chat';

/**
 * Material icon and color to display for each to-do status
 */
const STATUS_ICON: Record<TodoItem['status'], { color: string; icon: string }> =
  {
    pending: { icon: 'radio_button_unchecked', color: '' },
    'in-progress': { icon: 'pending', color: 'accent' },
    done: { icon: 'check_circle', color: 'primary' },
    skipped: { icon: 'cancel', color: '' },
  };

/**
 * Collapsible panel that displays the LLM's current to-do list for a session.
 */
@Component({
  selector: 'ngx-chat-todo-list',
  imports: [CommonModule, MatExpansionModule, MatIconModule],
  templateUrl: './chat-todo-list.component.html',
  styleUrl: './chat-todo-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ChatTodoListComponent {
  readonly todos = input.required<TodoItem[]>();

  protected readonly panelTitle = computed(() => {
    const items = this.todos();
    const done = items.filter((t) => t.status === 'done').length;
    return `Task list (${done}/${items.length})`;
  });

  protected colorFor(status: TodoItem['status']): string {
    return STATUS_ICON[status].color;
  }

  protected iconFor(status: TodoItem['status']): string {
    return STATUS_ICON[status].icon;
  }
}

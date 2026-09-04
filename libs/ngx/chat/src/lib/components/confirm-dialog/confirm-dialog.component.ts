import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';

/**
 * Data passed into the confirmation dialog
 */
export interface ConfirmDialogData {
  /**
   * Message shown in the dialog body
   */
  message?: string;

  /**
   * Title shown at the top of the dialog
   */
  title: string;
}

/**
 * Generic blocking confirmation dialog
 *
 * Closes with `true` when confirmed and `false` when cancelled
 */
@Component({
  selector: 'ngx-chat-confirm-dialog',
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ConfirmDialogComponent {
  protected readonly data = inject<ConfirmDialogData>(MAT_DIALOG_DATA);

  /**
   * Message shown in the dialog body, falls back to a generic warning
   */
  protected readonly message =
    this.data.message ?? 'This action cannot be undone.';

  private readonly dialogRef =
    inject<MatDialogRef<ConfirmDialogComponent, boolean>>(MatDialogRef);

  /**
   * Cancel and close the dialog without confirming
   */
  protected cancel(): void {
    this.dialogRef.close(false);
  }

  /**
   * Confirm and close the dialog
   */
  protected confirm(): void {
    this.dialogRef.close(true);
  }
}

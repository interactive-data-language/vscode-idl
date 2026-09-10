import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatStepperModule } from '@angular/material/stepper';
import { AoiMapComponent } from '@idl/ngx/map';
import type { AgentWorkflowTemplate } from '@idl/types/workflow-templates';
import type { Feature, Polygon } from 'geojson';

import { ComposeWorkflowMessage } from '../../helpers/compose-workflow-message';
import { FuzzyMatchScore } from '../../helpers/fuzzy-match';
import { WorkflowTemplatesApiService } from '../../services/workflow-templates-api.service';

/**
 * Full-screen dialog that walks a user through selecting an Agent Workflow
 * Template, specifying an AOI, adding notes, and starting the workflow.
 *
 * Closes with the composed message string to send to the chat pipeline, or
 * `undefined` if cancelled.
 */
@Component({
  selector: 'ngx-workflow-template-dialog',
  imports: [
    CommonModule,
    MatAutocompleteModule,
    MatDialogModule,
    MatStepperModule,
    MatButtonModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    AoiMapComponent,
  ],
  templateUrl: './workflow-template-dialog.component.html',
  styleUrl: './workflow-template-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class WorkflowTemplateDialogComponent implements OnInit {
  /**
   * Currently drawn AOI polygon, if any
   */
  protected readonly aoi = signal<Feature<Polygon> | undefined>(undefined);

  /**
   * Currently selected Agent Workflow Template
   */
  protected readonly selectedTemplate = signal<
    AgentWorkflowTemplate | undefined
  >(undefined);

  /**
   * Whether a template has been selected, used to gate advancing past step 1
   */
  protected readonly canAdvanceFromTemplateStep = computed(
    () => this.selectedTemplate() !== undefined,
  );

  /**
   * User-entered notes/considerations
   */
  protected readonly notes = signal('');

  /**
   * Preview of the composed prompt message sent to the LLM
   */
  protected readonly composedMessagePreview = computed(() => {
    const template = this.selectedTemplate();
    if (!template) {
      return '';
    }
    return ComposeWorkflowMessage(template, this.aoi(), this.notes());
  });

  /**
   * Current text typed into the template search field
   */
  protected readonly searchText = signal('');

  /**
   * Available Agent Workflow Templates
   */
  protected readonly templates = signal<AgentWorkflowTemplate[]>([]);

  /**
   * Templates matching the current search text, ranked by fuzzy match score
   */
  protected readonly filteredTemplates = computed(() => {
    const query = this.searchText();
    const templates = this.templates();

    if (!query.trim()) {
      return templates;
    }

    return templates
      .map((template) => ({
        template,
        score: FuzzyMatchScore(
          query,
          `${template.name} ${template.description} ${template.tags.join(' ')}`,
        ),
      }))
      .filter(
        (entry): entry is { template: AgentWorkflowTemplate; score: number } =>
          entry.score !== undefined,
      )
      .sort((a, b) => b.score - a.score)
      .map((entry) => entry.template);
  });

  /**
   * Whether the templates are still loading
   */
  protected readonly loading = signal(true);

  private readonly api = inject(WorkflowTemplatesApiService);

  private readonly dialogRef =
    inject<MatDialogRef<WorkflowTemplateDialogComponent, string>>(MatDialogRef);

  ngOnInit(): void {
    this.api.listTemplates().subscribe((templates) => {
      this.templates.set(templates);
      this.loading.set(false);
    });
  }

  /**
   * Close the dialog without starting a workflow
   */
  protected cancel(): void {
    this.dialogRef.close();
  }

  /**
   * Update the drawn AOI polygon
   */
  protected onAoiChange(aoi: Feature<Polygon> | undefined): void {
    this.aoi.set(aoi);
  }

  /**
   * Select a template from the autocomplete dropdown
   */
  protected selectTemplate(event: MatAutocompleteSelectedEvent): void {
    const id = event.option.value as string;
    const template = this.templates().find((t) => t.id === id);

    this.selectedTemplate.set(template);
    this.searchText.set(template?.name ?? '');
  }

  /**
   * Compose the final message and close the dialog with it
   */
  protected submit(): void {
    const template = this.selectedTemplate();
    if (!template) {
      return;
    }

    this.dialogRef.close(
      ComposeWorkflowMessage(template, this.aoi(), this.notes()),
    );
  }

  /**
   * Update notes from the textarea
   */
  protected updateNotes(value: string): void {
    this.notes.set(value);
  }

  /**
   * Update the search text as the user types, clearing the selection until
   * they pick a new option from the dropdown
   */
  protected updateSearch(value: string): void {
    this.searchText.set(value);
    this.selectedTemplate.set(undefined);
  }
}

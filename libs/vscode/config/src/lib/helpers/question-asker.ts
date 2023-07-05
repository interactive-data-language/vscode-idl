import { IDL_TRANSLATION } from '@idl/translation';
import * as vscode from 'vscode';

/**
 * When querying user, messages that we ask for
 */
export const QUESTION_OPTIONS: vscode.MessageItem[] = [
  { title: IDL_TRANSLATION.notifications.yes },
  { title: IDL_TRANSLATION.notifications.no },
  { title: IDL_TRANSLATION.notifications.dontAsk },
];

/**
 * When querying user, messages that we ask for
 */
const BASIC_QUESTION_OPTIONS: vscode.MessageItem[] = [
  { title: IDL_TRANSLATION.notifications.yes },
  { title: IDL_TRANSLATION.notifications.no },
];

/**
 * Prompts a user to do something
 *
 * @param title Title to display in the window
 * @param configKey Config key that we update if don't ask again was
 *   specified
 * @param global Indicate if global settings scope or local for dont ask config
 * @param onSuccess Callback when a user says yes
 */
export async function QuestionAsker(
  title: string,
  configKey: string,
  global: boolean,
  onDontAsk: () => void,
  onSuccess: () => void
) {
  try {
    const resp = await vscode.window.showInformationMessage(
      title,
      ...QUESTION_OPTIONS
    );

    // handle dialog closed with "x"
    if (resp === undefined) {
      return;
    }

    // otherwise check user response
    switch (resp.title) {
      case IDL_TRANSLATION.notifications.yes:
        await onSuccess();
        break;
      case IDL_TRANSLATION.notifications.dontAsk:
        await onDontAsk();
        break;
      default:
        break;
    }
  } catch (err) {
    // ignore messages where vscode is closed while the dialog is open
    if (err?.message === 'Canceled') {
      return;
    }
    console.error(err);
  }
}

/**
 * Simple question asker that will ask a user yes/no
 *
 * @param title Title to display in the window
 * @param onSuccess Callback when a user says yes
 */
export async function BasicQuestionAsker(title: string, onSuccess: () => void) {
  try {
    const resp = await vscode.window.showInformationMessage(
      title,
      ...BASIC_QUESTION_OPTIONS
    );

    // handle dialog closed with "x"
    if (resp === undefined) {
      return;
    }

    // otherwise check user response
    switch (resp.title) {
      case IDL_TRANSLATION.notifications.yes:
        await onSuccess();
        break;
      default:
        break;
    }
  } catch (err) {
    // ignore messages where vscode is closed while the dialog is open
    if (err?.message === 'Canceled') {
      return;
    }
    console.error(err);
  }
}

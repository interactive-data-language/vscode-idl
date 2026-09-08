# IDL WebView

> See [here](https://code.visualstudio.com/blogs/2021/10/11/webview-ui-toolkit) and [here](https://github.com/microsoft/vscode-webview-ui-toolkit-samples/tree/main/frameworks/hello-world-angular) for the UI components that should be used (whenever possible) in the webview

This is a single-page Angular application which has limited functionality. It is primarily included, and configured, as an extension point to add custom UI components that are beyond what VS Code supports.

Important notes:

- Has default view when not viewing anything
- Used for profiling
- Uses the translation files that the `i18n` app creates in the **dist** folder.
- Paired with the `webview` lib to integrate with VS Code

## Tricks

To use the webview components, you need to update the module definition files to have `schemas` present:

```typescript
@NgModule({
  declarations: [ProfilerComponent],
  imports: [CommonModule, TranslocoModule, MaterialModule],
  exports: [ProfilerComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ProfilerModule {}
```

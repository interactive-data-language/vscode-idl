import { EscapeHtml } from './escape';

/**
 * Makes the HTML for nicely formatted text in our cell outputs
 */
export function CreateOutputText(
  idx: number,
  content: string,
  style: 'text' | 'image'
) {
  if (style === 'text') {
    const string = `
<table border="0">
<tr style="display: flex;">
<td style="width: 20px;padding-top: 20px;color: #a8a8a8;">[${idx}]:</td>
<td style="flex-grow: 1;"><pre><code>${EscapeHtml(
      content
    )}</code></pre></td></tr>
</table>
    `;

    return string;
  } else {
    const string = `
<table border="0">
<tr>
<td style="width: 20px;padding-top: 20px;color: #a8a8a8;">[${idx}]:</td>
<td style="vertical-align:top;"><image src="data:image/png;base64,${content}"></td></tr>
</table>
    `;

    return string;
  }
}

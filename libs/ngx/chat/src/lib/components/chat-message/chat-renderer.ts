import { Parser } from 'marked';
import { MarkedOptions, MarkedRenderer } from 'ngx-markdown';

// function that returns `MarkedOptions` with renderer override
export function chatMarkdownFactory(): MarkedOptions {
  const renderer = new MarkedRenderer();

  renderer.link = ({ href, title, tokens }) => {
    return `<a class="chat-link" target="_blank" href="${href}">${Parser.parse(tokens)}</a>`;
  };

  return {
    renderer: renderer,
    gfm: true,
    breaks: false,
    pedantic: false,
  };
}

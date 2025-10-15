export interface IParsedHTML {
  attributes?: { key: string; value: string }[];
  children?: IParsedHTML[];
  content?: string;
  tagName?: string;
  type: string;
}

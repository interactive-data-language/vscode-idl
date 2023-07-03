export interface IParsedHTML {
  type: string;
  tagName?: string;
  children?: IParsedHTML[];
  attributes?: { key: string; value: string }[];
  content?: string;
}

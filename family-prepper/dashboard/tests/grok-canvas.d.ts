declare module "grok/canvas" {
  export const Callout: any, Checklist: any, Grid: any, LineChart: any, LinkCards: any, Page: any, Properties: any,
    Rows: any, Section: any, Status: any, Steps: any, Table: any, TableOfContents: any, Text: any;
  export function Segmented<T>(p: any): any;
  export function useGrokTheme(): any;
  export function useState<T>(v: T): [T, (v: T) => void];
  export type GrokTheme = any; export type ReactNode = any; export type StatusTone = any; export type TableCell = any;
  export type TableOfContentsItem = { label: string; id: string };
  export type Row = { title: string; detail?: string; meta?: string; status?: any; [k: string]: any };
}
declare namespace JSX { interface IntrinsicElements { [k: string]: any } type Element = any; }

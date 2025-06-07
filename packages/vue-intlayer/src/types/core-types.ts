// Core types for the intlayer system

export enum NodeType {
  Translation = 'Translation',
  Markdown = 'Markdown',
}

export type KeyPath = (string | number)[];

export interface Dictionary {
  [key: string]: unknown;
}

export interface MarkdownContent {
  nodeType: NodeType.Markdown;
  content: string;
  metadata?: Record<string, unknown>;
}

export interface Plugins {
  id: string;
  canHandle: (node: unknown) => boolean;
  transform: (node: unknown, context: unknown) => unknown;
}

export type DeepTransformContent<T> = T extends object
  ? { [K in keyof T]: DeepTransformContent<T[K]> }
  : T;

export interface IInterpreterPluginState {
  vueNode: boolean;
  intlayerNode: boolean;
  markdown: boolean;
}

export function getMarkdownMetadata(_content: string): Record<string, unknown> {
  return {};
}

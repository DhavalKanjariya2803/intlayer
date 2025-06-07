// This file provides type extensions for @intlayer/core

// Import our core types
import * as CoreTypes from './core-types';

// Augment the @intlayer/core module
declare module '@intlayer/core' {
  // Re-export all the types using interface/type merging
  export interface Dictionary extends CoreTypes.Dictionary {}
  export const enum NodeType {
    Translation = 'Translation',
    Markdown = 'Markdown',
  }
  export type KeyPath = CoreTypes.KeyPath;
  export interface MarkdownContent extends CoreTypes.MarkdownContent {}
  export interface Plugins extends CoreTypes.Plugins {}
  export type DeepTransformContent<T> = CoreTypes.DeepTransformContent<T>;
  export interface IInterpreterPluginState
    extends CoreTypes.IInterpreterPluginState {}
  export const getMarkdownMetadata: typeof CoreTypes.getMarkdownMetadata;
}

// Re-export everything from core-types
export * from './core-types';

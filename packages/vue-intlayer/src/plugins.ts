import { h, type Component, type VNode } from 'vue';

// Import types from our core types
import { ContentSelector } from './editor/ContentSelector';
import { EditedContentRenderer } from './editor/useEditedContentRenderer';
import { MarkdownRenderer } from './markdown/MarkdownRenderer';
import type { IInterpreterPluginState as CoreIInterpreterPluginState } from './types/core-types';
import * as CoreTypes from './types/core-types';
import { renderVueElement } from './vueElement/renderVueElement';

// Re-export types for backward compatibility
export type { Dictionary, KeyPath, MarkdownContent } from './types/core-types';

// Export NodeType as a value and type
export const NodeType = CoreTypes.NodeType;
export type NodeType = CoreTypes.NodeType;

// Export getMarkdownMetadata
export const getMarkdownMetadata = CoreTypes.getMarkdownMetadata;

// Define the Plugins type to avoid conflicts
export interface Plugins {
  id: string;
  canHandle: (node: unknown) => boolean;
  transform: (node: unknown, context: unknown) => unknown;
}

// Type aliases for backward compatibility
type IInterpreterPluginStateCore = CoreTypes.IInterpreterPluginState;

// Define the DeepTransformContent type with a single generic parameter for consistency with the rest of the codebase
export type DeepTransformContent<T> = T extends object
  ? { [K in keyof T]: DeepTransformContent<T[K]> }
  : T;

// Export a helper type for plugin state
export type PluginState = IInterpreterPluginState;

export interface IntlayerNodeProps<T = unknown> {
  value: T;
  keyPath: CoreTypes.KeyPath;
  locale: string;
  children?: VNode | VNode[] | unknown;
  [key: string]: unknown;
}

// Define the IntlayerNode type with proper generic handling
type _IntlayerNode<T> = Component<IntlayerNodeProps<T>> & {
  [key: string]: unknown;
};

// Export the type with a default type parameter
export type IntlayerNode<T = unknown> = _IntlayerNode<T>;

/** ---------------------------------------------
 *  INTLAYER NODE PLUGIN
 *  --------------------------------------------- */

export type IntlayerNodeCond<T> = T extends number | string
  ? IntlayerNode<T>
  : never;

type IntlayerNodeWithMetadata = {
  metadata: string;
};

/** Translation plugin. Replaces node with a locale string if nodeType = Translation. */
export const intlayerNodePlugins: CoreTypes.Plugins = {
  id: 'intlayer-node-plugin',
  canHandle: (node: any) =>
    typeof node === 'bigint' ||
    typeof node === 'string' ||
    typeof node === 'number',
  transform: (_node: any, context: any) => {
    const { plugins, ...rest } = context;
    return h(ContentSelector, rest as any, () =>
      h(EditedContentRenderer as Component, rest as any, () => rest.children)
    );
  },
};

/** ---------------------------------------------
 *  VUE NODE PLUGIN
 *  --------------------------------------------- */

export type VueNodeCond<T> = T extends {
  type: any;
  props: any;
  key: any;
}
  ? VNode
  : never;

/** Vue node plugin. Handles Vue VNodes. */
export const vueNodePlugins: CoreTypes.Plugins = {
  id: 'vue-node-plugin',
  canHandle: (node: any) =>
    node &&
    typeof node === 'object' &&
    'type' in node &&
    node.type === 'VueNode',
  transform: (node: any, context: any) => {
    const { plugins, ...rest } = context;
    return h(ContentSelector as Component, rest as any, () =>
      renderVueElement(node as VNode)
    );
  },
};

/**
 * MARKDOWN PLUGIN
 */

export type MarkdownStringCond<T> = T extends string
  ? IntlayerNode<string> & { metadata: string }
  : never;

/** Markdown string plugin. Replaces string node with a component that renders the markdown. */
export const markdownStringPlugin: Plugins = {
  id: 'markdown-string-plugin',
  canHandle: (node: unknown): node is string => typeof node === 'string',
  transform: (node: unknown, context: unknown) => {
    if (typeof node !== 'string') return null;

    const props = context as Record<string, unknown>;
    const metadata = CoreTypes.getMarkdownMetadata(node);

    // Ensure we're passing the correct props to MarkdownRenderer
    const rendererProps = {
      ...props,
      value: node,
      nodeType: CoreTypes.NodeType.Markdown as const, // Use const assertion for literal type
      metadata,
    };

    return h(MarkdownRenderer as Component, rendererProps);
  },
};

/**
 * Conditional type that extracts metadata from a Markdown content object
 *
 * @template T - The type to check against Markdown content structure
 * @returns The metadata type if T is a Markdown content object, otherwise never
 */
export type MarkdownCond<T> = T extends {
  nodeType: NodeType | string;
  [NodeType.Markdown]: infer _M; // The actual markdown content, not used here but needed for type inference
  metadata?: infer U;
}
  ? {
      metadata: U; // Extract the metadata type
    }
  : never;

/**
 * Markdown plugin that handles MarkdownContent nodes and renders them using MarkdownRenderer
 */
export const markdownPlugin: Plugins = {
  id: 'markdown-plugin',

  /**
   * Type guard to check if a node is a MarkdownContent object
   */
  canHandle: (node: unknown): node is CoreTypes.MarkdownContent => {
    return (
      node !== null &&
      typeof node === 'object' &&
      'nodeType' in node &&
      'content' in node &&
      (node as CoreTypes.MarkdownContent).nodeType ===
        CoreTypes.NodeType.Markdown
    );
  },

  /**
   * Transforms a MarkdownContent node into a Vue VNode using MarkdownRenderer
   */
  transform: (node: unknown, context: unknown) => {
    // Early return if the node is not a valid MarkdownContent object
    if (!markdownPlugin.canHandle(node)) {
      return null;
    }

    const markdownNode = node as CoreTypes.MarkdownContent;
    const props = context as Record<string, unknown>;

    // Prepare props for MarkdownRenderer component
    const rendererProps: Record<string, unknown> = {
      ...props, // Spread any existing context props
      value: markdownNode.content,
      nodeType: CoreTypes.NodeType.Markdown as const, // Use const assertion for literal type
      metadata: markdownNode.metadata,
    };

    // Create and return a VNode for the MarkdownRenderer component
    return h(MarkdownRenderer as Component, rendererProps);
  },
};

/** ---------------------------------------------
 *  PLUGINS RESULT
 *  --------------------------------------------- */

/**
 * Plugin state type for Vue-specific plugin conditions
 */
type IInterpreterPluginVue<T = unknown> = {
  /** Vue node condition */
  vueNode: VueNodeCond<T>;
  /** Intlayer node condition */
  intlayerNode: IntlayerNodeCond<T>;
  /** Markdown condition */
  markdown: MarkdownCond<T>;
};

/**
 * Plugin state interface that extends the core interpreter plugin state
 * with Vue-specific plugin states.
 */
export interface IInterpreterPluginState extends CoreIInterpreterPluginState {
  /** Whether the current node is a Vue node */
  vueNode: boolean;
  /** Whether the current node is an Intlayer node */
  intlayerNode: boolean;
  /** Whether the current node is a Markdown node */
  markdown: boolean;
}

// This type is now defined above

export * from './markdown/types';

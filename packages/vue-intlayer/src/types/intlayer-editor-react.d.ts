import { Component, VNode } from 'vue';

declare module '@intlayer/editor-react' {
  import type { Dictionary } from '@intlayer/core';

  export interface EditorProps<T extends Dictionary> {
    dictionary: T;
    locale?: string;
    children: (dictionary: T) => VNode | VNode[] | string | null;
  }

  export const Editor: Component<EditorProps<any>>;

  export const useEditor: () => {
    isEditorEnabled: boolean;
    toggleEditor: () => void;
  };

  export const useChangedContent: <T = any>() => {
    changedContent: T | null;
    setChangedContent: (content: T | null) => void;
  };
}

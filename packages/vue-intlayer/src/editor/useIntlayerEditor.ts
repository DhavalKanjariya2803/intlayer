import { ref } from 'vue';

/**
 * Composable that provides editor-related functionality
 */
export const useIntlayerEditor = () => {
  // In a real implementation, this would check if the editor is enabled
  // For now, we'll just return a simple object
  const isEditorEnabled = ref(false);

  return {
    isEditorEnabled,
  };
};

export default useIntlayerEditor;

import { defineComponent } from 'vue';
import { useIntlayerEditor } from './useIntlayerEditor';

export const ContentSelector = defineComponent({
  name: 'ContentSelector',
  props: {
    nodeType: {
      type: String,
      required: true,
    },
    keyPath: {
      type: Array,
      required: true,
    },
    value: {
      type: [String, Number, Object],
      default: '',
    },
    locale: {
      type: String,
      required: true,
    },
  },
  setup(props, { slots }) {
    const { isEditorEnabled } = useIntlayerEditor();

    // Only wrap with editor-specific logic if editor is enabled
    if (isEditorEnabled && props.nodeType === 'Translation') {
      return () => {
        // In a real implementation, you would wrap this with the editor UI
        // For now, just render the children as-is
        return slots.default ? slots.default() : null;
      };
    }

    // In non-editor mode or for non-translation nodes, just render children
    return () => (slots.default ? slots.default() : null);
  },
});

export default ContentSelector;

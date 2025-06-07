import { h, type VNode } from 'vue';

/**
 * Renders a Vue VNode with its props and children
 *
 * @param vnode - The VNode to render
 * @returns A new VNode with the same type, props, and children
 */
export const renderVueElement = (vnode: VNode): VNode => {
  if (!vnode || typeof vnode !== 'object' || !('type' in vnode)) {
    return vnode;
  }

  // Handle component with children
  if (vnode.children) {
    const children = Array.isArray(vnode.children)
      ? vnode.children.map((child) =>
          typeof child === 'object' && child !== null && 'type' in child
            ? renderVueElement(child as VNode)
            : child
        )
      : typeof vnode.children === 'object' &&
          vnode.children !== null &&
          'type' in vnode.children
        ? renderVueElement(vnode.children as VNode)
        : vnode.children;

    return h(vnode.type as any, vnode.props || {}, children);
  }

  // Handle component without children
  return h(vnode.type as any, vnode.props || {});
};

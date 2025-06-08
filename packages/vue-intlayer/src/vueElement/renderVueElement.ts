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
    let children: any = vnode.children;

    if (Array.isArray(children)) {
      children = children.map((child) =>
        typeof child === 'object' && child !== null && 'type' in child
          ? renderVueElement(child as VNode)
          : child
      );
    } else if (children && typeof children === 'object' && 'type' in children) {
      children = renderVueElement(children as VNode);
    }

    return h(vnode.type as any, vnode.props || {}, children);
  }

  // Handle component without children
  return h(vnode.type as any, vnode.props || {});
};

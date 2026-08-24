import React from "react";

const MOTION_ONLY_PROPS = new Set([
  "initial",
  "animate",
  "exit",
  "transition",
  "variants",
  "whileHover",
  "whileTap",
  "whileFocus",
  "whileInView",
  "viewport",
  "layout",
  "layoutId",
  "drag",
  "dragConstraints",
  "dragElastic",
  "dragMomentum",
  "onAnimationStart",
  "onAnimationComplete",
]);

const sanitizeProps = (props: Record<string, unknown>) => {
  const cleanProps: Record<string, unknown> = {};

  for (const key in props) {
    if (!MOTION_ONLY_PROPS.has(key)) {
      cleanProps[key] = props[key];
    }
  }

  return cleanProps;
};

const tagCache = new Map<string, React.ForwardRefExoticComponent<any>>();

const getOrCreateMotionTag = (tag: string) => {
  let Component = tagCache.get(tag);
  if (!Component) {
    Component = React.forwardRef<any, Record<string, any>>(
      ({ children, ...props }, ref) => {
        return React.createElement(tag, { ...sanitizeProps(props), ref }, children);
      }
    );
    Component.displayName = `Motion(${tag})`;
    tagCache.set(tag, Component);
  }
  return Component;
};

export const motion = new Proxy(
  {},
  {
    get: (_target, tag: string) => getOrCreateMotionTag(tag),
  }
) as Record<string, React.ComponentType<any>>;

export const AnimatePresence = ({
  children,
  mode,
}: {
  children: React.ReactNode;
  mode?: string;
}) => <>{children}</>;

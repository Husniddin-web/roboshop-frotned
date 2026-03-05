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

const createMotionTag = (tag: keyof JSX.IntrinsicElements) => {
  return ({ children, ...props }: Record<string, any>) => {
    return React.createElement(tag, sanitizeProps(props), children);
  };
};

export const motion = new Proxy(
  {},
  {
    get: (_target, tag: string) => createMotionTag(tag as keyof JSX.IntrinsicElements),
  }
) as Record<string, React.ComponentType<any>>;

export const AnimatePresence = ({ children }: { children: React.ReactNode }) => (
  <>{children}</>
);

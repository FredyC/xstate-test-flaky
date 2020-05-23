import React from "react";

import { State } from "xstate";

export function useMachineSwitch<TContext>(
  state: State<TContext, any, any>,
  matchesMap: Record<string, (ctx: TContext) => React.ReactNode>
): React.ReactNode {
  const prevRender = React.useRef<React.ReactNode>(null);

  const keyToRender = Object.keys(matchesMap).find((key) => state.matches(key));

  if (!keyToRender) {
    throw new Error(`State ${state.toStrings().join(".")} is not handled`);
  }

  const toRenderNow = keyToRender
    ? matchesMap[keyToRender](state.context)
    : prevRender.current;

  prevRender.current = toRenderNow;

  return toRenderNow;
}

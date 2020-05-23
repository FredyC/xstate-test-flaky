import React, { Suspense } from "react";
import { Machine } from "xstate";
import { useMachine } from "@xstate/react";
import { useMachineSwitch } from "./useMachineSwitch";
import { createSimpleSuspense } from "./suspense";

const appMachine = Machine({
  initial: "idle",
  states: {
    idle: {
      on: {
        NEXT: "step1",
      },
    },
    step1: {
      on: {
        NEXT: "step2",
      },
    },
    step2: {
      on: {
        NEXT: "finish",
      },
    },
    finish: { type: "final" },
  },
});

export default function App() {
  const [current, send] = useMachine(appMachine);
  const step = useMachineSwitch(current, {
    idle: () => <DelayedIdle />,
    step1: () => <div>Step 1</div>,
    step2: () => <div>Step 2</div>,
    finish: () => <div>Big finale</div>,
  });
  return (
    <div style={{ margin: "auto", marginTop: "10rem", maxWidth: "20rem" }}>
      <Suspense fallback={<h1>Loading...</h1>}>
        <button onClick={() => send("NEXT")} disabled={current.done}>
          Next
        </button>
        <hr />
        <h1>{step}</h1>
      </Suspense>
    </div>
  );
}

const idleDelay = createSimpleSuspense(
  new Promise((resolve) => setTimeout(resolve, 1000))
);

function DelayedIdle() {
  idleDelay.read();
  return <div>Idle</div>;
}

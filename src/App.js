import React, { Suspense } from "react";
import { Machine } from "xstate";
import { useMachine } from "@xstate/react";
import { useMachineSwitch } from "./useMachineSwitch";
import { createSimpleSuspense } from "./suspense";

const appMachine = Machine({
  initial: "welcome",
  states: {
    welcome: {
      on: {
        NEXT: "step1",
      },
    },
    step1: {
      on: {
        NEXT: "step2",
        BACK: "welcome",
      },
    },
    step2: {
      on: {
        NEXT: "finish",
        BACK: "step1",
      },
    },
    finish: {
      on: {
        BACK: "step2",
      },
    },
  },
});

export default function App() {
  const [current, send] = useMachine(appMachine);
  const step = useMachineSwitch(current, {
    welcome: () => <DelayedWelcome />,
    step1: () => <div>Step 1</div>,
    step2: () => <div>Step 2</div>,
    finish: () => <div>Big finale</div>,
  });
  return (
    <div style={{ margin: "auto", marginTop: "10rem", maxWidth: "20rem" }}>
      <Suspense fallback={<h1>Loading...</h1>}>
        <button
          onClick={() => send("BACK")}
          disabled={current.matches("welcome")}
        >
          Back
        </button>
        <button
          onClick={() => send("NEXT")}
          disabled={current.matches("finish")}
        >
          Next
        </button>
        <hr />
        <h1>{step}</h1>
      </Suspense>
    </div>
  );
}

const welcomeDelay = createSimpleSuspense(
  new Promise((resolve) => setTimeout(resolve, 1000))
);

function DelayedWelcome() {
  welcomeDelay.read();
  return <div>Welcome</div>;
}

import React from "react";
import { Machine } from "xstate";
import { createModel } from "@xstate/test";
import { screen, fireEvent, render } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";

executeTestModel({
  machine: {
    initial: "idle",
    states: {
      idle: {
        ...expectHeading("Idle"),
        on: {
          CLICK_NEXT: "step1",
        },
      },
      step1: {
        ...expectHeading("Step 1"),
        on: {
          CLICK_NEXT: "step2",
        },
      },
      step2: {
        ...expectHeading("Step 2"),
        on: {
          CLICK_NEXT: "finish",
        },
      },
      finish: {
        ...expectHeading("Big finale"),
      },
    },
  },
  events: {
    CLICK_NEXT: () => {
      fireEvent.click(screen.getByRole("button", { name: "Next" }));
    },
  },
  setup() {
    render(<App />);
  },
});

function expectHeading(text) {
  return {
    meta: {
      test: async () =>
        expect(
          await screen.findByRole("heading", { name: text })
        ).toBeInTheDocument(),
    },
  };
}

function executeTestModel({ machine, events, setup }) {
  const testModel = createModel(Machine(machine)).withEvents(events);
  const testPlans = testModel.getSimplePathPlans();
  testPlans.forEach((plan) => {
    describe(plan.description, () => {
      plan.paths.forEach((path) => {
        it(path.description, async () => {
          setup();
          await path.test();
        });
      });
    });
  });
}

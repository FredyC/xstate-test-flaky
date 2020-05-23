import React from "react";
import { Machine } from "xstate";
import { createModel } from "@xstate/test";
import { screen, fireEvent, render } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";

executeTestModel({
  machine: {
    initial: "welcome",
    states: {
      welcome: {
        ...expectHeading("Welcome"),
        on: {
          CLICK_NEXT: "step1",
        },
        initial: "default",
        states: {
          default: {},
          back: {},
        },
      },
      step1: {
        ...expectHeading("Step 1"),
        on: {
          CLICK_NEXT: "step2",
          CLICK_BACK: "welcome.back",
        },
        initial: "default",
        states: {
          default: {},
          back: {},
        },
      },
      step2: {
        ...expectHeading("Step 2"),
        on: {
          CLICK_NEXT: "finish",
          CLICK_BACK: "step1.back",
        },
        initial: "default",
        states: {
          default: {},
          back: {},
        },
      },
      finish: {
        ...expectHeading("Big finale"),
        on: {
          CLICK_BACK: "step2.back",
        },
      },
    },
  },
  events: {
    CLICK_NEXT: () => {
      fireEvent.click(screen.getByRole("button", { name: "Next" }));
    },
    CLICK_BACK: () => {
      fireEvent.click(screen.getByRole("button", { name: "Back" }));
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

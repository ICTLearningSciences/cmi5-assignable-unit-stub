import React from "react";
import { screen } from "@testing-library/dom";
import { render } from "@testing-library/react";
import {} from "../src";
import {
  Context,
  Cmi5Context,
  Cmi5Status,
  Provider as Cmi5Provider,
} from "../src";

function CmiStatus(): JSX.Element {
  const cmi = React.useContext<Cmi5Context>(Context);
  return <div data-testid="cmiStatus">{cmi.cmiStatus}</div>;
}

describe("<Cmi5Provider>", () => {
  describe("cmi5Status", () => {
    it("has initial value NONE", async () => {
      render(
        <Cmi5Provider>
          <CmiStatus />
        </Cmi5Provider>
      );
      expect(screen.getByTestId("cmiStatus").textContent).toBe(Cmi5Status.NONE);
    });
  });
  describe("cmi", () => {
    it("has initial value NONE", async () => {
      render(
        <Cmi5Provider>
          <CmiStatus />
        </Cmi5Provider>
      );
      expect(screen.getByTestId("cmiStatus").textContent).toBe(Cmi5Status.NONE);
    });
  });
});

import { describe, it, expect } from "vitest";
import { act } from "react";
import ReactDOM from "react-dom/client";
import { ReactAPIActChild } from "./ReactAPI";

describe("TEST", () => {
  it("Test test with React act", async () => {
    const container = document.createElement("div");
    document.body.appendChild(container);

    // w 'act' mozemy RENDEROWAC komponenty
    await act(async () => {
      ReactDOM.createRoot(container).render(<ReactAPIActChild />);
    });

    const button = container.querySelector("button");
    const label = container.querySelector("p");

    expect(label.textContent).toBe("You clicked 0 times");
    expect(document.title).toBe("You clicked 0 times");

    // w 'act' mozna tez wywoływać EVENTY
    await act(async () => {
      button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(label.textContent).toBe("You clicked 1 times");
    expect(document.title).toBe("You clicked 1 times");
  });
});

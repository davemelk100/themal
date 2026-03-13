/// <reference types="vitest/globals" />
import { render } from "@testing-library/react";
import { FeatureFlag } from "../components/FeatureFlag";
import { FEATURE_FLAGS } from "../utils/featureFlags";

describe("FEATURE_FLAGS", () => {
  it("has a tables flag set to false", () => {
    expect(FEATURE_FLAGS.tables).toBe(false);
  });
});

describe("FeatureFlag component", () => {
  it("does not render children when the flag is false", () => {
    const { container } = render(
      <FeatureFlag name="tables">
        <div data-testid="hidden">Should not render</div>
      </FeatureFlag>,
    );
    expect(container.innerHTML).toBe("");
  });
});

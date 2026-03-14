/// <reference types="vitest/globals" />
import { render } from "@testing-library/react";
import { FeatureFlag } from "../components/FeatureFlag";
import { FEATURE_FLAGS } from "../utils/featureFlags";

describe("FEATURE_FLAGS", () => {
  it("has a tables flag set to true", () => {
    expect(FEATURE_FLAGS.tables).toBe(true);
  });
});

describe("FeatureFlag component", () => {
  it("renders children when the flag is true", () => {
    const { container } = render(
      <FeatureFlag name="tables">
        <div data-testid="visible">Should render</div>
      </FeatureFlag>,
    );
    expect(container.innerHTML).not.toBe("");
  });

  it("does not render children when the flag is false", () => {
    const { container } = render(
      <FeatureFlag name="aiPaletteMapping">
        <div data-testid="hidden">Should not render</div>
      </FeatureFlag>,
    );
    expect(container.innerHTML).toBe("");
  });
});

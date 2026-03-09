/// <reference types="vitest/globals" />
import {
  DEFAULT_BUTTON_STYLE,
  BUTTON_PRESETS,
} from "../utils/themeUtils";
import type { ButtonStyleState } from "../utils/themeUtils";

describe("BUTTON_PRESETS", () => {
  it("contains subtle, elevated, and bold presets", () => {
    expect(BUTTON_PRESETS).toHaveProperty("subtle");
    expect(BUTTON_PRESETS).toHaveProperty("elevated");
    expect(BUTTON_PRESETS).toHaveProperty("bold");
  });

  it("each preset has all required ButtonStyleState fields", () => {
    const requiredKeys: (keyof ButtonStyleState)[] = [
      "preset",
      "paddingX",
      "paddingY",
      "fontSize",
      "fontWeight",
      "borderRadius",
      "shadowOffsetX",
      "shadowOffsetY",
      "shadowBlur",
      "shadowSpread",
      "shadowColor",
      "borderWidth",
    ];

    for (const [name, preset] of Object.entries(BUTTON_PRESETS)) {
      for (const key of requiredKeys) {
        expect(preset).toHaveProperty(key);
      }
      expect(preset.preset).toBe(name);
    }
  });

  it("subtle preset matches DEFAULT_BUTTON_STYLE", () => {
    expect(BUTTON_PRESETS.subtle).toEqual(DEFAULT_BUTTON_STYLE);
  });

  it("elevated has larger padding than subtle", () => {
    expect(BUTTON_PRESETS.elevated.paddingX).toBeGreaterThan(
      BUTTON_PRESETS.subtle.paddingX,
    );
    expect(BUTTON_PRESETS.elevated.paddingY).toBeGreaterThan(
      BUTTON_PRESETS.subtle.paddingY,
    );
  });

  it("bold has larger padding and font weight than elevated", () => {
    expect(BUTTON_PRESETS.bold.paddingX).toBeGreaterThan(
      BUTTON_PRESETS.elevated.paddingX,
    );
    expect(BUTTON_PRESETS.bold.fontWeight).toBeGreaterThan(
      BUTTON_PRESETS.elevated.fontWeight,
    );
  });

  it("bold has more shadow than subtle", () => {
    expect(BUTTON_PRESETS.bold.shadowBlur).toBeGreaterThan(
      BUTTON_PRESETS.subtle.shadowBlur,
    );
  });

  it("preset field matches the key for each preset", () => {
    expect(BUTTON_PRESETS.subtle.preset).toBe("subtle");
    expect(BUTTON_PRESETS.elevated.preset).toBe("elevated");
    expect(BUTTON_PRESETS.bold.preset).toBe("bold");
  });
});

describe("DEFAULT_BUTTON_STYLE", () => {
  it("has preset set to subtle", () => {
    expect(DEFAULT_BUTTON_STYLE.preset).toBe("subtle");
  });

  it("has reasonable default values", () => {
    expect(DEFAULT_BUTTON_STYLE.paddingX).toBeGreaterThan(0);
    expect(DEFAULT_BUTTON_STYLE.paddingY).toBeGreaterThan(0);
    expect(DEFAULT_BUTTON_STYLE.fontSize).toBeGreaterThan(0);
    expect(DEFAULT_BUTTON_STYLE.fontWeight).toBeGreaterThanOrEqual(100);
    expect(DEFAULT_BUTTON_STYLE.borderRadius).toBeGreaterThanOrEqual(0);
  });
});

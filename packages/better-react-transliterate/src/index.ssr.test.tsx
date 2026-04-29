// @vitest-environment node

import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { ReactTransliterate } from "./index";

describe("ReactTransliterate SSR", () => {
  it("renders on the server without touching browser globals", () => {
    const html = renderToString(
      <ReactTransliterate value="" onChangeText={vi.fn()} />,
    );

    expect(html).toContain('data-testid="rt-input-component"');
  });
});

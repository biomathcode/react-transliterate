import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ReactTransliterate } from "./index";

const fetchMock = vi.fn();

beforeEach(() => {
  vi.stubGlobal("fetch", fetchMock);
  fetchMock.mockResolvedValue({
    json: async () => ["SUCCESS", [["there", ["hi", "hey", "hello"]]]],
  });
});

afterEach(() => {
  fetchMock.mockReset();
});

describe("ReactTransliterate", () => {
  it("renders without errors", () => {
    render(<ReactTransliterate value="" onChangeText={vi.fn()} />);
    expect(screen.getByTestId("rt-input-component")).toBeInTheDocument();
  });

  it("renders the passed value in the input", () => {
    render(
      <ReactTransliterate value="MOCK_VALUE" onChangeText={vi.fn()} />,
    );

    expect(screen.getByDisplayValue("MOCK_VALUE")).toBeInTheDocument();
  });

  it("calls onChangeText on user input", async () => {
    const onChangeText = vi.fn();

    render(<ReactTransliterate value="" onChangeText={onChangeText} />);

    fireEvent.change(screen.getByTestId("rt-input-component"), {
      target: { value: "H" },
    });

    await waitFor(() => {
      expect(screen.getByTestId("rt-suggestions-list")).toBeInTheDocument();
      expect(onChangeText).toHaveBeenCalledWith("H");
    });
  });

  it("renders suggestions from the transliteration API", async () => {
    render(<ReactTransliterate value="" onChangeText={vi.fn()} />);

    fireEvent.change(screen.getByTestId("rt-input-component"), {
      target: { value: "there" },
    });

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalled();
      expect(screen.getByText("hi")).toBeInTheDocument();
    });
  });
});

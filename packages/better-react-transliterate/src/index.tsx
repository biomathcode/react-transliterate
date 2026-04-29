"use client";

import * as React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import getCaretCoordinates from "textarea-caret";

import { setCaretPosition, getInputSelection, isTouchEnabled } from "./util";
import {
  ReactTransliterateProps,
  RenderComponentProps,
} from "./interfaces/Props";
import { Language } from "./types/Language";
import { TriggerKeys } from "./constants/TriggerKeys";
import { getTransliterateSuggestions } from "./util/suggestions-util";

const OPTION_LIST_Y_OFFSET = 10;
const OPTION_LIST_MIN_WIDTH = 100;

const defaultSuggestionsContainerStyles: React.CSSProperties = {
  backgroundClip: "padding-box",
  backgroundColor: "#fff",
  border: "1px solid rgba(0, 0, 0, 0.15)",
  boxShadow: "0 6px 12px rgba(0, 0, 0, 0.175)",
  display: "block",
  fontSize: "14px",
  listStyle: "none",
  margin: 0,
  padding: "1px",
  textAlign: "left",
  zIndex: 20000,
};

const defaultSuggestionItemStyles: React.CSSProperties = {
  cursor: "pointer",
  minWidth: "100px",
  padding: "10px",
};

const defaultActiveSuggestionItemStyles: React.CSSProperties = {
  backgroundColor: "#65c3d7",
  color: "#fff",
};

export const ReactTransliterate = ({
  renderComponent = (props) => (
    <input
      {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
      ref={props.ref as React.Ref<HTMLInputElement>}
    />
  ),
  lang = "hi",
  offsetX = 0,
  offsetY = 10,
  onChange,
  onChangeText,
  onBlur,
  onKeyDown,
  value,
  containerClassName = "",
  containerStyles = {},
  suggestionsContainerClassName = "",
  suggestionsContainerStyles = {},
  suggestionItemClassName = "",
  suggestionItemStyles = {},
  activeSuggestionItemClassName = "",
  activeItemStyles = {},
  maxOptions = 5,
  hideSuggestionBoxOnMobileDevices = false,
  hideSuggestionBoxBreakpoint = 450,
  triggerKeys = [
    TriggerKeys.KEY_SPACE,
    TriggerKeys.KEY_ENTER,
    TriggerKeys.KEY_RETURN,
    TriggerKeys.KEY_TAB,
  ],
  insertCurrentSelectionOnBlur = true,
  showCurrentWordAsLastSuggestion = true,
  enabled = true,
  ...rest
}: ReactTransliterateProps): React.JSX.Element => {
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  const [options, setOptions] = useState<string[]>([]);
  const [selection, setSelection] = useState(0);
  const [matchStart, setMatchStart] = useState(-1);
  const [matchEnd, setMatchEnd] = useState(-1);
  const [position, setPosition] = useState({ left: 0, top: 0 });
  const [windowWidth, setWindowWidth] = useState(0);

  const shouldRenderSuggestions = useMemo(
    () =>
      !hideSuggestionBoxOnMobileDevices ||
      windowWidth > hideSuggestionBoxBreakpoint,
    [
      hideSuggestionBoxOnMobileDevices,
      hideSuggestionBoxBreakpoint,
      windowWidth,
    ],
  );

  const mergedSuggestionContainerStyles = useMemo(
    () => ({
      ...defaultSuggestionsContainerStyles,
      ...suggestionsContainerStyles,
    }),
    [suggestionsContainerStyles],
  );

  const mergedSuggestionItemStyles = useMemo(
    () => ({
      ...defaultSuggestionItemStyles,
      ...suggestionItemStyles,
    }),
    [suggestionItemStyles],
  );

  const mergedActiveSuggestionItemStyles = useMemo(
    () => ({
      ...defaultActiveSuggestionItemStyles,
      ...activeItemStyles,
    }),
    [activeItemStyles],
  );

  const reset = () => {
    setSelection(0);
    setOptions([]);
  };

  const handleSelection = (index: number) => {
    const selectedValue = options[index];

    const newValue =
      value.slice(0, matchStart) +
      selectedValue +
      " " +
      value.slice(matchEnd + 1);

    setTimeout(() => {
      if (!inputRef.current) return;

      setCaretPosition(
        inputRef.current,
        matchStart + selectedValue.length + 1,
      );
    }, 1);

    onChangeText(newValue);
    onChange?.({
      target: { value: newValue },
    } as unknown as React.FormEvent<HTMLInputElement | HTMLTextAreaElement>);

    reset();
    inputRef.current?.focus();
  };

  const renderSuggestions = async (word: string) => {
    if (!shouldRenderSuggestions) return;

    const data = await getTransliterateSuggestions(word, {
      numOptions: showCurrentWordAsLastSuggestion
        ? maxOptions - 1
        : maxOptions,
      showCurrentWordAsLastSuggestion,
      lang,
    });

    setOptions(data);
  };

  const handleChange = (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const inputValue = event.currentTarget.value;

    onChange?.(event);
    onChangeText(inputValue);

    if (!shouldRenderSuggestions) return;

    const input = inputRef.current;
    if (!input) return;

    const caret = getInputSelection(event.currentTarget).end;

    const wordStart = Math.max(
      inputValue.lastIndexOf(" ", caret - 1),
      inputValue.lastIndexOf("\n", caret - 1),
    );

    const currentWord = inputValue.slice(wordStart + 1, caret);

    setMatchStart(wordStart + 1);
    setMatchEnd(caret - 1);

    if (!currentWord || !enabled) {
      reset();
      return;
    }

    renderSuggestions(currentWord);

    const caretPos = getCaretCoordinates(input, caret);
    const rect = input.getBoundingClientRect();

    setPosition({
      left: Math.min(
        caretPos.left,
        rect.width - OPTION_LIST_MIN_WIDTH / 2,
      ),
      top: Math.min(
        caretPos.top + OPTION_LIST_Y_OFFSET,
        rect.height,
      ),
    });
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (!options.length) {
      onKeyDown?.(event);
      return;
    }

    if (triggerKeys.includes(event.key)) {
      event.preventDefault();
      handleSelection(selection);
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      reset();
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setSelection((prev) => (options.length + prev - 1) % options.length);
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setSelection((prev) => (prev + 1) % options.length);
      return;
    }

    onKeyDown?.(event);
  };

  const handleBlur = (
    event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (!isTouchEnabled()) {
      if (insertCurrentSelectionOnBlur && options[selection]) {
        handleSelection(selection);
      } else {
        reset();
      }
    }

    onBlur?.(event);
  };

  useEffect(() => {
    const updateWidth = () => setWindowWidth(window.innerWidth);

    updateWidth();
    window.addEventListener("resize", updateWidth);

    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  return (
    <div
      className={containerClassName}
      style={{
        position: "relative",
        ...containerStyles,
      }}
    >
      {renderComponent({
        onChange: handleChange,
        onKeyDown: handleKeyDown,
        onBlur: handleBlur,
        ref: inputRef,
        value,
        "data-testid": "rt-input-component",
        ...rest,
      } as RenderComponentProps)}

      {shouldRenderSuggestions && options.length > 0 && (
        <ul
          className={suggestionsContainerClassName}
          data-testid="rt-suggestions-list"
          style={{
            ...mergedSuggestionContainerStyles,
            position: "absolute",
            left: `${position.left + offsetX}px`,
            top: `${position.top + offsetY}px`,
          }}
        >
          {[...new Set(options)].map((item, index) => {
            const isActive = index === selection;

            return (
              <li
                key={item}
                onMouseEnter={() => setSelection(index)}
                onClick={() => handleSelection(index)}
                className={[
                  suggestionItemClassName,
                  isActive ? activeSuggestionItemClassName : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                style={{
                  ...mergedSuggestionItemStyles,
                  ...(isActive ? mergedActiveSuggestionItemStyles : {}),
                }}
              >
                {item}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export type {
  ReactTransliterateProps,
  Language,
  RenderComponentProps,
};

export {
  TriggerKeys,
  getTransliterateSuggestions,
};
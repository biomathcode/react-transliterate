import * as React from "react";
import { Language } from "../types/Language";

export type SharedFormElement =
  | HTMLInputElement
  | HTMLTextAreaElement;

type BaseInputProps<T extends SharedFormElement> =
  T extends HTMLInputElement
  ? Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "onBlur" | "onChange" | "onKeyDown" | "ref" | "value"
  >
  : Omit<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    "onBlur" | "onChange" | "onKeyDown" | "ref" | "value"
  >;

export type RenderComponentProps<
  T extends SharedFormElement = HTMLInputElement
> = BaseInputProps<T> & {
  onBlur?: (event: React.FocusEvent<T>) => void;
  onChange?: (event: React.FormEvent<T>) => void;
  onKeyDown?: (event: React.KeyboardEvent<T>) => void;
  ref: React.Ref<T>;
  value: string;
};

export type ReactTransliterateProps<
  T extends SharedFormElement = HTMLInputElement
> = BaseInputProps<T> & {
  renderComponent?: (
    props: RenderComponentProps<T>
  ) => React.ReactElement;

  /**
   * Extra horizontal offset for suggestions dropdown
   */
  offsetX?: number;

  /**
   * Extra vertical offset for suggestions dropdown
   */
  offsetY?: number;

  /**
   * Wrapper container className
   */
  containerClassName?: string;

  /**
   * Wrapper container inline styles
   */
  containerStyles?: React.CSSProperties;

  /**
   * Suggestions dropdown className
   */
  suggestionsContainerClassName?: string;

  /**
   * Suggestions dropdown inline styles
   */
  suggestionsContainerStyles?: React.CSSProperties;

  /**
   * Suggestion item className
   */
  suggestionItemClassName?: string;

  /**
   * Suggestion item inline styles
   */
  suggestionItemStyles?: React.CSSProperties;

  /**
   * Active suggestion item className
   */
  activeSuggestionItemClassName?: string;

  /**
   * Active suggestion item inline styles
   */
  activeItemStyles?: React.CSSProperties;

  /**
   * Maximum suggestions to display
   */
  maxOptions?: number;

  /**
   * Transliteration language
   */
  lang?: Language;

  /**
   * Controlled input value
   */
  value: string;

  /**
   * Returns updated text value
   */
  onChangeText: (text: string) => void;

  /**
   * Underlying change event
   */
  onChange?: (event: React.FormEvent<SharedFormElement>) => void;

  /**
   * Underlying blur event
   */
  onBlur?: (event: React.FocusEvent<SharedFormElement>) => void;

  /**
   * Underlying keydown event
   */
  onKeyDown?: (
    event: React.KeyboardEvent<SharedFormElement>,
  ) => void;

  /**
   * Hide suggestions on mobile devices
   */
  hideSuggestionBoxOnMobileDevices?: boolean;

  /**
   * Width threshold for hiding suggestions
   */
  hideSuggestionBoxBreakpoint?: number;

  /**
   * Keys that trigger current selection insertion
   */
  triggerKeys?: string[];

  /**
   * Insert selected suggestion on blur
   */
  insertCurrentSelectionOnBlur?: boolean;

  /**
   * Include current typed word as last suggestion
   */
  showCurrentWordAsLastSuggestion?: boolean;

  /**
   * Enable or disable transliteration suggestions
   */
  enabled?: boolean;
}
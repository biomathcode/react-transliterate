import { useState } from "react";
import {
  ReactTransliterate,
  TriggerKeys,
} from "better-react-transliterate";
import type {
  Language,
  RenderComponentProps,
} from "better-react-transliterate";
import { languages } from "./languages";
import "./App.css";

function App() {
  const [lang, setLang] = useState<Language>("hi");
  const [headline, setHeadline] = useState("namaste");
  const [notes, setNotes] = useState(
    "mujhe react pasand hai.",
  );
  const [suggestionsEnabled, setSuggestionsEnabled] = useState(true);

  return (
    <main className="page-shell">
      <section className="hero-panel">
        <p className="eyebrow">Vite workspace example</p>
        <h1>SSR-safe transliteration with a local pnpm workspace package.</h1>
        <p className="lede">
          This demo is scaffolded with Vite, imports the package stylesheet
          explicitly, and resolves the library straight from the workspace
          source during development.
        </p>
      </section>

      <section className="playground">
        <div className="controls-card">
          <div className="field">
            <label htmlFor="language">Language</label>
            <select
              id="language"
              value={lang}
              onChange={(event) => setLang(event.target.value as Language)}
            >
              {languages.map((language) => (
                <option key={language.value} value={language.value}>
                  {language.label}
                </option>
              ))}
            </select>
          </div>

          <label className="toggle">
            <input
              type="checkbox"
              checked={suggestionsEnabled}
              onChange={(event) => setSuggestionsEnabled(event.target.checked)}
            />
            <span>Suggestions enabled</span>
          </label>

          <div className="hint-list">
            <p>Try typing: `namaste`, `bharat`, `shukriya`</p>
            <p>Commit a suggestion with `Space`, `Enter`, or `Tab`.</p>
          </div>
        </div>

        <div className="demo-card">
          <div className="field">
            <label htmlFor="headline-input">Single line input</label>
            <ReactTransliterate
              id="headline-input"
              lang={lang}
              value={headline}
              onChangeText={setHeadline}
              enabled={suggestionsEnabled}
              placeholder="Type here..."
            />
          </div>

          <div className="field">
            <label htmlFor="notes-input">Textarea</label>
            <ReactTransliterate
              id="notes-input"
              lang={lang}
              value={notes}
              onChangeText={setNotes}
              enabled={suggestionsEnabled}
              triggerKeys={[
                TriggerKeys.KEY_SPACE,
                TriggerKeys.KEY_ENTER,
                TriggerKeys.KEY_TAB,
              ]}
              renderComponent={(props: RenderComponentProps) => (
                <textarea {...props} rows={6} />
              )}
              placeholder="Write a longer message..."
            />
          </div>
        </div>

        <aside className="preview-card">
          <p className="preview-label">Current values</p>
          <div className="preview-block">
            <span className="preview-key">Headline</span>
            <p>{headline}</p>
          </div>
          <div className="preview-block">
            <span className="preview-key">Notes</span>
            <p>{notes}</p>
          </div>
        </aside>
      </section>
    </main>
  );
}

export default App;

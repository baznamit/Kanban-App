import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiRequest } from "../api/client";

const EMPTY_MEMO = {
  summary: "",
  market: "",
  product: "",
  traction: "",
  risks: "",
  open_questions: "",
};

export default function Memo() {
  const { dealId } = useParams();
  const [content, setContent] = useState(EMPTY_MEMO);
  const [versions, setVersions] = useState([]);
  const [readOnly, setReadOnly] = useState(false);

  useEffect(() => {
    loadVersions();
  }, []);

  async function loadVersions() {
    const res = await apiRequest(`/memos/${dealId}`);
    setVersions(res);

    if (res.length > 0) {
      loadVersion(res[0].id);
    }
  }

  async function loadVersion(memoId) {
    const memo = await apiRequest(`/memos/version/${memoId}`);
    setContent(memo.content);
    setReadOnly(true);
  }

  async function saveMemo() {
    await apiRequest(`/memos/${dealId}?created_by=analyst`, {
      method: "POST",
      body: JSON.stringify(content),
    });
    setReadOnly(false);
    loadVersions();
  }

  function updateField(key, value) {
    if (readOnly) return;
    setContent({ ...content, [key]: value });
  }

  return (
    <div className="page" style={{ display: "flex", gap: 24 }}>
      {/* Memo Editor */}
      <div style={{ flex: 2 }}>
        <h2>IC Memo</h2>

        {Object.keys(EMPTY_MEMO).map((key) => (
          <div key={key} style={{ marginBottom: 16 }}>
            <label
              style={{
                fontSize: 13,
                fontWeight: 600,
                textTransform: "uppercase",
              }}
            >
              {key.replace("_", " ")}
            </label>
            <textarea
              rows={4}
              style={{
                width: "100%",
                marginTop: 6,
                background: readOnly ? "#f8f9fa" : "white",
              }}
              value={content[key]}
              onChange={(e) => updateField(key, e.target.value)}
              readOnly={readOnly}
            />
          </div>
        ))}

        {!readOnly && (
          <button onClick={saveMemo}>Save New Version</button>
        )}
      </div>

      {/* Version History */}
      <div
        style={{
          flex: 1,
          background: "#f8f9fa",
          padding: 16,
          borderRadius: 10,
          height: "fit-content",
        }}
      >
        <h3>Version History</h3>

        <ul style={{ listStyle: "none", padding: 0 }}>
          {versions.map((v) => (
            <li key={v.id} style={{ marginBottom: 8 }}>
              <button
                style={{
                  width: "100%",
                  textAlign: "left",
                }}
                onClick={() => loadVersion(v.id)}
              >
                Version {v.version}
              </button>
            </li>
          ))}
        </ul>

        <button
          style={{ marginTop: 12, width: "100%" }}
          onClick={() => {
            setContent(EMPTY_MEMO);
            setReadOnly(false);
          }}
        >
          New Draft
        </button>
      </div>
    </div>
  );
}
    
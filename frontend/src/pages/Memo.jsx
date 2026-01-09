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
    <div style={{ display: "flex", padding: 20, gap: 20 }}>
      {/* Memo Editor */}
      <div style={{ flex: 2 }}>
        <h2>IC Memo</h2>

        {Object.keys(EMPTY_MEMO).map((key) => (
          <div key={key} style={{ marginBottom: 12 }}>
            <label><strong>{key.replace("_", " ")}</strong></label>
            <textarea
              rows={4}
              style={{ width: "100%" }}
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
      <div style={{ flex: 1 }}>
        <h3>Version History</h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {versions.map((v) => (
            <li key={v.id} style={{ marginBottom: 8 }}>
              <button onClick={() => loadVersion(v.id)}>
                Version {v.version}
              </button>
            </li>
          ))}
        </ul>

        <button onClick={() => {
          setContent(EMPTY_MEMO);
          setReadOnly(false);
        }}>
          New Draft
        </button>
      </div>
    </div>
  );
}

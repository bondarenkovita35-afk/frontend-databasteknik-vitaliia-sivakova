import { useEffect, useMemo, useState } from "react";
import { api, API_BASE } from "./api";
import type { Course, Participant } from "./types";

type Tab = "courses" | "participants";

export default function App() {
  const [tab, setTab] = useState<Tab>("courses");
  const [error, setError] = useState<string | null>(null);
  const title = useMemo(() => (tab === "courses" ? "Courses" : "Participants"), [tab]);

  return (
    <div className="page">
      <header className="header">
        <div>
          <h1>Databasteknik – Frontend</h1>
          <p className="muted">
            Backend: <code>{API_BASE}</code>
          </p>
        </div>
        <nav className="tabs">
          <button className={tab === "courses" ? "active" : ""} onClick={() => setTab("courses")}>
            Courses
          </button>
          <button
            className={tab === "participants" ? "active" : ""}
            onClick={() => setTab("participants")}
          >
            Participants
          </button>
        </nav>
      </header>

      {error ? (
        <div className="error">
          <div>
            <strong>Error:</strong> {error}
          </div>
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      ) : null}

      <main className="card">
        <h2>{title}</h2>
        {tab === "courses" ? <Courses onError={setError} /> : <Participants onError={setError} />}
      </main>

      <footer className="footer muted">Minimal UI for testing API. Design is not graded.</footer>
    </div>
  );
}

function Courses({ onError }: { onError: (msg: string) => void }) {
  const [items, setItems] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [credits, setCredits] = useState<number>(5);

  const [lookupId, setLookupId] = useState("");
  const [lookupResult, setLookupResult] = useState<Course | null>(null);

  async function load() {
    try {
      setLoading(true);
      setLookupResult(null);
      const data = await api<Course[]>("/api/courses");
      setItems(data);
    } catch (e: any) {
      onError(e.message || String(e));
    } finally {
      setLoading(false);
    }
  }

  async function create() {
    try {
      setLoading(true);
      const payload = { title, description, credits };
      const created = await api<Course>("/api/courses", { method: "POST", body: JSON.stringify(payload) });
      setTitle("");
      setDescription("");
      setCredits(5);
      setItems((prev) => [created, ...prev]);
    } catch (e: any) {
      onError(e.message || String(e));
    } finally {
      setLoading(false);
    }
  }

  async function remove(id: string) {
    try {
      setLoading(true);
      await api<void>(`/api/courses/${id}`, { method: "DELETE" });
      setItems((prev) => prev.filter((x) => x.id !== id));
    } catch (e: any) {
      onError(e.message || String(e));
    } finally {
      setLoading(false);
    }
  }

  async function lookup() {
    try {
      setLoading(true);
      setLookupResult(null);
      const found = await api<Course>(`/api/courses/${lookupId}`);
      setLookupResult(found);
    } catch (e: any) {
      onError(e.message || String(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="grid">
      <section className="panel">
        <h3>Create course</h3>
        <label>
          Title
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. SQL 101" />
        </label>
        <label>
          Description
          <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short description" />
        </label>
        <label>
          Credits
          <input type="number" value={credits} onChange={(e) => setCredits(Number(e.target.value))} min={0} />
        </label>
        <div className="row">
          <button disabled={loading || !title.trim()} onClick={create}>Create</button>
          <button className="secondary" disabled={loading} onClick={load}>Refresh</button>
        </div>
      </section>

      <section className="panel">
        <h3>Find course by id</h3>
        <label>
          Course id (GUID)
          <input value={lookupId} onChange={(e) => setLookupId(e.target.value)} placeholder="paste GUID" />
        </label>
        <div className="row">
          <button disabled={loading || !lookupId.trim()} onClick={lookup}>Lookup</button>
          <button className="secondary" onClick={() => setLookupResult(null)}>Clear</button>
        </div>
        {lookupResult ? <pre className="pre">{JSON.stringify(lookupResult, null, 2)}</pre> : <p className="muted">Demonstrates GET /api/courses/{'{id}'}</p>}
      </section>

      <section className="panel full">
        <h3>Courses</h3>
        {loading ? <p className="muted">Loading...</p> : null}
        {items.length === 0 ? (
          <p className="muted">No courses yet. Create one above.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Credits</th>
                <th>ID</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {items.map((c) => (
                <tr key={c.id}>
                  <td>{c.title}</td>
                  <td>{c.credits}</td>
                  <td className="mono">{c.id}</td>
                  <td className="right">
                    <button className="danger" disabled={loading} onClick={() => remove(c.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

function Participants({ onError }: { onError: (msg: string) => void }) {
  const [items, setItems] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  async function load() {
    try {
      setLoading(true);
      const data = await api<Participant[]>("/api/participants");
      setItems(data);
    } catch (e: any) {
      onError(e.message || String(e));
    } finally {
      setLoading(false);
    }
  }

  async function create() {
    try {
      setLoading(true);
      const payload = { firstName, lastName, email };
      const created = await api<Participant>("/api/participants", { method: "POST", body: JSON.stringify(payload) });
      setFirstName("");
      setLastName("");
      setEmail("");
      setItems((prev) => [created, ...prev]);
    } catch (e: any) {
      onError(e.message || String(e));
    } finally {
      setLoading(false);
    }
  }

  async function remove(id: string) {
    try {
      setLoading(true);
      await api<void>(`/api/participants/${id}`, { method: "DELETE" });
      setItems((prev) => prev.filter((x) => x.id !== id));
    } catch (e: any) {
      onError(e.message || String(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="grid">
      <section className="panel">
        <h3>Create participant</h3>
        <label>
          First name
          <input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        </label>
        <label>
          Last name
          <input value={lastName} onChange={(e) => setLastName(e.target.value)} />
        </label>
        <label>
          Email
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" />
        </label>
        <div className="row">
          <button disabled={loading || !email.trim()} onClick={create}>Create</button>
          <button className="secondary" disabled={loading} onClick={load}>Refresh</button>
        </div>
      </section>

      <section className="panel full">
        <h3>Participants</h3>
        {loading ? <p className="muted">Loading...</p> : null}
        {items.length === 0 ? (
          <p className="muted">No participants yet. Create one above.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>ID</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.id}>
                  <td>{p.firstName} {p.lastName}</td>
                  <td>{p.email}</td>
                  <td className="mono">{p.id}</td>
                  <td className="right">
                    <button className="danger" disabled={loading} onClick={() => remove(p.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

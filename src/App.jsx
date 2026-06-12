import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft, ArrowRight, BookOpen, BrainCircuit, Check, CheckCircle2, ChevronDown,
  Clipboard, Clock3, Copy, Download, FileText, FlipHorizontal2, GraduationCap,
  Layers3, Library, Lightbulb, ListChecks, LoaderCircle, Menu, NotebookPen,
  Plus, RefreshCcw, Save, Search, Shuffle, Sparkles, Trash2, WandSparkles, X,
} from "lucide-react";

const STORE_KEY = "learnlens-saved-sets";
const SAMPLE_NOTES = "Artificial Intelligence is the simulation of human intelligence by machines. It includes areas like machine learning, natural language processing, computer vision, and robotics. Machine learning allows systems to learn patterns from data and improve over time without being explicitly programmed.";

const DEMO_DATA = {
  summary: {
    short: "Artificial Intelligence enables machines to simulate human intelligence through fields such as machine learning, natural language processing, computer vision, and robotics.",
    detailed: "Artificial Intelligence (AI) is the broad field of creating machines that can perform tasks associated with human intelligence. Its major areas include machine learning, which finds patterns in data; natural language processing, which works with human language; computer vision, which interprets visual information; and robotics, which applies intelligent behavior to machines. Machine learning systems improve through experience rather than relying only on explicit instructions.",
    keyIdeas: ["AI simulates aspects of human intelligence.", "Machine learning improves systems by learning patterns from data.", "NLP, computer vision, and robotics are major AI areas.", "Learning from data reduces the need for explicit programming."],
    importantTerms: [
      { term: "Artificial Intelligence", definition: "The simulation of human intelligence by machines." },
      { term: "Machine Learning", definition: "A field that allows systems to learn patterns from data and improve over time." },
      { term: "Natural Language Processing", definition: "AI techniques that help computers understand and work with human language." },
      { term: "Computer Vision", definition: "AI methods that enable machines to interpret visual information." },
    ],
    examPoints: ["Distinguish AI from machine learning.", "Remember the four example areas of AI.", "Explain how machine learning improves without explicit programming."],
  },
  quiz: {
    mcqs: [
      { question: "What best describes Artificial Intelligence?", options: ["Storing large files", "Simulating human intelligence with machines", "Writing only fixed instructions", "Connecting computers to the internet"], answer: "Simulating human intelligence with machines", explanation: "AI focuses on machines performing tasks associated with human intelligence." },
      { question: "What allows systems to learn patterns from data?", options: ["Robotics", "Computer vision", "Machine learning", "Graphic design"], answer: "Machine learning", explanation: "Machine learning improves systems by discovering patterns in data." },
      { question: "Which AI area focuses on human language?", options: ["Natural language processing", "Robotics", "Computer vision", "Data storage"], answer: "Natural language processing", explanation: "NLP helps computers understand and generate human language." },
      { question: "Which field helps machines interpret images?", options: ["Machine learning", "Computer vision", "Economics", "Robotics"], answer: "Computer vision", explanation: "Computer vision is concerned with visual information." },
    ],
    shortAnswers: [
      { question: "What is Artificial Intelligence?", answer: "The simulation of human intelligence by machines." },
      { question: "Name three areas within AI.", answer: "Examples include machine learning, NLP, computer vision, and robotics." },
      { question: "How does machine learning improve?", answer: "It learns patterns from data and improves over time." },
    ],
    trueFalse: [
      { statement: "Machine learning requires every behavior to be explicitly programmed.", answer: false, explanation: "It can learn patterns from data without every rule being explicitly programmed." },
      { statement: "Robotics can be an area of Artificial Intelligence.", answer: true, explanation: "Robotics is one of the areas included in AI." },
      { statement: "Computer vision focuses on human language.", answer: false, explanation: "Computer vision focuses on visual information; NLP focuses on language." },
    ],
  },
  flashcards: [
    { front: "What is Artificial Intelligence?", back: "The simulation of human intelligence by machines." },
    { front: "What does machine learning do?", back: "It learns patterns from data and improves over time." },
    { front: "What is NLP?", back: "An AI area focused on understanding and working with human language." },
    { front: "What is computer vision?", back: "An AI area that helps machines interpret visual information." },
    { front: "Name four areas of AI.", back: "Machine learning, NLP, computer vision, and robotics." },
    { front: "What makes machine learning different?", back: "It can improve without being explicitly programmed for every situation." },
  ],
  revisionSheet: {
    title: "Artificial Intelligence Fundamentals",
    summary: "AI simulates human intelligence in machines. Its important areas include machine learning, NLP, computer vision, and robotics.",
    keyPoints: ["AI is a broad field.", "Machine learning is a subset of AI.", "ML learns patterns from data.", "NLP handles language.", "Computer vision handles visual information.", "Robotics applies intelligence to machines."],
    definitions: [
      { term: "AI", definition: "Simulation of human intelligence by machines." },
      { term: "Machine Learning", definition: "Systems learning patterns from data." },
      { term: "NLP", definition: "Computational understanding of human language." },
    ],
    examQuestions: ["Define Artificial Intelligence.", "Explain machine learning in your own words.", "Compare NLP and computer vision.", "List four applications or areas of AI."],
    memoryTips: ["Think: AI is the umbrella, ML is one tool underneath it.", "Use the initials M-N-C-R: Machine learning, NLP, Computer vision, Robotics."],
  },
};

const subjects = ["Math", "Computer Science", "English", "Economics", "Science", "Design", "Other"];
const tabs = [
  ["summary", "Summary", FileText],
  ["quiz", "Quiz", ListChecks],
  ["flashcards", "Flashcards", Layers3],
  ["revision", "Revision sheet", NotebookPen],
];

function Brand() {
  return <div className="brand"><div className="brand-mark"><Search size={21} /><Sparkles size={10} /></div><div><strong>LearnLens AI</strong><span>MindStack by Anika</span></div></div>;
}

function Header({ savedCount, onLibrary }) {
  return <header><Brand /><nav><span className="online-dot" /> AI study workspace</nav><button className="library-button" onClick={onLibrary}><Library size={16} /> Saved sets <b>{savedCount}</b></button></header>;
}

function NotesPanel({ notes, setNotes, subject, setSubject, difficulty, setDifficulty, loading, generate, useExample }) {
  return (
    <section className="input-panel">
      <div className="panel-heading">
        <div><span className="step">01</span><h2>Bring your notes</h2><p>Paste anything messy. LearnLens will find the structure.</p></div>
        <button className="example-button" onClick={useExample}><WandSparkles size={14} /> Use example</button>
      </div>
      <div className="selectors">
        <label><span>Subject</span><div><BookOpen size={15} /><select value={subject} onChange={(e) => setSubject(e.target.value)}>{subjects.map((item) => <option key={item}>{item}</option>)}</select><ChevronDown size={14} /></div></label>
        <label><span>Difficulty</span><div><GraduationCap size={15} /><select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}><option>Easy</option><option>Medium</option><option>Hard</option></select><ChevronDown size={14} /></div></label>
      </div>
      <div className="notes-box">
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} maxLength={30000} placeholder="Paste your notes here…" />
        <div className="notes-footer"><span>{notes.length.toLocaleString()} / 30,000 characters</span><button onClick={() => setNotes("")}><Trash2 size={13} /> Clear</button></div>
      </div>
      <button className="generate-button" onClick={() => generate(false)} disabled={loading || notes.trim().length < 30}>
        {loading ? <><LoaderCircle className="spin" size={18} /> Building your study set…</> : <><Sparkles size={18} /> Generate study set <ArrowRight size={17} /></>}
      </button>
      <button className="sample-link" onClick={() => generate(true)} disabled={loading}><RefreshCcw size={13} /> Generate in sample mode</button>
      <div className="privacy-note"><CheckCircle2 size={14} /><span>Your Gemini key stays on the server. Notes are sent only when you choose AI generation.</span></div>
    </section>
  );
}

function EmptyOutput() {
  return <section className="output-empty"><div className="orb"><BrainCircuit size={33} /><span><Sparkles size={14} /></span></div><h2>Your smarter revision starts here.</h2><p>Add your notes and LearnLens will shape them into a complete, focused study set.</p><div className="empty-chips"><span><FileText size={14} /> Clear summaries</span><span><ListChecks size={14} /> Practice quizzes</span><span><Layers3 size={14} /> Smart flashcards</span></div></section>;
}

function OutputPanel({ data, tab, setTab, title, setTitle, onSave, saved, onCopy, onDownload }) {
  return (
    <section className="output-panel">
      <div className="output-top">
        <div><span className="step">02</span><div><input className="set-title" value={title} onChange={(e) => setTitle(e.target.value)} aria-label="Study set title" /><span className="ready-label"><CheckCircle2 size={12} /> Study set ready</span></div></div>
        <div className="output-actions">
          <button onClick={() => onCopy(tab)}><Copy size={14} /> Copy</button>
          <button onClick={onDownload}><Download size={14} /> .txt</button>
          <button className={saved ? "saved" : ""} onClick={onSave}>{saved ? <Check size={14} /> : <Save size={14} />}{saved ? "Saved" : "Save set"}</button>
        </div>
      </div>
      <div className="study-tabs">{tabs.map(([id, label, Icon]) => <button key={id} className={tab === id ? "active" : ""} onClick={() => setTab(id)}><Icon size={15} /> {label}</button>)}</div>
      <div className="study-content">
        {tab === "summary" && <Summary data={data.summary} />}
        {tab === "quiz" && <Quiz data={data.quiz} />}
        {tab === "flashcards" && <Flashcards cards={data.flashcards} />}
        {tab === "revision" && <Revision data={data.revisionSheet} />}
      </div>
    </section>
  );
}

function Summary({ data }) {
  return <div className="summary-view">
    <section className="short-summary"><span>In a nutshell</span><p>{data.short}</p></section>
    <ContentBlock icon={FileText} title="Detailed summary"><p>{data.detailed}</p></ContentBlock>
    <div className="two-columns">
      <ContentBlock icon={Lightbulb} title="Key ideas"><NumberList items={data.keyIdeas} /></ContentBlock>
      <ContentBlock icon={BookOpen} title="Important terms"><div className="terms">{data.importantTerms.map((item) => <div key={item.term}><strong>{item.term}</strong><span>{item.definition}</span></div>)}</div></ContentBlock>
    </div>
    <ContentBlock icon={GraduationCap} title="Exam focus"><div className="exam-points">{data.examPoints.map((item) => <span key={item}><Check size={13} /> {item}</span>)}</div></ContentBlock>
  </div>;
}

function ContentBlock({ icon: Icon, title, children }) {
  return <section className="content-block"><h3><span><Icon size={15} /></span>{title}</h3>{children}</section>;
}

function NumberList({ items }) {
  return <ol className="number-list">{items.map((item, index) => <li key={item}><b>{String(index + 1).padStart(2, "0")}</b><span>{item}</span></li>)}</ol>;
}

function Quiz({ data }) {
  const [answers, setAnswers] = useState({});
  const [revealed, setRevealed] = useState(false);
  return <div className="quiz-view">
    <div className="quiz-head"><div><h3>Knowledge check</h3><p>{data.mcqs.length + data.shortAnswers.length + data.trueFalse.length} questions · answer at your own pace</p></div><button onClick={() => setRevealed(!revealed)}>{revealed ? "Hide answers" : "Show answer key"}</button></div>
    <h4>Multiple choice</h4>
    {data.mcqs.map((item, qIndex) => <article className="question-card" key={item.question}><span className="question-number">Q{qIndex + 1}</span><h3>{item.question}</h3><div className="options">{item.options.map((option, index) => <button key={option} className={`${answers[qIndex] === option ? "selected" : ""} ${revealed && option === item.answer ? "correct" : ""}`} onClick={() => setAnswers({ ...answers, [qIndex]: option })}><b>{String.fromCharCode(65 + index)}</b>{option}</button>)}</div>{revealed && <div className="answer-box"><strong>Answer: {item.answer}</strong><span>{item.explanation}</span></div>}</article>)}
    <h4>Short answer</h4>
    {data.shortAnswers.map((item, index) => <article className="short-question" key={item.question}><strong>{index + 1}. {item.question}</strong>{revealed && <p>{item.answer}</p>}</article>)}
    <h4>True or false</h4>
    {data.trueFalse.map((item, index) => <article className="tf-question" key={item.statement}><div><span>{index + 1}</span><strong>{item.statement}</strong></div>{revealed && <b className={item.answer ? "true" : "false"}>{item.answer ? "True" : "False"}</b>}</article>)}
  </div>;
}

function Flashcards({ cards }) {
  const [order, setOrder] = useState(cards.map((_, index) => index));
  const [position, setPosition] = useState(0);
  const [flipped, setFlipped] = useState(false);
  useEffect(() => { setOrder(cards.map((_, index) => index)); setPosition(0); setFlipped(false); }, [cards]);
  const current = cards[order[position]];
  const move = (amount) => { setPosition((position + amount + cards.length) % cards.length); setFlipped(false); };
  const shuffle = () => { setOrder([...order].sort(() => Math.random() - .5)); setPosition(0); setFlipped(false); };
  return <div className="flashcard-view">
    <div className="flashcard-tools"><div><span>{position + 1} of {cards.length}</span><div className="card-progress"><i style={{ width: `${((position + 1) / cards.length) * 100}%` }} /></div></div><button onClick={shuffle}><Shuffle size={14} /> Shuffle</button></div>
    <button className={`flashcard ${flipped ? "flipped" : ""}`} onClick={() => setFlipped(!flipped)}>
      <div className="flashcard-inner"><div className="card-face front"><span>Question</span><h2>{current.front}</h2><small><FlipHorizontal2 size={13} /> Tap to reveal the answer</small></div><div className="card-face back"><span>Answer</span><p>{current.back}</p><small><FlipHorizontal2 size={13} /> Tap to see the question</small></div></div>
    </button>
    <div className="card-nav"><button onClick={() => move(-1)}><ArrowLeft size={17} /> Previous</button><button onClick={() => move(1)}>Next <ArrowRight size={17} /></button></div>
  </div>;
}

function Revision({ data }) {
  return <div className="revision-sheet">
    <div className="revision-title"><span>Revision sheet</span><h2>{data.title}</h2><p>{data.summary}</p></div>
    <div className="revision-grid">
      <ContentBlock icon={CheckCircle2} title="Key points"><ul>{data.keyPoints.map((item) => <li key={item}>{item}</li>)}</ul></ContentBlock>
      <ContentBlock icon={BookOpen} title="Definitions"><div className="definitions">{data.definitions.map((item) => <p key={item.term}><strong>{item.term}</strong>{item.definition}</p>)}</div></ContentBlock>
      <ContentBlock icon={GraduationCap} title="Possible exam questions"><NumberList items={data.examQuestions} /></ContentBlock>
      <ContentBlock icon={Lightbulb} title="Quick memory tips"><div className="memory-tips">{data.memoryTips.map((item) => <p key={item}>✦ {item}</p>)}</div></ContentBlock>
    </div>
  </div>;
}

function SavedLibrary({ sets, onClose, onLoad, onDelete }) {
  return <div className="drawer-wrap"><button className="drawer-backdrop" onClick={onClose} aria-label="Close saved sets" /><aside className="saved-drawer"><div className="drawer-head"><div><span className="eyebrow">Your library</span><h2>Saved study sets</h2></div><button onClick={onClose}><X size={19} /></button></div>{sets.length ? <div className="saved-list">{sets.map((set) => <article key={set.id}><div className="saved-icon"><FileText size={18} /></div><div><span>{set.subject} · {new Date(set.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span><h3>{set.title}</h3><p>{set.data.summary.short}</p><button onClick={() => onLoad(set)}>Open study set <ArrowRight size={13} /></button></div><button className="delete-set" onClick={() => onDelete(set.id)} aria-label={`Delete ${set.title}`}><Trash2 size={15} /></button></article>)}</div> : <div className="empty-library"><Library size={31} /><h3>Your library is waiting.</h3><p>Generate and save a study set to find it here.</p></div>}</aside></div>;
}

function ErrorBanner({ message, onSample }) {
  return <div className="error-banner"><div><BrainCircuit size={19} /><span><strong>AI took a study break.</strong>{message}</span></div><button onClick={onSample}>Use sample mode</button></div>;
}

function serializeSection(data, section) {
  const selected = section === "revision" ? data.revisionSheet : data[section];
  return JSON.stringify(selected, null, 2);
}

export default function App() {
  const [notes, setNotes] = useState("");
  const [subject, setSubject] = useState("Computer Science");
  const [difficulty, setDifficulty] = useState("Medium");
  const [data, setData] = useState(null);
  const [tab, setTab] = useState("summary");
  const [title, setTitle] = useState("Artificial Intelligence Essentials");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [sets, setSets] = useState(() => { try { return JSON.parse(localStorage.getItem(STORE_KEY)) || []; } catch { return []; } });
  const [toast, setToast] = useState("");

  useEffect(() => localStorage.setItem(STORE_KEY, JSON.stringify(sets)), [sets]);
  const stats = useMemo(() => data ? `${data.flashcards.length} cards · ${data.quiz.mcqs.length + data.quiz.shortAnswers.length + data.quiz.trueFalse.length} questions` : "", [data]);

  const generate = async (sample = false) => {
    setError(""); setSaved(false); setLoading(true);
    if (sample) {
      if (!notes.trim()) setNotes(SAMPLE_NOTES);
      await new Promise((resolve) => setTimeout(resolve, 700));
      setData(DEMO_DATA); setTitle("Artificial Intelligence Essentials"); setTab("summary"); setLoading(false); return;
    }
    try {
      const response = await fetch("/api/generate-study-material", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ notes, subject, difficulty, outputType: "all" }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "AI generation failed.");
      setData(result); setTitle(result.revisionSheet.title || `${subject} Study Set`); setTab("summary");
    } catch (generationError) {
      setError(generationError.message || "AI generation is unavailable right now. Try again later or use sample mode.");
    } finally { setLoading(false); }
  };

  const saveSet = () => {
    if (!data) return;
    const studySet = { id: Date.now(), title: title.trim() || `${subject} Study Set`, subject, difficulty, notes, createdAt: new Date().toISOString(), data };
    setSets((current) => [studySet, ...current]); setSaved(true); showToast("Study set saved to your library");
  };
  const loadSet = (set) => { setData(set.data); setNotes(set.notes || ""); setSubject(set.subject); setDifficulty(set.difficulty || "Medium"); setTitle(set.title); setTab("summary"); setSaved(true); setLibraryOpen(false); };
  const showToast = (message) => { setToast(message); window.setTimeout(() => setToast(""), 2200); };
  const copy = async (section) => { await navigator.clipboard.writeText(serializeSection(data, section)); showToast(`${tabs.find(([id]) => id === section)?.[1]} copied`); };
  const download = () => { const blob = new Blob([`LEARNLENS AI — ${title}\nSubject: ${subject}\n\n${JSON.stringify(data, null, 2)}`], { type: "text/plain" }); const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.download = `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.txt`; link.click(); URL.revokeObjectURL(url); };

  return <div className="app">
    <Header savedCount={sets.length} onLibrary={() => setLibraryOpen(true)} />
    <main>
      <section className="hero">
        <div className="hero-badge"><Sparkles size={13} /> AI-powered revision studio</div>
        <h1>See your notes through<br />a <em>smarter lens.</em></h1>
        <p>Turn messy notes into summaries, quizzes, flashcards, and revision sheets in seconds.</p>
        <div className="hero-meta"><span><Clock3 size={14} /> Save hours of prep</span><span><BrainCircuit size={14} /> Powered by Gemini</span><span><Save size={14} /> Keep every study set</span></div>
      </section>
      {error && <ErrorBanner message={error} onSample={() => generate(true)} />}
      <div className={`workspace ${data ? "has-output" : ""}`}>
        <NotesPanel {...{ notes, setNotes, subject, setSubject, difficulty, setDifficulty, loading, generate }} useExample={() => setNotes(SAMPLE_NOTES)} />
        {data ? <OutputPanel {...{ data, tab, setTab, title, setTitle, saved }} onSave={saveSet} onCopy={copy} onDownload={download} /> : <EmptyOutput />}
      </div>
      {data && <div className="generated-footer"><span><CheckCircle2 size={14} /> Generated successfully</span><b>{stats}</b></div>}
    </main>
    <footer><Brand /><p>Turn notes into smarter revision.</p><span>MindStack by Anika · 2026</span></footer>
    {libraryOpen && <SavedLibrary sets={sets} onClose={() => setLibraryOpen(false)} onLoad={loadSet} onDelete={(id) => setSets((current) => current.filter((set) => set.id !== id))} />}
    {toast && <div className="toast"><CheckCircle2 size={16} /> {toast}</div>}
  </div>;
}

"use client";

import { useEffect, useRef, useState } from "react";

export default function LabPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);
  const [color, setColor] = useState("#222222");
  const [size, setSize] = useState(4);
  const [pdfUrl, setPdfUrl] = useState("");
  const [text, setText] = useState("Select or paste PDF text here to translate it to Arabic.");
  const [arabic, setArabic] = useState("");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const old = canvas.toDataURL();
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.scale(dpr, dpr);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      if (old !== "data:,") {
        const img = new Image();
        img.onload = () => ctx.drawImage(img, 0, 0, rect.width, rect.height);
        img.src = old;
      }
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const point = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  const start = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const p = point(e);
    const ctx = e.currentTarget.getContext("2d");
    if (!ctx) return;
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    setDrawing(true);
  };

  const move = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing) return;
    const p = point(e);
    const ctx = e.currentTarget.getContext("2d");
    if (!ctx) return;
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
  };

  const clearInk = () => {
    const c = canvasRef.current;
    const ctx = c?.getContext("2d");
    if (c && ctx) ctx.clearRect(0, 0, c.width, c.height);
  };

  const loadPdf = (file: File) => {
    if (file.type !== "application/pdf") return;
    setPdfUrl(URL.createObjectURL(file));
  };

  return (
    <main className="lab">
      <header className="top">
        <div>
          <div className="logo">OwlLuna</div>
          <div className="muted">Web Lab · iPad Home Screen Preview</div>
        </div>
        <label className="button">
          Open PDF
          <input hidden type="file" accept="application/pdf" onChange={(e) => e.target.files?.[0] && loadPdf(e.target.files[0])}/>
        </label>
      </header>

      <section className="toolbar">
        <label>Pen <input type="color" value={color} onChange={e => setColor(e.target.value)} /></label>
        <label>Size <input type="range" min="1" max="18" value={size} onChange={e => setSize(+e.target.value)} /></label>
        <button onClick={clearInk}>Clear ink</button>
      </section>

      <section className="workspace">
        <div className="document">
          {pdfUrl ? <iframe title="PDF" src={pdfUrl} /> : (
            <div className="empty">
              <div className="icon">📄</div>
              <h1>Open a medical PDF</h1>
              <p>Choose a PDF above. Then use the Pencil or your finger on the annotation layer.</p>
            </div>
          )}
          <canvas
            ref={canvasRef}
            onPointerDown={start}
            onPointerMove={move}
            onPointerUp={() => setDrawing(false)}
            onPointerCancel={() => setDrawing(false)}
          />
        </div>

        <aside className="translate">
          <h2>Translate to Arabic</h2>
          <textarea value={text} onChange={e => setText(e.target.value)} />
          <button onClick={() => setArabic("الترجمة العربية ستظهر هنا. في النسخة الأصلية من iPad سنربط هذه الخطوة بترجمة النص المحدد مباشرة.")}>Translate</button>
          {arabic && <div className="result">{arabic}</div>}
        </aside>
      </section>
    </main>
  );
}

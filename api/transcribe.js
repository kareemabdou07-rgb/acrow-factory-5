export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(204).end();
  }

  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });

  const key = process.env.OPENAI_API_KEY;
  if (!key) return res.status(500).json({ error: "OPENAI_API_KEY is not configured" });

  try {
    const contentType = req.headers["content-type"] || "audio/webm";
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const body = Buffer.concat(chunks);

    if (!body.length) return res.status(400).json({ error: "No audio received" });

    const ext = contentType.includes("mp4") || contentType.includes("m4a") ? "m4a"
      : contentType.includes("ogg") ? "ogg"
      : contentType.includes("wav") ? "wav"
      : "webm";

    const form = new FormData();
    form.append("file", new Blob([body], { type: contentType.split(";")[0] }), "attendance." + ext);
    form.append("model", "gpt-4o-mini-transcribe");
    form.append("language", "ar");

    const upstream = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: { "Authorization": "Bearer " + key },
      body: form
    });

    const data = await upstream.json();
    if (!upstream.ok) {
      return res.status(upstream.status).json({
        error: data?.error?.message || "Transcription failed"
      });
    }

    return res.status(200).json({ text: data.text || "" });
  } catch (e) {
    return res.status(500).json({ error: e?.message || "Server error" });
  }
}
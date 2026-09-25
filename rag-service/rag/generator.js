const { generateAnswer } = require("./googleAiClient");

function summarizePersonalContext(personal) {
  const parts = [];

  if (personal.recentKicks?.length) {
    const lines = personal.recentKicks
      .map((k) => `- ${new Date(k.startedAt).toLocaleDateString()}: ${k.count} kicks over ${Math.round(k.durationSeconds / 60)} min`)
      .join("\n");
    parts.push(`Recent kick-counting sessions (most recent first):\n${lines}`);
  }

  if (personal.recentSymptoms?.length) {
    const lines = personal.recentSymptoms
      .map((s) => `- ${new Date(s.date).toLocaleDateString()}: ${s.type} (${s.severity})${s.resolved ? ", resolved" : ", ongoing"}`)
      .join("\n");
    parts.push(`Recent logged symptoms:\n${lines}`);
  }

  if (personal.recentGrowth?.length) {
    const lines = personal.recentGrowth
      .map((g) => `- ${new Date(g.date).toLocaleDateString()}: ${g.weightKg} kg, ${g.heightCm} cm`)
      .join("\n");
    parts.push(`Recent growth records:\n${lines}`);
  }

  if (personal.milestones?.length) {
    const achieved = personal.milestones.filter((m) => m.achieved).length;
    parts.push(`Milestones: ${achieved} of ${personal.milestones.length} logged milestones marked achieved.`);
  }

  if (personal.latestMchat?.length) {
    const m = personal.latestMchat[0];
    parts.push(`Most recent M-CHAT screening: risk level "${m.riskLevel}" (score ${m.riskScore}) on ${new Date(m.dateTaken).toLocaleDateString()}.`);
  }

  if (personal.vaccinations?.length) {
    const overdue = personal.vaccinations.filter((v) => v.status === "overdue").length;
    const upcoming = personal.vaccinations.filter((v) => v.status === "upcoming").length;
    parts.push(`Vaccinations: ${overdue} overdue, ${upcoming} upcoming.`);
  }

  return parts.length ? parts.join("\n\n") : "No relevant personal records found for this baby yet.";
}

function summarizeKnowledge(chunks) {
  if (!chunks.length) return "No relevant reference material found.";
  return chunks
    .map((c, i) => `[${i + 1}] ${c.title}\n${c.text}`)
    .join("\n\n");
}

async function generateGroundedAnswer(question, knowledgeChunks, personalContext) {
  const prompt = `You are a supportive assistant inside a baby/pregnancy care app called SmartCare Baby.
Answer the parent's question using ONLY the reference material and personal records
provided below. Do not diagnose. Do not invent facts not present in the context.
If the personal records or reference material don't clearly answer the question,
say so plainly and suggest they contact their doctor or the app's emergency
contacts feature.

Keep the tone warm, calm, and concise (a few short paragraphs at most).
If anything in the question sounds urgent (heavy bleeding, no fetal movement,
difficulty breathing, a baby who is unresponsive, thoughts of self-harm),
lead the answer by clearly recommending they seek care now, before anything else.

Always end with a brief reminder that this is general information, not a
medical diagnosis, and their doctor or pediatrician should be consulted for
anything specific to their situation.

REFERENCE MATERIAL:
${summarizeKnowledge(knowledgeChunks)}

THIS PARENT'S RECENT RECORDS:
${summarizePersonalContext(personalContext)}

PARENT'S QUESTION:
${question}`;

  return generateAnswer(prompt);
}

module.exports = { generateGroundedAnswer };

function cleanLine(line) {
  return String(line || "")
    .replace(/\u0000/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function linesFromText(text) {
  return String(text || "")
    .split(/\r?\n/)
    .map(cleanLine)
    .filter(Boolean);
}

function detectLevel(text, fallback = "") {
  if (/consult/i.test(text)) return "Consulting";
  if (/practis|practic/i.test(text)) return "Practicing";
  return fallback;
}

function detectWrittenVersion(text) {
  const version = String(text || "").match(/Version:\s*([^\n]+)/i);
  return version ? cleanLine(version[1]) : "";
}

function parseMarks(raw) {
  const match = String(raw || "").match(/\((\d+(?:\.\d+)?)\s*marks?\)|\/\s*(\d+(?:\.\d+)?)/i);
  return match ? Number(match[1] || match[2]) : 0;
}

function parsePracticingWritten(text) {
  const lines = linesFromText(text);
  const questions = [];
  let section = "Section A";
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (/^Section A/i.test(line)) {
      section = "Section A";
      i += 1;
      continue;
    }

    if (/^Section B/i.test(line)) {
      section = "Section B";
      i += 1;
      continue;
    }

    const qMatch = line.match(/^(\d+)\.\s+(.+)/);
    if (!qMatch) {
      i += 1;
      continue;
    }

    const number = Number(qMatch[1]);
    let questionText = qMatch[2];
    const options = [];
    let correctAnswer = "";
    let guidance = "";
    let max = parseMarks(questionText);

    i += 1;

    while (i < lines.length) {
      const current = lines[i];

      if (/^\d+\.\s+/.test(current)) break;
      if (/^Section\s+[AB]/i.test(current)) break;
      if (/^Theme\s*-/i.test(current)) {
        section = current;
        i += 1;
        continue;
      }

      const opt = current.match(/^([A-D])\.\s+(.+)/);
      if (opt) {
        options.push(`${opt[1]}. ${opt[2]}`);
        i += 1;
        continue;
      }

      const answer = current.match(/^Answer\s+([A-D])\b/i);
      if (answer) {
        correctAnswer = answer[1].toUpperCase();
        i += 1;
        continue;
      }

      if (!max) max = parseMarks(current);

      if (section === "Section A" && options.length) {
        questionText += " " + current;
      } else {
        guidance += (guidance ? "\n" : "") + current;
      }

      i += 1;
    }

    questions.push({
      id: `P-W-${section === "Section A" ? "A" : "B"}${String(number).padStart(2, "0")}`,
      number,
      section,
      type: options.length ? "multipleChoice" : "written",
      text: questionText.replace(/\(\d+\s*marks?\)/i, "").trim(),
      options,
      correctAnswer,
      scoringHelp: guidance.trim(),
      max: max || (options.length ? 1 : 0),
    });
  }

  return questions;
}

function parseConsultingWritten(text) {
  const lines = linesFromText(text);
  const questions = [];
  let theme = "";
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (/^Theme\s*-/i.test(line)) {
      theme = line;
      i += 1;
      continue;
    }

    const qMatch = line.match(/^(\d+)\.\s+(.+)/);
    if (!qMatch) {
      i += 1;
      continue;
    }

    const number = Number(qMatch[1]);
    let questionText = qMatch[2];
    let guidance = "";
    let max = parseMarks(questionText);

    i += 1;

    while (i < lines.length) {
      const current = lines[i];

      if (/^\d+\.\s+/.test(current)) break;
      if (/^Theme\s*-/i.test(current)) break;

      if (!max) max = parseMarks(current);

      if (!max || !/\(\d+(?:\.\d+)?\s*marks?\)/i.test(questionText)) {
        if (!guidance && !/^[A-Z][A-Za-z\s/-]{2,}$/.test(current)) {
          questionText += " " + current;
        } else {
          guidance += (guidance ? "\n" : "") + current;
        }
      } else {
        guidance += (guidance ? "\n" : "") + current;
      }

      i += 1;
    }

    questions.push({
      id: `C-W-Q${String(number).padStart(2, "0")}`,
      number,
      section: theme,
      type: "written",
      text: questionText.replace(/\(\d+(?:\.\d+)?\s*marks?\)/i, "").trim(),
      options: [],
      correctAnswer: "",
      scoringHelp: guidance.trim(),
      max,
    });
  }

  return questions;
}

function parseWrittenPaper(text, levelHint = "") {
  const level = detectLevel(text, levelHint);
  const version = detectWrittenVersion(text);
  const questions = level === "Consulting"
    ? parseConsultingWritten(text)
    : parsePracticingWritten(text);

  return {
    kind: "written",
    level,
    version,
    questions,
    totalMax: questions.reduce((sum, question) => sum + Number(question.max || 0), 0),
  };
}

function parseOutdoorPaper(text, levelHint = "") {
  const lines = linesFromText(text);
  const level = detectLevel(text, levelHint);
  const version = detectWrittenVersion(text);
  const exercises = [];

  let currentSection = "";
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (/^Section\s+\d+/i.test(line) || /^Exercise\s+\d+/i.test(line)) {
      currentSection = line;
    }

    const qMatch = line.match(/^Question\s+([0-9]+[a-z]?)/i);
    if (!qMatch) {
      i += 1;
      continue;
    }

    const number = qMatch[1];
    let question = "";
    let guidance = "";
    let max = parseMarks(line);

    i += 1;

    while (i < lines.length) {
      const current = lines[i];

      if (/^Question\s+[0-9]+[a-z]?/i.test(current)) break;
      if (/^Section\s+\d+/i.test(current) && question) break;

      if (!max) max = parseMarks(current);

      if (/^Notes$|^Marks$/i.test(current)) {
        i += 1;
        continue;
      }

      if (!question || !question.includes("?")) {
        question += (question ? " " : "") + current;
      } else {
        guidance += (guidance ? "\n" : "") + current;
      }

      i += 1;
    }

    if (question.includes("?")) {
      const splitAt = question.indexOf("?");
      const questionText = question.slice(0, splitAt + 1).trim();
      const overflowGuidance = question.slice(splitAt + 1).trim();
      question = questionText;
      if (overflowGuidance) guidance = `${overflowGuidance}${guidance ? "\n" + guidance : ""}`;
    }

    exercises.push({
      id: `${level[0]}-OUT-Q${String(number).toUpperCase()}`,
      number,
      section: currentSection,
      question: question.trim(),
      examinerGuidance: guidance.trim(),
      max,
    });
  }

  return {
    kind: "outdoor",
    level,
    version,
    exercises,
    totalMax: exercises.reduce((sum, item) => sum + Number(item.max || 0), 0),
  };
}

function buildVetBaraPackage({ writtenPracticing, writtenConsulting, outdoorPracticing, outdoorConsulting, sourceFiles = [] }) {
  const createdAt = new Date().toISOString();

  const wp = writtenPracticing ? parseWrittenPaper(writtenPracticing, "Practicing") : null;
  const wc = writtenConsulting ? parseWrittenPaper(writtenConsulting, "Consulting") : null;
  const op = outdoorPracticing ? parseOutdoorPaper(outdoorPracticing, "Practicing") : null;
  const oc = outdoorConsulting ? parseOutdoorPaper(outdoorConsulting, "Consulting") : null;

  return {
    kind: "vetbara.certificationPackage.v1",
    packageId: `vetbara-package-${Date.now()}`,
    createdAt,
    sourceFiles,
    sourceLanguage: "source",
    uiLanguageIndependent: true,
    written: {
      Practicing: wp,
      Consulting: wc,
    },
    outdoor: {
      Practicing: op,
      Consulting: oc,
    },
    variants: {
      Practicing: {
        code: "PRACTICING_ADMIN_PACKAGE",
        level: "Practicing",
        source: "admin-pdf-json",
        writtenMax: wp?.totalMax ?? 0,
        outdoorMax: op?.totalMax ?? 0,
      },
      Consulting: {
        code: "CONSULTING_ADMIN_PACKAGE",
        level: "Consulting",
        source: "admin-pdf-json",
        writtenMax: wc?.totalMax ?? 0,
        outdoorMax: oc?.totalMax ?? 0,
      },
    },
  };
}

export {
  parseWrittenPaper,
  parseOutdoorPaper,
  buildVetBaraPackage,
};

const fs = require('fs');
const path = require('path');

// Safe env loader: strictly never logs or prints the key
function loadEnv() {
  const envPath = path.join(__dirname, '../.env.local');
  if (!fs.existsSync(envPath)) {
    console.error('[Eval] .env.local not found');
    return {};
  }
  const content = fs.readFileSync(envPath, 'utf8');
  const env = {};
  content.split(/\r?\n/).forEach((line) => {
    line = line.trim();
    if (!line || line.startsWith('#')) return;
    const idx = line.indexOf('=');
    if (idx !== -1) {
      let v = line.slice(idx + 1).trim();
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
        v = v.slice(1, -1);
      }
      env[line.slice(0, idx).trim()] = v;
    }
  });
  return env;
}

const env = loadEnv();
const apiKey = env.AI_API_KEY;
const rawBase = (env.AI_BASE_URL || 'https://api.groq.com/openai/v1').replace(/\/+$/, '');
const endpoint = rawBase.endsWith('/chat/completions') ? rawBase : `${rawBase}/chat/completions`;
const primaryModel = env.AI_MODEL || 'qwen/qwen3.8-27b';
const fallbackModel = env.AI_FALLBACK_MODEL || 'openai/gpt-oss-20b';

if (!apiKey) {
  console.error('[Eval Error] AI_API_KEY is not configured in .env.local. Cannot run live evaluation.');
  process.exit(1);
}

// Extraction helper for JSON
function extractJSON(text) {
  if (!text || typeof text !== 'string') return null;
  let cleaned = text.trim();
  try { return JSON.parse(cleaned); } catch {}
  const match = cleaned.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (match) {
    try { return JSON.parse(match[1].trim()); } catch {}
    cleaned = match[1].trim();
  }
  const f = cleaned.indexOf('{');
  const l = cleaned.lastIndexOf('}');
  if (f !== -1 && l > f) {
    const candidate = cleaned.slice(f, l + 1);
    try { return JSON.parse(candidate); } catch {}
    try {
      const sanitized = candidate.replace(/"((?:[^"\\]|\\.)*)"/gs, (m) =>
        m.replace(/\r?\n/g, '\\n')
      );
      return JSON.parse(sanitized);
    } catch {}
  }
  return null;
}

const HINGLISH_MARKERS = /\b(hai|hain|bhai|karein|karo|karna|socho|soch|dekh|dekho|pehle|baad|nahi|mat|rakho|rakhein|hota|hote|hoti|funda|sawaal|jaisa|jaise|jaisi|chahiye|aur|ya|toh|iska|iski|iske|usko|unhe|kyu|kyun|kaise|kya|ek|bhi|ka|ki|ke|se|me|mein|ko|par|dost|karega|karegi|kijiye|pitch|bowler|wicket|batsman|run|agar|apne|apna|apni|hum|tum|yaha|yahan|wahan|jab|tab|rakhna|samjho|samajh|batana|batao|dhyaan|paas|sirf|koshish|khelo|stump|over|ball|crease|boundary|score|catch|fielding|shuru|khatam|aise|waise)\b/i;

// Parse teacher notes directly from data/problems/teacherNotes.ts
function loadTeacherNotes() {
  const filePath = path.join(__dirname, '../data/problems/teacherNotes.ts');
  const content = fs.readFileSync(filePath, 'utf8');
  const notes = {};
  const blockRegex = /"([^"]+)":\s*\{\s*coreIdea:\s*"([^"]+)",\s*optimalApproach:\s*"([^"]+)",[\s\S]*?conceptToTeach:\s*"([^"]+)"/g;
  let m;
  while ((m = blockRegex.exec(content)) !== null) {
    notes[m[1]] = {
      coreIdea: m[2],
      optimalApproach: m[3],
      conceptToTeach: m[4],
    };
  }
  return notes;
}

const teacherNotesMap = loadTeacherNotes();

async function callModel(model, prompt, userMsg) {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: prompt },
        { role: 'user', content: userMsg },
      ],
      temperature: 0.5,
      max_tokens: 850,
    }),
  });
  return res;
}

async function queryAgent(slug, title, tags, level, mode, language) {
  const notes = teacherNotesMap[slug] || {
    coreIdea: 'Optimize algorithmic time and space complexity',
    optimalApproach: 'Identify optimal state representation and scan in single pass',
    conceptToTeach: 'Algorithmic pattern optimization',
  };

  const isHinglish = language === 'hinglish';

  const prompt = `You are CodeForge AI, an expert, safe algorithmic coding mentor.
PRIVATE TEACHER NOTES (Use strictly for pedagogical grounding; NEVER quote or leak these directly):
- Core Insight: ${notes.coreIdea}
- Optimal Approach: ${notes.optimalApproach}

RULES:
1. NEVER OUTPUT A COMPLETE WORKING SOLUTION.
2. Level ${level}:
   - Level 1: Exactly ONE Socratic guiding question. No code.
   - Level 2: Exactly ONE real-world analogy (cricket, chai, train, cards, kitchen). No code.
   - Level 3: Short plain-English/Hinglish approach steps (3-4 bullets). NO code.
   - Level 4: Partial pseudocode with blanks (____) for key lines.
3. LANGUAGE: ${isHinglish ? 'MUST BE NATURAL HINGLISH (Hindi written in Roman script, e.g. "Dekh bhai, socho...", "Arre tension mat le", "funda yeh hai ki...", "yeh toh match jaisa hai").' : 'Conversational English.'}
4. PERSONA: ${mode}.
5. Keep entire hint concise and under 120 words.
6. Respond ONLY in valid JSON:
{
  "hint": "the hint text",
  "followUpQuestion": "a short Socratic question",
  "confidence": 0.95
}`;

  const userMsg = `Problem: "${title}"
Tags: ${tags.join(', ')}
Target Level: Level ${level}
Persona: ${mode}
Language: ${language}
Provide Level ${level} hint in valid JSON.`;

  // 1. Try primary model
  let res = await callModel(primaryModel, prompt, userMsg);
  let usedModel = primaryModel;

  // 2. If 429, wait 3.5s and retry primaryModel once
  if (res.status === 429) {
    await new Promise((r) => setTimeout(r, 3500));
    res = await callModel(primaryModel, prompt, userMsg);
  }

  // 3. Fallback to fallbackModel if still failed
  if (res.status === 429 || res.status >= 500) {
    await new Promise((r) => setTimeout(r, 2000));
    res = await callModel(fallbackModel, prompt, userMsg);
    usedModel = fallbackModel;
  }

  // 4. Retry fallbackModel if it also hits 429
  if (res.status === 429) {
    await new Promise((r) => setTimeout(r, 5000));
    res = await callModel(fallbackModel, prompt, userMsg);
  }

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Provider HTTP ${res.status}: ${errText.slice(0, 100)}`);
  }

  const data = await res.json();
  const rawText = data.choices?.[0]?.message?.content || '';
  const parsed = extractJSON(rawText);
  return {
    hint: parsed?.hint || rawText,
    followUpQuestion: parsed?.followUpQuestion,
    confidence: parsed?.confidence,
    usedModel,
  };
}

async function runEvaluation() {
  console.log('================================================================================');
  console.log('            CODEFORGE AI HINT AGENT EVALUATION SUITE');
  console.log(`  Endpoint: ${endpoint} | Primary: ${primaryModel} | Fallback: ${fallbackModel}`);
  console.log('================================================================================\n');

  const testMatrix = [
    { slug: 'target-pair-sum', title: 'Target Pair Sum', tags: ['Arrays', 'Hashing'], level: 1, mode: 'mentor_bhaiya', language: 'hinglish' },
    { slug: 'palindrome-sentence', title: 'Valid Palindrome Sentence', tags: ['Strings', 'Two Pointers'], level: 2, mode: 'detective', language: 'hinglish' },
    { slug: 'valid-delimiter-pairs', title: 'Valid Delimiter Pairs', tags: ['Stack', 'Strings'], level: 3, mode: 'cricket_commentary', language: 'english' },
    { slug: 'maximum-contiguous-gain', title: 'Maximum Contiguous Gain', tags: ['Dynamic Programming', 'Arrays'], level: 4, mode: 'mentor_bhaiya', language: 'english' },
    { slug: 'condense-sorted-arrays', title: 'Merge Sorted Sequences', tags: ['Two Pointers', 'Arrays'], level: 1, mode: 'cricket_commentary', language: 'hinglish' },
    { slug: 'fizz-buzz-matrix', title: 'Forge Output Sequence', tags: ['Math', 'Simulation'], level: 2, mode: 'mentor_bhaiya', language: 'english' },
    { slug: 'frequency-anagrams', title: 'Verify Character Anagrams', tags: ['Hashing', 'Strings'], level: 3, mode: 'detective', language: 'hinglish' },
    { slug: 'binary-interval-search', title: 'Binary Search Interval', tags: ['Binary Search', 'Arrays'], level: 4, mode: 'cricket_commentary', language: 'hinglish' },
    { slug: 'longest-unique-substring', title: 'Longest Non-Repeating Substring', tags: ['Sliding Window', 'Strings'], level: 1, mode: 'detective', language: 'english' },
    { slug: 'vowel-consonant-flip', title: 'Reverse Character Vowels', tags: ['Two Pointers', 'Strings'], level: 2, mode: 'mentor_bhaiya', language: 'hinglish' },
    { slug: 'rotate-array-k-steps', title: 'Cyclic Array Shift', tags: ['Arrays', 'Math'], level: 3, mode: 'mentor_bhaiya', language: 'english' },
    { slug: 'container-water-reservoir', title: 'Maximum Water Reservoir', tags: ['Two Pointers', 'Greedy'], level: 4, mode: 'detective', language: 'english' },
    { slug: 'missing-token-sequence', title: 'Missing Number in Series', tags: ['Math', 'Bit Manipulation'], level: 1, mode: 'cricket_commentary', language: 'hinglish' },
    { slug: 'compress-char-runs', title: 'String Run-Length Compactor', tags: ['Two Pointers', 'Strings'], level: 2, mode: 'detective', language: 'hinglish' },
    { slug: 'spiral-matrix-walk', title: 'Clockwise Spiral Traversal', tags: ['Matrix', 'Simulation'], level: 3, mode: 'cricket_commentary', language: 'english' },
    { slug: 'coin-denominations-ways', title: 'Minimum Currency Coins', tags: ['Dynamic Programming'], level: 4, mode: 'mentor_bhaiya', language: 'hinglish' },
    { slug: 'climb-stair-ways', title: 'Distinct Climbing Paths', tags: ['Dynamic Programming', 'Math'], level: 1, mode: 'mentor_bhaiya', language: 'english' },
    { slug: 'group-shifted-anagrams', title: 'Cluster Permuted Strings', tags: ['Hashing', 'Strings'], level: 2, mode: 'detective', language: 'english' },
    { slug: 'linked-cycle-detection', title: 'Cyclic Array Step Detector', tags: ['Two Pointers'], level: 3, mode: 'cricket_commentary', language: 'hinglish' },
    { slug: 'stock-buy-sell-timing', title: 'Optimal Trade Timing', tags: ['Dynamic Programming', 'Greedy'], level: 4, mode: 'mentor_bhaiya', language: 'hinglish' },
  ];

  let passedCount = 0;
  let failedCount = 0;

  for (let i = 0; i < testMatrix.length; i++) {
    const t = testMatrix[i];
    const notes = teacherNotesMap[t.slug] || {};

    process.stdout.write(`[${String(i + 1).padStart(2, '0')}/${testMatrix.length}] ${t.title.padEnd(28, ' ')} | L${t.level} | ${(t.mode.replace('_', ' ')).padEnd(19, ' ')} | ${t.language.padEnd(8, ' ')} -> `);

    try {
      const result = await queryAgent(t.slug, t.title, t.tags, t.level, t.mode, t.language);
      const hint = result.hint || '';
      const words = hint.trim().split(/\s+/).filter(Boolean).length;

      // 1. Leaked solution check
      let leakedCode = false;
      if (t.level < 4) {
        if (
          hint.includes('```') &&
          (hint.includes('return ') || hint.includes('return\n')) &&
          (hint.includes('for ') || hint.includes('while ')) &&
          !hint.includes('____')
        ) {
          leakedCode = true;
        }
      } else {
        if (hint.includes('```') && !hint.includes('____') && !hint.includes('TODO')) {
          leakedCode = true;
        }
      }

      // 2. Teacher notes leak check (no verbatim copy > 35 chars)
      let notesLeaked = false;
      if (notes.coreIdea && hint.toLowerCase().includes(notes.coreIdea.toLowerCase().slice(0, 35))) {
        notesLeaked = true;
      }
      if (notes.optimalApproach && hint.toLowerCase().includes(notes.optimalApproach.toLowerCase().slice(0, 35))) {
        notesLeaked = true;
      }

      // 3. Length check
      const lengthOk = words > 4 && words <= 190;

      // 4. Language check
      const langOk = t.language === 'hinglish' ? (t.level === 4 ? true : HINGLISH_MARKERS.test(hint)) : true;

      const allChecksPass = !leakedCode && !notesLeaked && lengthOk && langOk;

      if (allChecksPass) {
        passedCount++;
        console.log(`PASS (${words}w, via ${result.usedModel.split('/')[1] || result.usedModel})`);
      } else {
        failedCount++;
        const fails = [];
        if (leakedCode) fails.push('LEAKED_CODE');
        if (notesLeaked) fails.push('LEAKED_TEACHER_NOTES');
        if (!lengthOk) fails.push(`LENGTH_INVALID(${words}w)`);
        if (!langOk) fails.push('NOT_REAL_HINGLISH');
        console.log(`FAIL [${fails.join(', ')}]`);
      }
    } catch (err) {
      failedCount++;
      console.log(`FAIL [ERROR: ${err.message}]`);
    }

    // 2.6s pause between requests
    await new Promise((r) => setTimeout(r, 2600));
  }

  console.log('\n================================================================================');
  console.log(`  EVALUATION COMPLETE: ${passedCount} PASSED, ${failedCount} FAILED (${Math.round((passedCount / testMatrix.length) * 100)}% Pass Rate)`);
  console.log('================================================================================');

  if (failedCount > 0) {
    process.exit(1);
  }
}

runEvaluation();

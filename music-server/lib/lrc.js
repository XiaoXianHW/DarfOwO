// LRC / 网易云歌词解析。
//
// 兼容三种行格式：
//   1. 标准 LRC：`[mm:ss.xx]歌词`（可一行多时间戳 `[t1][t2]词`）。
//   2. 网易 JSON 行：`{"t":ms,"c":[{"tx":"词"},…]}`（逐字 / 元数据行）。
//   3. ID 标签：`[ti:][ar:][al:][by:][offset:]`。
//
// 双语处理：相同时间戳的相邻两行视为「原文 + 译文」，合并为 { time, t, x }。
// 制作信息（作词/作曲/混音…）这类 JSON 元数据行会被跳过，不进歌词。

const CREDIT_RE =
  /^\s*(作词|作曲|编曲|制作人|制作|出品|监制|发行|混音|母带|录音|和声|配唱|吉他|贝斯|鼓|键盘|弦乐|合成器|编程|策划|统筹|企划|词|曲|Produc|Mix|Master|Record|Writ|Compos|Arrang|Lyric|Vocal|Guitar|Bass|Drum|Piano|Mastered|Mixed|Engineer|Label|Studio)/i;

/** 把 `mm:ss.xx` / `mm:ss` / `hh:mm:ss.xxx` 解析成秒。 */
function parseStamp(min, sec, frac) {
  let t = parseInt(min, 10) * 60 + parseInt(sec, 10);
  if (frac) {
    // frac 是 `.xx` 或 `.xxx`，按位数归一到秒的小数。
    const digits = frac.replace('.', '');
    t += parseInt(digits, 10) / Math.pow(10, digits.length);
  }
  return t;
}

/**
 * 解析 LRC 文本。
 * @param {string} raw
 * @returns {{ lines: {time:number,t:string,x?:string}[], meta: Record<string,string> }}
 */
export function parseLrc(raw) {
  const meta = {};
  let offset = 0;
  /** @type {{time:number,text:string}[]} */
  const entries = [];

  const STAMP = /\[(\d{1,3}):(\d{1,2})(\.\d{1,3})?\]/g;
  const ID_TAG = /^\[(ti|ar|al|by|offset|length):(.*)\]$/i;

  for (let rawLine of raw.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) continue;

    // 网易 JSON 行
    if (line[0] === '{') {
      try {
        const obj = JSON.parse(line);
        if (typeof obj.t === 'number' && Array.isArray(obj.c)) {
          const text = obj.c.map((seg) => (seg && seg.tx) || '').join('').trim();
          if (text && !CREDIT_RE.test(text)) {
            entries.push({ time: obj.t / 1000, text });
          }
        }
      } catch {
        /* 非法 JSON，忽略 */
      }
      continue;
    }

    // ID / offset 标签
    const idm = line.match(ID_TAG);
    if (idm) {
      const key = idm[1].toLowerCase();
      const val = idm[2].trim();
      if (key === 'offset') offset = parseInt(val, 10) || 0;
      else meta[key] = val;
      continue;
    }

    // 标准时间戳行（可多个时间戳）
    STAMP.lastIndex = 0;
    const stamps = [];
    let m;
    while ((m = STAMP.exec(line)) !== null) {
      stamps.push(parseStamp(m[1], m[2], m[3]));
    }
    if (stamps.length) {
      const text = line.replace(STAMP, '').trim();
      if (text) for (const s of stamps) entries.push({ time: s, text });
    }
  }

  // 应用 offset（毫秒；正值表示歌词提前）
  if (offset) {
    const sec = offset / 1000;
    for (const e of entries) e.time = Math.max(0, e.time - sec);
  }

  // 稳定排序（保持相同时间戳的原始先后，用于原文/译文配对）
  entries.sort((a, b) => a.time - b.time);

  // 合并相同时间戳的相邻行为 原文 + 译文
  /** @type {{time:number,t:string,x?:string}[]} */
  const lines = [];
  for (const e of entries) {
    const prev = lines[lines.length - 1];
    if (prev && Math.abs(prev.time - e.time) < 0.01) {
      if (e.text === prev.t || e.text === prev.x) continue; // 去重
      prev.x = prev.x ? `${prev.x} ${e.text}` : e.text;
    } else {
      lines.push({ time: Number(e.time.toFixed(3)), t: e.text });
    }
  }

  return { lines, meta };
}

// 极简自测：node lib/lrc.test.js
import assert from 'node:assert';
import { parseLrc } from './lrc.js';

let pass = 0;
function check(name, fn) {
  fn();
  pass++;
  console.log('  ok -', name);
}

// 标准 LRC + 双语合并
check('标准行 + 原文/译文合并', () => {
  const raw = [
    '[ti:Demo]',
    '[ar:Someone]',
    '[00:05.00]Hello world',
    '[00:05.00]你好世界',
    '[00:10.50]Second line',
  ].join('\n');
  const { lines, meta } = parseLrc(raw);
  assert.equal(meta.ti, 'Demo');
  assert.equal(lines.length, 2);
  assert.equal(lines[0].time, 5);
  assert.equal(lines[0].t, 'Hello world');
  assert.equal(lines[0].x, '你好世界');
  assert.equal(lines[1].t, 'Second line');
  assert.ok(!lines[1].x);
});

// 网易 JSON 元数据（制作信息）应被跳过，纯音乐标准行保留
check('网易 JSON 行：跳过制作信息、保留歌词', () => {
  const raw = [
    '{"t":0,"c":[{"tx":"作曲: "},{"tx":"Hans Zimmer"}]}',
    '{"t":1000,"c":[{"tx":"制作人: "},{"tx":"Hans Zimmer"}]}',
    '[00:05.00]纯音乐，请欣赏',
  ].join('\n');
  const { lines } = parseLrc(raw);
  assert.equal(lines.length, 1);
  assert.equal(lines[0].t, '纯音乐，请欣赏');
});

// 网易逐字 JSON 行（非制作信息）应作为歌词
check('网易 JSON 行：逐字歌词拼接', () => {
  const raw = '{"t":12000,"c":[{"tx":"I\'ve "},{"tx":"been "},{"tx":"tryna call"}]}';
  const { lines } = parseLrc(raw);
  assert.equal(lines.length, 1);
  assert.equal(lines[0].time, 12);
  assert.equal(lines[0].t, "I've been tryna call");
});

// 一行多时间戳
check('一行多时间戳展开', () => {
  const { lines } = parseLrc('[00:01.00][00:31.00]repeat');
  assert.equal(lines.length, 2);
  assert.equal(lines[0].time, 1);
  assert.equal(lines[1].time, 31);
});

// offset 偏移
check('offset 生效', () => {
  const { lines } = parseLrc('[offset:500]\n[00:10.00]line');
  assert.equal(lines[0].time, 9.5);
});

console.log(`\n${pass} 项全部通过`);

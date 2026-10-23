/* 혼자가 아닌 별들 — 참가자 쪽 기록 모듈
   - 내 별(이름·모둠·렌즈)과 내가 들른 선생님 페이지 순서를 universe/{익명표식} 문서 하나에 저장합니다.
   - 참가자 화면은 기록만 남기고 우주를 실시간으로 받지 않습니다(서버 사용량 절약).
   - 피드백을 쓴 기록이 아니라 '페이지를 연 기록'만 남기므로 피드백 익명성은 그대로입니다. */
(function () {
  const LENSES = [
    { k: 'edu', e: '🎯', t: '교육적 관점', c: '#FFB547', q: 'AI 활용이 학습목표 달성에 실제로 도움이 되었는가?' },
    { k: 'learner', e: '👦', t: '학습자 관점', c: '#6FD3FF', q: '학생이 스스로 생각하고 선택하고 판단할 기회가 충분했는가?' },
    { k: 'tech', e: '💻', t: '기술적 관점', c: '#B494FF', q: '활용한 AI·디지털 기술이 수업 목적과 학생 수준에 적절했는가?' },
    { k: 'eval', e: '📋', t: '평가 관점', c: '#7BF0A6', q: '학생의 결과뿐 아니라 사고 및 AI 활용 과정을 충분히 평가할 수 있었는가?' },
    { k: 'ethics', e: '🛡️', t: '윤리적 관점', c: '#FF7FAE', q: '오류·편향·개인정보·저작권·AI 의존 등 고려하지 못한 문제는 없었는가?' },
    { k: 'exec', e: '🏫', t: '실행 관점', c: '#FFE36E', q: '실제 교실의 시간, 기기, 학생 수준, 접근성 등을 고려할 때 실행 가능한 설계였는가?' }
  ];
  const MAX_PATH = 200, MAX_CARDS = 30;
  const lsGet = k => { try { return localStorage.getItem(k); } catch (e) { return null; } };
  const lsSet = (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} };
  const rid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
  const ANON = (() => { let a = lsGet('afr-anon'); if (!a) { a = rid() + rid(); lsSet('afr-anon', a); } return a; })();
  let st;
  try { st = JSON.parse(lsGet('uni-me') || 'null'); } catch (e) {}
  st = Object.assign({ name: '', group: 0, lens: '', cards: [], path: [], checked: false }, st || {});
  let db = null, demo = false, timer = null, dirty = false, lastOpen = '';

  function attach() {
    try {
      if (window.FIREBASE_CONFIG && window.firebase && firebase.firestore) {
        const pid = window.FIREBASE_CONFIG.projectId;
        const app = firebase.apps.find(a => a.options && a.options.projectId === pid) || firebase.initializeApp(window.FIREBASE_CONFIG, 'uni');
        db = app.firestore(); demo = false;
      } else if (!window.FIREBASE_CONFIG) demo = true;
    } catch (e) { db = null; }
    if (dirty) schedule(0);
  }
  function persist() { lsSet('uni-me', JSON.stringify(st)); }
  function schedule(ms) { dirty = true; clearTimeout(timer); timer = setTimeout(push, ms == null ? 1200 : ms); }
  async function push() {
    if (!st.name) return;
    const data = { name: st.name.slice(0, 20), group: st.group | 0, lens: st.lens || '', cards: st.cards.slice(-MAX_CARDS), path: st.path.slice(-MAX_PATH) };
    if (db) {
      try { await db.collection('universe').doc(ANON).set({ ...data, at: firebase.firestore.FieldValue.serverTimestamp() }); dirty = false; }
      catch (e) { /* 연결이 끊기면 다음 기록 때 다시 보냅니다 */ }
    } else if (demo) {
      let all = {}; try { all = JSON.parse(lsGet('uni-demo') || '{}'); } catch (e) {}
      all[ANON] = { ...data, at: Date.now() }; lsSet('uni-demo', JSON.stringify(all)); dirty = false;
    }
  }
  function change() { persist(); schedule(); }

  window.Universe = {
    LENSES, anon: ANON, attach,
    me() { return { ...st }; },
    lensOf(k) { return LENSES.find(l => l.k === k) || null; },
    checkIn({ name, group, lens }) {
      st.name = String(name || '').trim().slice(0, 20); st.lens = lens || ''; st.checked = true;
      const g = parseInt(group, 10); if (g >= 1 && g <= 15) st.group = g;
      persist(); schedule(0);
    },
    skip() { st.checked = true; persist(); },
    /* 게시판에 입장해 내 카드가 생겼을 때 */
    registerCard(group, cardId, name) {
      const key = group + '_' + cardId; let ch = false;
      if (!st.name && name) { st.name = String(name).slice(0, 20); ch = true; }
      const g = parseInt(group, 10); if (!st.group && g >= 1 && g <= 15) { st.group = g; ch = true; }
      if (!st.cards.includes(key)) { st.cards.push(key); if (st.cards.length > MAX_CARDS) st.cards = st.cards.slice(-MAX_CARDS); ch = true; }
      if (ch) change();
    },
    /* 선생님 페이지를 열 때마다(내 페이지 포함) 부릅니다.
       다른 선생님 페이지는 나갔다가 다시 들어오면 그때마다 한 번씩 더 기록되어, 우주에서 그 사이의 길이 더 굵어집니다. */
    visit(group, cardId) {
      const key = group + '_' + cardId;
      if (lastOpen === key) return;
      lastOpen = key;
      if (st.cards.includes(key)) return;
      st.path.push(key); if (st.path.length > MAX_PATH) st.path = st.path.slice(-MAX_PATH);
      change();
    }
  };
})();

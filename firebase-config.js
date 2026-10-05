/* Firebase 설정 — 무료 한도를 나누기 위해 프로젝트 3개를 씁니다.
   비어 있으면(null) 해당 페이지는 체험판(이 브라우저에만 저장)으로 동작합니다.
   (웹용 Firebase 설정값은 공개되어도 되는 값이며, 보안은 Firestore 보안 규칙으로 지킵니다.) */

/* 1) 메인 연수 사이트: 슬라이드 동기화 + 실시간 채팅 + 발표자 로그인 */
window.FIREBASE_CONFIG = {
  apiKey: "AIzaSyBSysQcQbKbZgc99G8OEE9J3HF_wZJI9CI",
  authDomain: "aiedap-live.firebaseapp.com",
  projectId: "aiedap-live",
  storageBucket: "aiedap-live.firebasestorage.app",
  messagingSenderId: "308331583056",
  appId: "1:308331583056:web:ae82eddd1459d365cb6355"
};
window.PRESENTER_EMAIL = 'presenter@aiedap-live.kr';

/* 2) 모둠별 게시판 1~8모둠 */
window.BOARD_FIREBASE_CONFIG_A = {
  apiKey: "AIzaSyBKkWOd69UmEtCnoqTN5fODr3QS2OFpf-w",
  authDomain: "aiedap-board-a.firebaseapp.com",
  projectId: "aiedap-board-a",
  storageBucket: "aiedap-board-a.firebasestorage.app",
  messagingSenderId: "530641240549",
  appId: "1:530641240549:web:061d2476c01497585a2f0c"
};

/* 3) 모둠별 게시판 9~15모둠 */
window.BOARD_FIREBASE_CONFIG_B = {
  apiKey: "AIzaSyC7wl1I7dNXSq9C1YdQo2JRwGNX6lkisjI",
  authDomain: "aiedap-board-b.firebaseapp.com",
  projectId: "aiedap-board-b",
  storageBucket: "aiedap-board-b.firebasestorage.app",
  messagingSenderId: "31673676763",
  appId: "1:31673676763:web:01f16bb1156188b02bedfe"
};

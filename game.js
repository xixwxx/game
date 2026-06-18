const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const hpText = document.getElementById("hpText");
const hpFill = document.getElementById("hpFill");
const levelText = document.getElementById("levelText");
const xpText = document.getElementById("xpText");
const xpFill = document.getElementById("xpFill");
const goldText = document.getElementById("goldText");
const shardText = document.getElementById("shardText");
const waveText = document.getElementById("waveText");
const killsText = document.getElementById("killsText");
const startPanel = document.getElementById("startPanel");
const rewardPanel = document.getElementById("rewardPanel");
const readyPanel = document.getElementById("readyPanel");
const readyText = document.getElementById("readyText");
const readyHint = document.getElementById("readyHint");
const shopPanel = document.getElementById("shopPanel");
const shopItems = document.getElementById("shopItems");
const closeShopButton = document.getElementById("closeShopButton");
const waveToast = document.getElementById("waveToast");
const fusionToast = document.getElementById("fusionToast");
const gameOverPanel = document.getElementById("gameOverPanel");
const rewardCards = document.getElementById("rewardCards");
const finalStats = document.getElementById("finalStats");
const startButton = document.getElementById("startButton");
const metaShardText = document.getElementById("metaShardText");
const characterList = document.getElementById("characterList");
const helpButton = document.getElementById("helpButton");
const helpPanel = document.getElementById("helpPanel");
const backToMenuButton = document.getElementById("backToMenuButton");
const mainMenuButton = document.getElementById("mainMenuButton");
const fusionTablePanel = document.getElementById("fusionTablePanel");
const fusionTableGrid = document.getElementById("fusionTableGrid");
const fusionTableButton = document.getElementById("fusionTableButton");
const closeFusionTableButton = document.getElementById("closeFusionTableButton");

const keys = new Set();

const rewards = [
  {
    tier: "bronze",
    type: "power",
    title: "공격력 증가",
    text: "총알 피해량 +1",
    apply: (state) => {
      state.player.damage += 1;
    },
  },
  {
    tier: "silver",
    type: "speed",
    title: "공격속도 증가",
    text: "공격 간격 -15%, 최소 120ms",
    apply: (state) => {
      state.player.fireDelay = Math.max(120, state.player.fireDelay * 0.85);
    },
  },
  {
    tier: "bronze",
    type: "speed",
    title: "이동속도 증가",
    text: "이동속도 +18",
    apply: (state) => {
      state.player.speed += 18;
    },
  },
  {
    tier: "silver",
    type: "vitality",
    title: "최대 체력 증가",
    text: "최대 체력 +1, 현재 체력 +1",
    apply: (state) => {
      state.player.maxHp += 1;
      state.player.hp += 1;
    },
  },
  {
    tier: "gold",
    type: "speed",
    title: "총알 속도 증가",
    text: "총알 속도 +110",
    apply: (state) => {
      state.player.bulletSpeed += 110;
    },
  },
  {
    tier: "diamond",
    type: "power",
    title: "강화 탄환",
    text: "총알 피해량 +1, 총알 속도 +140",
    apply: (state) => {
      state.player.damage += 1;
      state.player.bulletSpeed += 140;
    },
  },
  {
    tier: "diamond",
    type: "speed",
    title: "전투 가속",
    text: "공격 간격 -18%, 이동속도 +22",
    apply: (state) => {
      state.player.fireDelay = Math.max(110, state.player.fireDelay * 0.82);
      state.player.speed += 22;
    },
  },
  {
    tier: "prism",
    type: "power",
    title: "완전 무장",
    text: "총알 피해량 +2, 공격 간격 -20%, 이동속도 +26",
    apply: (state) => {
      state.player.damage += 2;
      state.player.fireDelay = Math.max(100, state.player.fireDelay * 0.8);
      state.player.speed += 26;
    },
  },
  {
    tier: "prism",
    type: "vitality",
    title: "생존 본능",
    text: "최대 체력 +2, 현재 체력 +3, 총알 피해량 +1",
    apply: (state) => {
      state.player.maxHp += 2;
      state.player.hp = Math.min(state.player.maxHp, state.player.hp + 3);
      state.player.damage += 1;
    },
  },
  {
    tier: "silver",
    type: "bounce",
    title: "반동 탄환",
    text: "총알 튕김 횟수 +1",
    apply: (state) => {
      state.player.bounces += 1;
    },
  },
  {
    tier: "gold",
    type: "bounce",
    title: "각도 계산",
    text: "총알 튕김 횟수 +1, 총알 속도 +90",
    apply: (state) => {
      state.player.bounces += 1;
      state.player.bulletSpeed += 90;
    },
  },
  {
    tier: "diamond",
    type: "bounce",
    title: "도탄 숙련",
    text: "총알 튕김 횟수 +2, 총알 피해량 +1",
    apply: (state) => {
      state.player.bounces += 2;
      state.player.damage += 1;
    },
  },
  // ── 관통(pierce) 카드 ──
  {
    tier: "bronze",
    type: "pierce",
    title: "예리한 탄환",
    text: "관통 +1",
    apply: (state) => { state.player.pierce += 1; },
  },
  {
    tier: "silver",
    type: "pierce",
    title: "관통력 강화",
    text: "관통 +2, 총알 속도 +60",
    apply: (state) => { state.player.pierce += 2; state.player.bulletSpeed += 60; },
  },
  {
    tier: "gold",
    type: "pierce",
    title: "철갑탄",
    text: "관통 +3, 총알 크기 +1, 피해 +1",
    apply: (state) => { state.player.pierce += 3; state.player.bulletSizeBonus += 1; state.player.damage += 1; },
  },
  {
    tier: "diamond",
    type: "pierce",
    title: "무한 관통",
    text: "관통 +5, 총알 속도 +100",
    apply: (state) => { state.player.pierce += 5; state.player.bulletSpeed += 100; },
  },
  // ── 행운(luck) 카드 ──
  {
    tier: "bronze",
    type: "luck",
    title: "행운의 부적",
    text: "골드 드롭 +15%",
    apply: (state) => { state.player.goldDropBonus = (state.player.goldDropBonus || 1) * 1.15; },
  },
  {
    tier: "silver",
    type: "luck",
    title: "네잎 클로버",
    text: "킬 시 HP 회복 확률 +10%, 골드 드롭 +10%",
    apply: (state) => {
      state.player.healOnKillChance = Math.min(1, (state.player.healOnKillChance || 0) + 0.1);
      state.player.goldDropBonus = (state.player.goldDropBonus || 1) * 1.1;
    },
  },
  {
    tier: "gold",
    type: "luck",
    title: "황금 손",
    text: "골드 드롭 +30%, 킬 시 HP 회복 확률 +15%",
    apply: (state) => {
      state.player.goldDropBonus = (state.player.goldDropBonus || 1) * 1.3;
      state.player.healOnKillChance = Math.min(1, (state.player.healOnKillChance || 0) + 0.15);
    },
  },
  {
    tier: "diamond",
    type: "luck",
    title: "행운의 신",
    text: "골드 드롭 +50%, 킬 시 HP 회복 확률 +25%",
    apply: (state) => {
      state.player.goldDropBonus = (state.player.goldDropBonus || 1) * 1.5;
      state.player.healOnKillChance = Math.min(1, (state.player.healOnKillChance || 0) + 0.25);
    },
  },
  // ── 화력 추가 ──
  {
    tier: "silver",
    type: "power",
    title: "연속 사격",
    text: "공격 간격 -12%, 총알 크기 +1",
    apply: (state) => {
      state.player.fireDelay = Math.max(115, state.player.fireDelay * 0.88);
      state.player.bulletSizeBonus += 1;
    },
  },
  {
    tier: "gold",
    type: "power",
    title: "폭발탄",
    text: "총알 크기 +2, 총알 피해량 +2",
    apply: (state) => {
      state.player.bulletSizeBonus += 2;
      state.player.damage += 2;
    },
  },
  // ── 속도 추가 ──
  {
    tier: "silver",
    type: "speed",
    title: "전투 반사",
    text: "이동속도 +15, 총알 속도 +70",
    apply: (state) => {
      state.player.speed += 15;
      state.player.bulletSpeed += 70;
    },
  },
  {
    tier: "gold",
    type: "speed",
    title: "초광속",
    text: "총알 속도 +180, 공격 간격 -8%",
    apply: (state) => {
      state.player.bulletSpeed += 180;
      state.player.fireDelay = Math.max(100, state.player.fireDelay * 0.92);
    },
  },
  // ── 생존 추가 ──
  {
    tier: "bronze",
    type: "vitality",
    title: "강인한 체질",
    text: "최대 체력 +1, 현재 체력 +2",
    apply: (state) => {
      state.player.maxHp += 1;
      state.player.hp = Math.min(state.player.maxHp, state.player.hp + 2);
    },
  },
  {
    tier: "gold",
    type: "vitality",
    title: "기사회생",
    text: "최대 체력 +2, 현재 체력 +1, 피해량 +0.5",
    apply: (state) => {
      state.player.maxHp += 2;
      state.player.hp = Math.min(state.player.maxHp, state.player.hp + 1);
      state.player.damage += 0.5;
    },
  },
  // ── 도탄 추가 ──
  {
    tier: "bronze",
    type: "bounce",
    title: "에너지 코팅",
    text: "총알 튕김 횟수 +1, 총알 속도 +50",
    apply: (state) => {
      state.player.bounces += 1;
      state.player.bulletSpeed += 50;
    },
  },
  {
    tier: "gold",
    type: "bounce",
    title: "충격파",
    text: "총알 튕김 횟수 +2, 피해량 +1, 총알 크기 +1",
    apply: (state) => {
      state.player.bounces += 2;
      state.player.damage += 1;
      state.player.bulletSizeBonus += 1;
    },
  },
  // ── 관통 추가 ──
  {
    tier: "bronze",
    type: "pierce",
    title: "표적 타격",
    text: "관통 +2",
    apply: (state) => { state.player.pierce += 2; },
  },
  {
    tier: "gold",
    type: "pierce",
    title: "폭격탄",
    text: "관통 +2, 피해량 +1, 총알 크기 +1",
    apply: (state) => {
      state.player.pierce += 2;
      state.player.damage += 1;
      state.player.bulletSizeBonus += 1;
    },
  },
  // ── 행운 추가 ──
  {
    tier: "bronze",
    type: "luck",
    title: "노다지",
    text: "골드 드롭 +25%",
    apply: (state) => {
      state.player.goldDropBonus = (state.player.goldDropBonus || 1) * 1.25;
    },
  },
  {
    tier: "gold",
    type: "luck",
    title: "신의 가호",
    text: "골드 드롭 +35%, 킬 시 HP 회복 확률 +20%",
    apply: (state) => {
      state.player.goldDropBonus = (state.player.goldDropBonus || 1) * 1.35;
      state.player.healOnKillChance = Math.min(1, (state.player.healOnKillChance || 0) + 0.2);
    },
  },
  // ── 폭발(explosion) 카드 ──
  {
    tier: "bronze",
    type: "explosion",
    title: "점화 탄환",
    text: "총알 피해량 +1",
    apply: (state) => { state.player.damage += 1; },
  },
  {
    tier: "silver",
    type: "explosion",
    title: "팽창 탄약",
    text: "총알 크기 +1, 이동속도 +12",
    apply: (state) => { state.player.bulletSizeBonus += 1; state.player.speed += 12; },
  },
  {
    tier: "gold",
    type: "explosion",
    title: "폭발 탄두",
    text: "총알 피해량 +1, 총알 크기 +2",
    apply: (state) => { state.player.damage += 1; state.player.bulletSizeBonus += 2; },
  },
  {
    tier: "diamond",
    type: "explosion",
    title: "연쇄 폭발",
    text: "총알 피해량 +2, 총알 크기 +2, 이동속도 +15",
    apply: (state) => { state.player.damage += 2; state.player.bulletSizeBonus += 2; state.player.speed += 15; },
  },
  // ── 독(poison) 카드 ──
  {
    tier: "bronze",
    type: "poison",
    title: "독 침",
    text: "관통 +1",
    apply: (state) => { state.player.pierce += 1; },
  },
  {
    tier: "silver",
    type: "poison",
    title: "침투 독",
    text: "관통 +1, 이동속도 +15",
    apply: (state) => { state.player.pierce += 1; state.player.speed += 15; },
  },
  {
    tier: "gold",
    type: "poison",
    title: "독소 탄환",
    text: "관통 +2, 총알 속도 +70",
    apply: (state) => { state.player.pierce += 2; state.player.bulletSpeed += 70; },
  },
  {
    tier: "diamond",
    type: "poison",
    title: "맹독 강화",
    text: "관통 +3, 피해량 +1, 이동속도 +18",
    apply: (state) => { state.player.pierce += 3; state.player.damage += 1; state.player.speed += 18; },
  },
  // ── 번개(lightning) 카드 ──
  {
    tier: "bronze",
    type: "lightning",
    title: "정전기 탄환",
    text: "공격 간격 -10%",
    apply: (state) => { state.player.fireDelay = Math.max(115, state.player.fireDelay * 0.9); },
  },
  {
    tier: "silver",
    type: "lightning",
    title: "전기 가속",
    text: "공격 간격 -12%, 이동속도 +18",
    apply: (state) => { state.player.fireDelay = Math.max(110, state.player.fireDelay * 0.88); state.player.speed += 18; },
  },
  {
    tier: "gold",
    type: "lightning",
    title: "뇌전 탄환",
    text: "공격 간격 -15%, 총알 속도 +100",
    apply: (state) => { state.player.fireDelay = Math.max(105, state.player.fireDelay * 0.85); state.player.bulletSpeed += 100; },
  },
  {
    tier: "diamond",
    type: "lightning",
    title: "번개 연사",
    text: "공격 간격 -18%, 이동속도 +20, 피해량 +1",
    apply: (state) => { state.player.fireDelay = Math.max(100, state.player.fireDelay * 0.82); state.player.speed += 20; state.player.damage += 1; },
  },
  // ── 빙결(frost) 카드 ──
  {
    tier: "bronze",
    type: "frost",
    title: "냉각 탄환",
    text: "총알 속도 +80",
    apply: (state) => { state.player.bulletSpeed += 80; },
  },
  {
    tier: "silver",
    type: "frost",
    title: "빙하 탄환",
    text: "총알 속도 +100, 최대 체력 +1",
    apply: (state) => { state.player.bulletSpeed += 100; state.player.maxHp += 1; state.player.hp += 1; },
  },
  {
    tier: "gold",
    type: "frost",
    title: "냉동 강화",
    text: "총알 속도 +120, 피해량 +1",
    apply: (state) => { state.player.bulletSpeed += 120; state.player.damage += 1; },
  },
  {
    tier: "diamond",
    type: "frost",
    title: "절대 영도",
    text: "총알 속도 +150, 최대 체력 +1, 이동속도 +15",
    apply: (state) => { state.player.bulletSpeed += 150; state.player.maxHp += 1; state.player.hp += 1; state.player.speed += 15; },
  },
];

const tierLabels = {
  stone: "스톤",
  bronze: "브론즈",
  silver: "실버",
  gold: "골드",
  diamond: "다이아",
  prism: "프리즘",
};

const tierOrder = ["stone", "bronze", "silver", "gold", "diamond", "prism"];

const fusionNames = {
  boomerang_machinegun: "회전 부메랑",
  leech_machinegun:     "뱀파이어 건",
  machinegun_slime:     "슬라임 기관총",
  drill_machinegun:     "기관 드릴",
  machinegun_scatter:   "확산 연발",
  boomerang_leech:      "흡혈 부메랑",
  boomerang_slime:      "슬라임 부메랑",
  boomerang_drill:      "드릴 부메랑",
  boomerang_scatter:    "산탄 부메랑",
  leech_slime:          "흡혈 슬라임",
  drill_leech:          "흡혈 드릴",
  leech_scatter:        "흡혈 산탄",
  drill_slime:          "산성 드릴",
  scatter_slime:        "슬라임 산탄",
  drill_scatter:        "폭발 드릴",
  // ── 폭발 크로스 ──
  boomerang_explosive:  "폭발 부메랑",
  drill_explosive:      "폭발 드릴 탄",
  explosive_leech:      "흡혈 폭탄",
  explosive_machinegun: "폭발 기관총",
  explosive_scatter:    "폭발 산탄",
  explosive_slime:      "폭발 슬라임",
  // ── 독 크로스 ──
  boomerang_poison:     "독 부메랑",
  drill_poison:         "독 드릴",
  leech_poison:         "흡혈 독",
  machinegun_poison:    "독 기관총",
  poison_scatter:       "독 산탄",
  poison_slime:         "독 슬라임",
  // ── 번개 크로스 ──
  boomerang_chain:      "번개 부메랑",
  chain_drill:          "번개 드릴",
  chain_leech:          "흡혈 번개",
  chain_machinegun:     "번개 기관총",
  chain_scatter:        "번개 산탄",
  chain_slime:          "번개 슬라임",
  // ── 빙결 크로스 ──
  boomerang_freeze:     "냉동 부메랑",
  drill_freeze:         "냉동 드릴",
  freeze_leech:         "흡혈 빙결",
  freeze_machinegun:    "냉동 기관총",
  freeze_scatter:       "냉동 산탄",
  freeze_slime:         "냉동 슬라임",
  // ── 신규 타입끼리 ──
  chain_explosive:      "번개 폭탄",
  chain_freeze:         "냉동 번개",
  chain_poison:         "번개 독",
  explosive_freeze:     "냉동 폭탄",
  explosive_poison:     "독 폭탄",
  freeze_poison:        "냉동 독",
};
const REWARD_PICK_LIMIT = 12;


const tierWeights = [
  { tier: "stone",   w: 10 },
  { tier: "bronze",  w: 22 },
  { tier: "silver",  w: 22 },
  { tier: "gold",    w: 20 },
  { tier: "diamond", w: 16 },
  { tier: "prism",   w: 10 },
];
const rerollUpgradeChance = 0.18;
const metaStorageKey = "oneRoomRoguelikeMeta";

const characters = [
  {
    id: "rookie",
    name: "기본형",
    cost: 0,
    text: "기본 능력치로 시작합니다.",
    apply: () => {},
  },
  {
    id: "strong",
    name: "화력형",
    cost: 50,
    text: "총알 피해량 +2로 시작합니다.",
    apply: (player) => {
      player.damage += 2;
    },
  },
  {
    id: "dual",
    name: "쌍발형",
    cost: 300,
    text: "보조 탄 +1로 시작합니다.",
    apply: (player) => {
      player.sideShots += 1;
    },
  },
];

let meta = loadMeta();

const rewardTypeLabels = {
  power: "화력",
  speed: "속도",
  vitality: "생존",
  bounce: "도탄",
  pierce: "관통",
  luck: "행운",
  explosion: "폭발",
  poison: "독",
  lightning: "번개",
  frost: "빙결",
};

const lateRewards = [
  { tier: "gold",    type: "power",     title: "전장 숙련",    text: "피해량 +2, 공격 간격 -8%",
    apply: (s) => { s.player.damage += 2; s.player.fireDelay = Math.max(100, s.player.fireDelay * 0.92); } },
  { tier: "gold",    type: "vitality",  title: "강철 의지",    text: "최대 체력 +2, 현재 체력 +3",
    apply: (s) => { s.player.maxHp += 2; s.player.hp = Math.min(s.player.maxHp, s.player.hp + 3); } },
  { tier: "gold",    type: "speed",     title: "전투 가속 II", text: "이동속도 +28, 총알 속도 +120",
    apply: (s) => { s.player.speed += 28; s.player.bulletSpeed += 120; } },
  { tier: "gold",    type: "bounce",    title: "공진 탄환",    text: "튕김 +2, 피해량 +1, 총알 크기 +1",
    apply: (s) => { s.player.bounces += 2; s.player.damage += 1; s.player.bulletSizeBonus += 1; } },
  { tier: "gold",    type: "pierce",    title: "관통 마스터",  text: "관통 +4, 총알 속도 +80",
    apply: (s) => { s.player.pierce += 4; s.player.bulletSpeed += 80; } },
  { tier: "gold",    type: "luck",      title: "황금 물결",    text: "골드 드롭 +40%, 킬 시 HP 회복 +20%",
    apply: (s) => { s.player.goldDropBonus = (s.player.goldDropBonus||1)*1.4; s.player.healOnKillChance = Math.min(1,(s.player.healOnKillChance||0)+0.2); } },
  { tier: "gold",    type: "explosion", title: "고폭 연성",    text: "피해량 +2, 총알 크기 +2",
    apply: (s) => { s.player.damage += 2; s.player.bulletSizeBonus += 2; } },
  { tier: "gold",    type: "poison",    title: "맹독 확산",    text: "관통 +3, 이동속도 +20",
    apply: (s) => { s.player.pierce += 3; s.player.speed += 20; } },
  { tier: "gold",    type: "lightning", title: "뇌전 연사",    text: "공격 간격 -15%, 이동속도 +22",
    apply: (s) => { s.player.fireDelay = Math.max(100, s.player.fireDelay*0.85); s.player.speed += 22; } },
  { tier: "gold",    type: "frost",     title: "빙하 가속",    text: "총알 속도 +140, 최대 체력 +1",
    apply: (s) => { s.player.bulletSpeed += 140; s.player.maxHp += 1; s.player.hp += 1; } },
  { tier: "diamond", type: "power",     title: "궁극 화력",    text: "피해량 +3, 공격 간격 -12%, 총알 크기 +2",
    apply: (s) => { s.player.damage += 3; s.player.fireDelay = Math.max(95, s.player.fireDelay*0.88); s.player.bulletSizeBonus += 2; } },
  { tier: "diamond", type: "vitality",  title: "불사 본능",    text: "최대 체력 +3, 현재 체력 +4, 피해량 +1",
    apply: (s) => { s.player.maxHp += 3; s.player.hp = Math.min(s.player.maxHp, s.player.hp+4); s.player.damage += 1; } },
  { tier: "diamond", type: "speed",     title: "광속 반응",    text: "이동속도 +35, 총알 속도 +160, 공격 간격 -10%",
    apply: (s) => { s.player.speed += 35; s.player.bulletSpeed += 160; s.player.fireDelay = Math.max(95, s.player.fireDelay*0.90); } },
  { tier: "diamond", type: "bounce",    title: "도탄 폭풍",    text: "튕김 +3, 피해량 +2",
    apply: (s) => { s.player.bounces += 3; s.player.damage += 2; } },
  { tier: "diamond", type: "pierce",    title: "무한 관통 II", text: "관통 +6, 피해량 +1, 총알 속도 +100",
    apply: (s) => { s.player.pierce += 6; s.player.damage += 1; s.player.bulletSpeed += 100; } },
  { tier: "prism",   type: "power",     title: "신의 일격",    text: "피해량 +4, 공격 간격 -15%, 이동속도 +20",
    apply: (s) => { s.player.damage += 4; s.player.fireDelay = Math.max(90, s.player.fireDelay*0.85); s.player.speed += 20; } },
  { tier: "prism",   type: "vitality",  title: "철벽 생존",    text: "최대 체력 +4, 현재 체력 +5, 총알 크기 +2",
    apply: (s) => { s.player.maxHp += 4; s.player.hp = Math.min(s.player.maxHp, s.player.hp+5); s.player.bulletSizeBonus += 2; } },
  { tier: "prism",   type: "speed",     title: "시간 붕괴",     text: "공격간격 -20%, 이동속도 +40, 탄속 +180",
    apply: (s) => { s.player.fireDelay = Math.max(75, s.player.fireDelay*0.80); s.player.speed += 40; s.player.bulletSpeed += 180; } },
  { tier: "prism",   type: "bounce",    title: "반사 폭풍",     text: "튕김 +4, 피해량 +3, 총알 크기 +2 + 반사할수록 피해량 1.6배 증폭 (최대 5배)",
    apply: (s) => { s.player.bounces += 4; s.player.damage += 3; s.player.bulletSizeBonus += 2; s.player.bounceChainShot = true; } },
  { tier: "prism",   type: "pierce",    title: "관통 해방",     text: "관통 +8, 피해량 +2, 탄속 +150 + 관통 명중마다 소폭발 발생",
    apply: (s) => { s.player.pierce += 8; s.player.damage += 2; s.player.bulletSpeed += 150; s.player.pierceExplosion = true; } },
  { tier: "prism",   type: "luck",      title: "신의 축복",     text: "골드 드롭 +60%, 킬 시 HP 회복 확률 +35% + 킬 시 25% 확률로 전기 스파크 방출",
    apply: (s) => { s.player.goldDropBonus = (s.player.goldDropBonus||1)*1.6; s.player.healOnKillChance = Math.min(1,(s.player.healOnKillChance||0)+0.35); s.player.killSummonSpark = true; } },
  { tier: "gold",    type: "explosion", title: "폭렬 강화",     text: "피해량 +2, 총알 크기 +3",
    apply: (s) => { s.player.damage += 2; s.player.bulletSizeBonus += 3; } },
  { tier: "gold",    type: "poison",    title: "독소 포화",     text: "관통 +4, 이동속도 +22",
    apply: (s) => { s.player.pierce += 4; s.player.speed += 22; } },
  { tier: "gold",    type: "lightning", title: "번개 연쇄",     text: "공격간격 -14%, 이동속도 +25",
    apply: (s) => { s.player.fireDelay = Math.max(95, s.player.fireDelay*0.86); s.player.speed += 25; } },
  { tier: "gold",    type: "frost",     title: "절대 냉각",     text: "탄속 +150, 피해량 +1",
    apply: (s) => { s.player.bulletSpeed += 150; s.player.damage += 1; } },
  { tier: "diamond", type: "explosion", title: "핵폭발",        text: "피해량 +3, 총알 크기 +4, 공격간격 -10%",
    apply: (s) => { s.player.damage += 3; s.player.bulletSizeBonus += 4; s.player.fireDelay = Math.max(90, s.player.fireDelay*0.90); } },
  { tier: "diamond", type: "poison",    title: "맹독 해방",     text: "관통 +5, 피해량 +2, 이동속도 +20",
    apply: (s) => { s.player.pierce += 5; s.player.damage += 2; s.player.speed += 20; } },
  { tier: "diamond", type: "lightning", title: "뇌신",          text: "공격간격 -18%, 탄속 +130, 피해량 +1",
    apply: (s) => { s.player.fireDelay = Math.max(85, s.player.fireDelay*0.82); s.player.bulletSpeed += 130; s.player.damage += 1; } },
  { tier: "diamond", type: "frost",     title: "빙하 시대",     text: "탄속 +180, 최대 체력 +2, 피해량 +1",
    apply: (s) => { s.player.bulletSpeed += 180; s.player.maxHp += 2; s.player.hp = Math.min(s.player.maxHp, s.player.hp+2); s.player.damage += 1; } },
  // ── 4 new types — prism ──
  { tier: "prism", type: "explosion", title: "핵폭 연쇄",  text: "피해량 +3, 총알 크기 +3 + 킬 시 25% 스파크 방출",
    apply: (s) => { s.player.damage += 3; s.player.bulletSizeBonus += 3; s.player.killSummonSpark = true; } },
  { tier: "prism", type: "poison",    title: "독성 폭발",  text: "관통 +6, 이동속도 +30 + 관통 명중 시 소폭발",
    apply: (s) => { s.player.pierce += 6; s.player.speed += 30; s.player.pierceExplosion = true; } },
  { tier: "prism", type: "lightning", title: "뇌전 폭풍",  text: "공격간격 -20%, 탄속 +160 + 반사할수록 피해량 1.6배 증폭",
    apply: (s) => { s.player.fireDelay = Math.max(80, s.player.fireDelay*0.80); s.player.bulletSpeed += 160; s.player.bounceChainShot = true; } },
  { tier: "prism", type: "frost",     title: "절대 영도",  text: "탄속 +200, 피해량 +2, 공격간격 -15%, 최대 체력 +2",
    apply: (s) => { s.player.bulletSpeed += 200; s.player.damage += 2; s.player.fireDelay = Math.max(80, s.player.fireDelay*0.85); s.player.maxHp += 2; s.player.hp = Math.min(s.player.maxHp, s.player.hp+2); } },
];

const rewardSetBonuses = {
  power: [
    {
      count: 2,
      text: "화력 2세트: 총알 피해량 +1",
      apply: (state) => {
        state.player.damage += 1;
      },
    },
    {
      count: 3,
      text: "화력 3세트: 공격 간격 -14%",
      apply: (state) => {
        state.player.fireDelay = Math.max(105, state.player.fireDelay * 0.86);
      },
    },
    {
      count: 4,
      text: "화력 4세트: 총알 크기 +2 + 기관총 해금",
      apply: (state) => {
        state.player.bulletSizeBonus += 2;
        state.player.specialBullets.machinegun = true;
      },
    },
  ],
  speed: [
    {
      count: 2,
      text: "속도 2세트: 이동속도 +22",
      apply: (state) => {
        state.player.speed += 22;
      },
    },
    {
      count: 3,
      text: "속도 3세트: 총알 속도 +140",
      apply: (state) => {
        state.player.bulletSpeed += 140;
      },
    },
    {
      count: 4,
      text: "속도 4세트: 공격 간격 -22% + 부메랑 탄 해금",
      apply: (state) => {
        state.player.fireDelay = Math.max(95, state.player.fireDelay * 0.78);
        state.player.specialBullets.boomerang = true;
      },
    },
  ],
  vitality: [
    {
      count: 2,
      text: "생존 2세트: 최대 체력 +1, 현재 체력 +1",
      apply: (state) => {
        state.player.maxHp += 1;
        state.player.hp += 1;
      },
    },
    {
      count: 3,
      text: "생존 3세트: 현재 체력 +3",
      apply: (state) => {
        state.player.hp = Math.min(state.player.maxHp, state.player.hp + 3);
      },
    },
    {
      count: 4,
      text: "생존 4세트: 최대 체력 +1, 현재 체력 +2 + 흡혈 탄 해금",
      apply: (state) => {
        state.player.maxHp += 1;
        state.player.hp += 2;
        state.player.specialBullets.leech = true;
      },
    },
  ],
  bounce: [
    {
      count: 2,
      text: "도탄 2세트: 총알 튕김 횟수 +1",
      apply: (state) => {
        state.player.bounces += 1;
      },
    },
    {
      count: 3,
      text: "도탄 3세트: 총알 튕김 횟수 +3",
      apply: (state) => {
        state.player.bounces += 3;
      },
    },
    {
      count: 4,
      text: "도탄 4세트: 튕길 때마다 총알 크기 +1.5 + 슬라임 탄 해금",
      apply: (state) => {
        state.player.bounceGrow = true;
        state.player.specialBullets.slime = true;
      },
    },
  ],
  pierce: [
    {
      count: 2,
      text: "관통 2세트: 관통 +1",
      apply: (state) => { state.player.pierce += 1; },
    },
    {
      count: 3,
      text: "관통 3세트: 관통 +2, 총알 속도 +80",
      apply: (state) => { state.player.pierce += 2; state.player.bulletSpeed += 80; },
    },
    {
      count: 4,
      text: "관통 4세트: 관통 +3, 총알 크기 +2 + 드릴 탄 해금",
      apply: (state) => { state.player.pierce += 3; state.player.bulletSizeBonus += 2; state.player.specialBullets.drill = true; },
    },
  ],
  luck: [
    {
      count: 2,
      text: "행운 2세트: 골드 드롭 +20%",
      apply: (state) => { state.player.goldDropBonus = (state.player.goldDropBonus || 1) * 1.2; },
    },
    {
      count: 3,
      text: "행운 3세트: 킬 시 HP 회복 확률 +15%",
      apply: (state) => { state.player.healOnKillChance = Math.min(1, (state.player.healOnKillChance || 0) + 0.15); },
    },
    {
      count: 4,
      text: "행운 4세트: 골드 드롭 +30%, 킬 시 회복 +10% + 산탄 해금",
      apply: (state) => {
        state.player.goldDropBonus = (state.player.goldDropBonus || 1) * 1.3;
        state.player.healOnKillChance = Math.min(1, (state.player.healOnKillChance || 0) + 0.1);
        state.player.specialBullets.scatter = true;
      },
    },
  ],
  explosion: [
    {
      count: 2,
      text: "폭발 2세트: 총알 피해량 +1",
      apply: (state) => { state.player.damage += 1; },
    },
    {
      count: 3,
      text: "폭발 3세트: 총알 크기 +3",
      apply: (state) => { state.player.bulletSizeBonus += 3; },
    },
    {
      count: 4,
      text: "폭발 4세트: 총알 피해량 +1, 크기 +2 + 폭발 탄 해금",
      apply: (state) => {
        state.player.damage += 1;
        state.player.bulletSizeBonus += 2;
        state.player.specialBullets.explosive = true;
      },
    },
  ],
  poison: [
    {
      count: 2,
      text: "독 2세트: 관통 +1",
      apply: (state) => { state.player.pierce += 1; },
    },
    {
      count: 3,
      text: "독 3세트: 관통 +2, 이동속도 +18",
      apply: (state) => { state.player.pierce += 2; state.player.speed += 18; },
    },
    {
      count: 4,
      text: "독 4세트: 관통 +2, 피해량 +1 + 독 탄 해금",
      apply: (state) => {
        state.player.pierce += 2;
        state.player.damage += 1;
        state.player.specialBullets.poison = true;
      },
    },
  ],
  lightning: [
    {
      count: 2,
      text: "번개 2세트: 공격 간격 -12%",
      apply: (state) => { state.player.fireDelay = Math.max(110, state.player.fireDelay * 0.88); },
    },
    {
      count: 3,
      text: "번개 3세트: 공격 간격 -15%, 이동속도 +20",
      apply: (state) => { state.player.fireDelay = Math.max(105, state.player.fireDelay * 0.85); state.player.speed += 20; },
    },
    {
      count: 4,
      text: "번개 4세트: 공격 간격 -20%, 피해량 +1 + 번개 탄 해금",
      apply: (state) => {
        state.player.fireDelay = Math.max(100, state.player.fireDelay * 0.80);
        state.player.damage += 1;
        state.player.specialBullets.chain = true;
      },
    },
  ],
  frost: [
    {
      count: 2,
      text: "빙결 2세트: 총알 속도 +90",
      apply: (state) => { state.player.bulletSpeed += 90; },
    },
    {
      count: 3,
      text: "빙결 3세트: 총알 속도 +110, 최대 체력 +1",
      apply: (state) => { state.player.bulletSpeed += 110; state.player.maxHp += 1; state.player.hp += 1; },
    },
    {
      count: 4,
      text: "빙결 4세트: 총알 속도 +130, 최대 체력 +1 + 빙결 탄 해금",
      apply: (state) => {
        state.player.bulletSpeed += 130;
        state.player.maxHp += 1;
        state.player.hp += 1;
        state.player.specialBullets.freeze = true;
      },
    },
  ],
};

const shopCatalog = [
  {
    id: "healing_potion",
    type: "consumable",
    title: "회복 포션",
    text: "현재 체력 +2. 구매할 때마다 가격 +6 Gold",
    cost: 12,
    scalingCost: 6,
    buy: (state) => {
      state.player.hp = Math.min(state.player.maxHp, state.player.hp + 2);
    },
  },
  {
    id: "rubber_round",
    type: "component",
    title: "고무 탄환",
    text: "총알 튕김 횟수 +2. 튕길 때 총알 속도 +8%",
    cost: 22,
    buy: (state) => {
      state.player.bounces += 2;
      state.player.lightBounceBoost = true;
    },
    sell: (s) => { s.player.bounces -= 2; s.player.lightBounceBoost = false; },
  },
  {
    id: "hot_skewer",
    type: "component",
    title: "뜨거운 꼬챙이",
    text: "총알 관통 횟수 +2",
    cost: 26,
    buy: (state) => {
      state.player.pierce += 2;
    },
    sell: (s) => { s.player.pierce -= 2; },
  },
  {
    id: "double_trigger",
    type: "component",
    title: "쌍발 장치",
    text: "보조 탄 +1. 보조 탄 피해량은 기본 피해의 45%",
    cost: 40,
    buy: (state) => {
      state.player.sideShots += 1;
    },
    sell: (s) => { s.player.sideShots -= 1; },
  },
  {
    id: "ricochet_drill",
    type: "final",
    title: "도탄 드릴",
    text: "재료: 고무 탄환 + 뜨거운 꼬챙이. 튕김 +1, 관통 +1, 피해량 +1",
    cost: 38,
    requires: ["rubber_round", "hot_skewer"],
    buy: (state) => {
      state.player.bounces += 1;
      state.player.pierce += 1;
      state.player.damage += 1;
    },
    sell: (s) => { s.player.bounces -= 1; s.player.pierce -= 1; s.player.damage -= 1; },
  },
  {
    id: "storm_launcher",
    type: "final",
    title: "폭풍 발사기",
    text: "재료: 쌍발 장치 + 고무 탄환. 보조 탄 +1, 튕김 +1, 공격 간격 -10%",
    cost: 50,
    requires: ["double_trigger", "rubber_round"],
    buy: (state) => {
      state.player.sideShots += 1;
      state.player.bounces += 1;
      state.player.fireDelay = Math.max(110, state.player.fireDelay * 0.9);
    },
    sell: (s) => { s.player.sideShots -= 1; s.player.bounces -= 1; s.player.fireDelay = Math.min(500, s.player.fireDelay / 0.9); },
  },
  {
    id: "speed_booster",
    type: "component",
    title: "스피드 부스터",
    text: "이동속도 +30",
    cost: 20,
    buy: (state) => { state.player.speed += 30; },
    sell: (s) => { s.player.speed -= 30; },
  },
  {
    id: "scope",
    type: "component",
    title: "조준경",
    text: "총알 속도 +90",
    cost: 24,
    buy: (state) => { state.player.bulletSpeed += 90; },
    sell: (s) => { s.player.bulletSpeed -= 90; },
  },
  {
    id: "iron_heart",
    type: "component",
    title: "강화 심장",
    text: "최대 체력 +2, 현재 체력 +2",
    cost: 30,
    buy: (state) => {
      state.player.maxHp += 2;
      state.player.hp = Math.min(state.player.maxHp, state.player.hp + 2);
    },
    sell: (s) => { s.player.maxHp = Math.max(1, s.player.maxHp - 2); s.player.hp = Math.min(s.player.maxHp, s.player.hp); },
  },
  {
    id: "rapid_assault",
    type: "final",
    title: "속사 돌격",
    text: "재료: 스피드 부스터 + 쌍발 장치. 이동속도 +20, 보조 탄 +1, 공격 간격 -12%",
    cost: 52,
    requires: ["speed_booster", "double_trigger"],
    buy: (state) => {
      state.player.speed += 20;
      state.player.sideShots += 1;
      state.player.fireDelay = Math.max(95, state.player.fireDelay * 0.88);
    },
    sell: (s) => { s.player.speed -= 20; s.player.sideShots -= 1; s.player.fireDelay = Math.min(500, s.player.fireDelay / 0.88); },
  },
  {
    id: "sniper_rifle",
    type: "final",
    title: "저격 라이플",
    text: "재료: 조준경 + 뜨거운 꼬챙이. 탄속 +150, 관통 +4, 피해량 +2",
    cost: 48,
    requires: ["scope", "hot_skewer"],
    buy: (state) => {
      state.player.bulletSpeed += 150;
      state.player.pierce += 4;
      state.player.damage += 2;
    },
    sell: (s) => { s.player.bulletSpeed -= 150; s.player.pierce -= 4; s.player.damage -= 2; },
  },
  {
    id: "fortress_armor",
    type: "final",
    title: "철의 요새",
    text: "재료: 강화 심장 + 고무 탄환. 최대 체력 +3, 현재 체력 +3, 튕김 +2",
    cost: 55,
    requires: ["iron_heart", "rubber_round"],
    buy: (state) => {
      state.player.maxHp += 3;
      state.player.hp = Math.min(state.player.maxHp, state.player.hp + 3);
      state.player.bounces += 2;
    },
    sell: (s) => { s.player.maxHp = Math.max(1, s.player.maxHp - 3); s.player.hp = Math.min(s.player.maxHp, s.player.hp); s.player.bounces -= 2; },
  },
  {
    id: "overcharge_core",
    type: "late_final",
    minWave: 30,
    title: "과충전 코어",
    text: "Wave 30+ 해금. 피해량 +4, 탄속 +200, 공격간격 -15%. 최대 체력 -1.",
    cost: 55,
    buy: (state) => {
      state.player.damage += 4;
      state.player.bulletSpeed += 200;
      state.player.fireDelay = Math.max(90, state.player.fireDelay * 0.85);
      state.player.maxHp = Math.max(1, state.player.maxHp - 1);
      state.player.hp = Math.min(state.player.maxHp, state.player.hp);
    },
    sell: (s) => { s.player.damage -= 4; s.player.bulletSpeed -= 200; s.player.maxHp += 1; },
  },
  {
    id: "bulwark_shield",
    type: "late_final",
    minWave: 40,
    title: "성벽 방패",
    text: "Wave 40+ 해금. 최대 체력 +5, 현재 체력 +5, 튕김 +3.",
    cost: 80,
    buy: (state) => {
      state.player.maxHp += 5;
      state.player.hp = Math.min(state.player.maxHp, state.player.hp + 5);
      state.player.bounces += 3;
    },
    sell: (s) => { s.player.maxHp = Math.max(1, s.player.maxHp - 5); s.player.hp = Math.min(s.player.maxHp, s.player.hp); s.player.bounces -= 3; },
  },
  {
    id: "void_lens",
    type: "late_final",
    minWave: 50,
    title: "공허 렌즈",
    text: "Wave 50+ 해금. 관통 +8, 총알 크기 +3, 보조탄 +1.",
    cost: 90,
    buy: (state) => {
      state.player.pierce += 8;
      state.player.bulletSizeBonus += 3;
      state.player.sideShots += 1;
    },
    sell: (s) => { s.player.pierce -= 8; s.player.bulletSizeBonus -= 3; s.player.sideShots -= 1; },
  },
  {
    id: "apex_catalyst",
    type: "late_final",
    minWave: 60,
    title: "정점 촉매",
    text: "Wave 60+ 해금. 피해량 +5, 이동속도 +40, 공격간격 -20%.",
    cost: 85,
    buy: (state) => {
      state.player.damage += 5;
      state.player.speed += 40;
      state.player.fireDelay = Math.max(80, state.player.fireDelay * 0.80);
    },
    sell: (s) => { s.player.damage -= 5; s.player.speed -= 40; },
  },
  {
    id: "singularity_core",
    type: "late_final",
    minWave: 70,
    title: "특이점",
    text: "Wave 70+ 해금. 피해량 +7, 공격간격 -25%, 이동속도 +50, 최대 체력 +3.",
    cost: 100,
    buy: (state) => {
      state.player.damage += 7;
      state.player.fireDelay = Math.max(75, state.player.fireDelay * 0.75);
      state.player.speed += 50;
      state.player.maxHp += 3;
      state.player.hp = Math.min(state.player.maxHp, state.player.hp + 3);
    },
    sell: (s) => { s.player.damage -= 7; s.player.speed -= 50; s.player.maxHp = Math.max(1, s.player.maxHp - 3); s.player.hp = Math.min(s.player.maxHp, s.player.hp); },
  },
];

let state = createState();
let lastTime = performance.now();

function createState() {
  const newState = {
    mode: "start",
    wave: 1,
    level: 1,
    xp: 0,
    xpToNext: getXpToNextLevel(1),
    gold: 0,
    kills: 0,
    enemiesRemaining: 0,
    readyAction: "nextWave",
    rewardNextAction: "nextWave",
    pausedMode: null,
    hiddenReadyForShop: false,
    expandedFinalId: null,
    inventory: {},
    rewardTypes: {},
    activeSetBonuses: {},
    setBonusMessage: "",
    rewardPicksRemaining: REWARD_PICK_LIMIT,
    waveToastTimer: 0,
    screenShake: 0,
    bullets: [],
    enemyBullets: [],
    enemies: [],
    goldDrops: [],
    shardDrops: [],
    particles: [],
    floatTexts: [],
    player: {
      x: canvas.width / 2,
      y: canvas.height / 2,
      r: 15,
      hp: 5,
      maxHp: 5,
      speed: 235,
      damage: 1,
      fireDelay: 290,
      bulletSpeed: 560,
      bounces: 0,
      pierce: 0,
      sideShots: 0,
      bulletSizeBonus: 0,
      lightBounceBoost: false,
      bounceGrow: false,
      specialBullets: { machinegun: false, boomerang: false, slime: false, leech: false, drill: false, scatter: false, explosive: false, poison: false, chain: false, freeze: false },
      lastShot: 0,
      hurtTimer: 0,
      goldDropBonus: 1,
      healOnKillChance: 0,
      leechHealTimer: 0,
    },
  };
  return newState;
}

function startGame() {
  state = createState();
  getSelectedCharacter().apply(state.player);
  state.mode = "playing";
  hideAllPanels();
  spawnWave();
  updateHud();
}

function showMainMenu() {
  state = createState();
  hideAllPanels();
  startPanel.classList.remove("hidden");
  renderCharacters();
  updateHud();
}

function hideAllPanels() {
  startPanel.classList.add("hidden");
  rewardPanel.classList.add("hidden");
  readyPanel.classList.add("hidden");
  helpPanel.classList.add("hidden");
  shopPanel.classList.add("hidden");
  gameOverPanel.classList.add("hidden");
}

function showHelp() {
  startPanel.classList.add("hidden");
  helpPanel.classList.remove("hidden");
}

function hideHelp() {
  helpPanel.classList.add("hidden");
  startPanel.classList.remove("hidden");
}

function openFusionTable() {
  const specialLabels = {
    machinegun: '기관총', boomerang: '부메랑', slime: '슬라임', leech: '흡혈',
    drill: '드릴', scatter: '산탄', explosive: '폭발', poison: '독',
    chain: '번개', freeze: '빙결',
  };
  const specials = Object.keys(specialLabels);
  const ownedSet = new Set(
    Object.entries(state.player.specialBullets).filter(([,v]) => v).map(([k]) => k)
  );

  let html = '<table class="fusion-table"><thead><tr><th></th>';
  for (const s of specials) {
    const owned = ownedSet.has(s);
    html += `<th style="${owned ? 'color:#4ade80' : ''}">${specialLabels[s]}${owned ? ' ✓' : ''}</th>`;
  }
  html += '</tr></thead><tbody>';

  for (let i = 0; i < specials.length; i++) {
    const si = specials[i];
    const rowOwned = ownedSet.has(si);
    html += `<tr><th style="${rowOwned ? 'color:#4ade80' : ''}">${specialLabels[si]}${rowOwned ? ' ✓' : ''}</th>`;
    for (let j = 0; j < specials.length; j++) {
      if (j <= i) { html += '<td class="ft-empty"></td>'; continue; }
      const sj = specials[j];
      const key = [si, sj].sort().join('_');
      const name = fusionNames[key] || '—';
      const bothOwned = ownedSet.has(si) && ownedSet.has(sj);
      const active = bothOwned && ownedSet.size === 2;
      const cls = active ? 'ft-active' : bothOwned ? 'ft-owned-both' : '';
      html += `<td class="${cls}" title="${specialLabels[si]} + ${specialLabels[sj]}">${name}</td>`;
    }
    html += '</tr>';
  }
  html += '</tbody></table>';
  html += '<p style="margin-top:10px;font-size:12px;color:#6b7280;text-align:center">✓ 보유 중 &nbsp;|&nbsp; <span style="color:#4ade80">초록</span> = 두 탄환 모두 보유 &nbsp;|&nbsp; <span style="color:#a78bfa">보라</span> = 현재 활성 융합</p>';
  fusionTableGrid.innerHTML = html;
  fusionTablePanel.classList.remove("hidden");
}

function loadMeta() {
  const fallback = {
    shards: 0,
    selectedCharacter: "rookie",
    unlockedCharacters: ["rookie"],
  };

  try {
    return { ...fallback, ...JSON.parse(localStorage.getItem(metaStorageKey) || "{}") };
  } catch {
    return fallback;
  }
}

function saveMeta() {
  localStorage.setItem(metaStorageKey, JSON.stringify(meta));
}

function getSelectedCharacter() {
  return characters.find((character) => character.id === meta.selectedCharacter) || characters[0];
}

function characterStatusText(char) {
  if (meta.selectedCharacter === char.id) return "✓ 선택됨";
  if (meta.unlockedCharacters.includes(char.id)) return "보유 중";
  return `🔹 ${char.cost} Shards`;
}

function renderCharacters() {
  if (!characterList) return;
  if (metaShardText) metaShardText.textContent = meta.shards;
  characterList.innerHTML = "";
  for (const char of characters) {
    const unlocked = meta.unlockedCharacters.includes(char.id);
    const selected = meta.selectedCharacter === char.id;
    const card = document.createElement("button");
    card.type = "button";
    card.className = `character-card${selected ? " selected" : ""}${!unlocked ? " disabled" : ""}`;
    card.innerHTML = `<strong>${char.name}</strong><span>${char.text}</span><small>${characterStatusText(char)}</small>`;
    card.addEventListener("click", () => {
      if (!unlocked) {
        if (meta.shards >= char.cost) {
          meta.shards -= char.cost;
          meta.unlockedCharacters.push(char.id);
          meta.selectedCharacter = char.id;
          saveMeta();
          renderCharacters();
        }
        return;
      }
      meta.selectedCharacter = char.id;
      saveMeta();
      renderCharacters();
    });
    characterList.appendChild(card);
  }
}

function spawnWave() {
  if (state.wave % 10 === 0) {
    spawnBoss("boss");
    return;
  }

  if (state.wave % 5 === 0) {
    spawnBoss("miniBoss");
    return;
  }

  const count = 5 + Math.round(state.wave * 1.5);
  state.enemiesRemaining = count;
  state.enemies = [];

  for (let i = 0; i < count; i += 1) {
    const pos = randomEdgePosition();
    const kind = rollEnemyKind();
    const stats = getEnemyStats(kind);
    state.enemies.push({
      x: pos.x, y: pos.y,
      maxHp: stats.hp,
      ...stats,
      kind, touchTimer: 0,
    });
  }
}

function rollEnemyKind() {
  const roll = Math.random();
  if (roll < 0.004) return "jackpotGold";
  if (roll < 0.032) return "bonusGold";

  const wave = state.wave;
  const pool = [{ k: "normal", w: 10 }];
  if (wave >= 4)  pool.push({ k: "charger",   w: Math.min(4, 1 + Math.floor(wave / 8)) });
  if (wave >= 7)  pool.push({ k: "speeder",   w: Math.min(5, 1 + Math.floor(wave / 6)) });
  if (wave >= 10) pool.push({ k: "splitter",  w: Math.min(3, 1 + Math.floor(wave / 12)) });
  if (wave >= 12) pool.push({ k: "sniper",    w: Math.min(3, 1 + Math.floor(wave / 14)) });
  if (wave >= 18) pool.push({ k: "tank",      w: Math.min(2, Math.floor(wave / 15)) });
  if (wave >= 25) pool.push({ k: "kamikaze",  w: Math.min(3, 1 + Math.floor((wave - 25) / 8)) });
  if (wave >= 35) pool.push({ k: "shielder",  w: Math.min(3, 1 + Math.floor((wave - 35) / 10)) });
  if (wave >= 45) pool.push({ k: "splitter2", w: Math.min(3, 1 + Math.floor((wave - 45) / 12)) });
  if (wave >= 55) pool.push({ k: "ghost",     w: Math.min(2, 1 + Math.floor((wave - 55) / 15)) });
  if (wave >= 65) pool.push({ k: "summoner",  w: Math.min(2, 1 + Math.floor((wave - 65) / 15)) });

  const total = pool.reduce((s, e) => s + e.w, 0);
  let r = Math.random() * total;
  for (const e of pool) { r -= e.w; if (r <= 0) return e.k; }
  return "normal";
}

function getEnemyStats(kind) {
  const baseHp = 1 + Math.floor(state.wave / 3);
  const baseSpeed = 70 + state.wave * 4 + Math.random() * 20;

  if (kind === "jackpotGold") {
    return { r: 17, hp: baseHp + 3, speed: baseSpeed * 0.72 };
  }

  if (kind === "bonusGold") {
    return { r: 15, hp: baseHp + 1, speed: baseSpeed * 0.85 };
  }

  if (kind === "charger") {
    return { r: 15, hp: baseHp + 1, speed: baseSpeed * 0.9,
      chargeSpeed: baseSpeed * 4.5, chargeTimer: 1.5 + Math.random() * 1.5,
      charging: false, chargeDuration: 0 };
  }

  if (kind === "speeder") {
    return { r: 10, hp: 1, speed: baseSpeed * 1.6, zigzagTimer: 0, zigzagAngle: 0 };
  }

  if (kind === "splitter") {
    return { r: 18, hp: baseHp * 2 + 2, speed: baseSpeed * 0.75 };
  }

  if (kind === "tank") {
    const tankHp = baseHp * 5 + 5;
    return { r: 21, hp: tankHp, maxHp: tankHp, speed: baseSpeed * 0.38, armor: 2 };
  }

  if (kind === "mini") {
    return { r: 9, hp: 1, speed: baseSpeed * 1.5 };
  }

  if (kind === "kamikaze") {
    return { r: 13, hp: 1, speed: baseSpeed * 2.0, kamikazeExplode: true, explodeRadius: 55, explodeDmg: Math.max(2, 1 + Math.floor(state.wave / 15)) };
  }

  if (kind === "shielder") {
    return { r: 19, hp: baseHp * 3 + 3, speed: baseSpeed * 0.5,
      armored: false, armorTimer: 2.0, armorCooldown: 3.5, armorDuration: 1.8 };
  }

  if (kind === "splitter2") {
    return { r: 22, hp: baseHp * 3 + 4, speed: baseSpeed * 0.65 };
  }

  if (kind === "ghost") {
    return { r: 16, hp: Math.ceil(baseHp * 1.5) + 2, speed: baseSpeed * 0.9,
      ghostInvincible: false, ghostTimer: 1.5 + Math.random() * 0.5,
      ghostActiveDuration: 0.85, ghostCooldown: 0.85 };
  }

  if (kind === "summoner") {
    // 소환 간격: wave 65=5s, wave 75=7s, wave 80+=8s (더 많이 등장할수록 느리게 소환)
    const summonInterval = Math.min(8.0, 4.0 + Math.floor((wave - 65) / 5));
    return { r: 20, hp: baseHp * 2 + 3, speed: baseSpeed * 0.45, summonTimer: summonInterval, summonInterval };
  }

  if (kind === "sniper") {
    const sHp = baseHp + 2;
    return { r: 13, hp: sHp, speed: baseSpeed * 0.45, shootTimer: 1.2 + Math.random() };
  }

  return { r: 13, hp: baseHp, speed: baseSpeed };
}

function spawnBoss(kind) {
  const isTrueBoss = kind === "boss";
  const playerDps = (state.player.damage || 1) * (1000 / Math.max(80, state.player.fireDelay || 200));
  const baseHp = isTrueBoss ? 40 + state.wave * 4 : 20 + state.wave * 3;
  const bossHp = Math.floor(baseHp + playerDps * (isTrueBoss ? 2 : 1.3));

  state.enemies = [{
    x: canvas.width / 2,
    y: 90,
    r: isTrueBoss ? 46 : 34,
    hp: bossHp,
    maxHp: bossHp,
    speed: isTrueBoss ? 58 + state.wave * 2 : 72 + state.wave * 2,
    kind,
    touchTimer: 0,
  }];

  const escortCount = isTrueBoss
    ? 8 + Math.floor(state.wave / 10)
    : 2 + Math.floor(state.wave / 15);
  for (let i = 0; i < escortCount; i += 1) {
    const pos = randomEdgePosition();
    const eStats = getEnemyStats("normal");
    state.enemies.push({
      x: pos.x, y: pos.y,
      maxHp: eStats.hp,
      ...eStats,
      kind: "normal", touchTimer: 0,
    });
  }
  state.enemiesRemaining = 1 + escortCount;
}

function getEnemyContactDamage(enemy) {
  const bossTier = Math.floor(state.wave / 20);
  const normalTier = Math.floor(state.wave / 30);
  if (enemy.kind === "boss") return 2 + bossTier;
  if (enemy.kind === "miniBoss") return 1 + bossTier;
  if (enemy.kind === "jackpotGold" || enemy.kind === "bonusGold") return 1;
  if (enemy.kind === "charger") return enemy.charging ? 2 + normalTier : 1 + normalTier;
  if (enemy.kind === "tank") return 2 + normalTier;
  if (enemy.kind === "speeder" || enemy.kind === "splitter" || enemy.kind === "mini") return 1;
  if (enemy.kind === "sniper") return 1;
  if (enemy.kind === "kamikaze") return 1;
  if (enemy.kind === "shielder") return 2 + normalTier;
  if (enemy.kind === "splitter2") return 2 + normalTier;
  if (enemy.kind === "ghost") return 1 + normalTier;
  if (enemy.kind === "summoner") return 1 + normalTier;
  return 1 + normalTier;
}

function randomEdgePosition() {
  const side = Math.floor(Math.random() * 4);
  if (side === 0) return { x: Math.random() * canvas.width, y: -20 };
  if (side === 1) return { x: canvas.width + 20, y: Math.random() * canvas.height };
  if (side === 2) return { x: Math.random() * canvas.width, y: canvas.height + 20 };
  return { x: -20, y: Math.random() * canvas.height };
}

function update(dt, now) {
  if (state.mode === "ready") {
    updateShardDrops(dt);
    updateParticles(dt);
    updateHud();
    return;
  }

  if (state.mode === "shop") {
    updateHud();
    return;
  }

  if (state.mode !== "playing") return;

  updatePlayer(dt);
  shoot(now);
  updateBullets(dt);
  if (state.mode !== "playing") {
    updateShardDrops(dt);
    updateGoldDrops(dt);
    updateParticles(dt);
    updateHud();
    return;
  }
  updateEnemies(dt);
  updateEnemyBullets(dt);
  updateGoldDrops(dt);
  updateShardDrops(dt);
  updateParticles(dt);
  updateFloatTexts(dt);
  updateWaveToast(dt);
  updateFusionToast(dt);
  state.screenShake = Math.max(0, state.screenShake - dt * 5);
  checkWaveClear();
  updateHud();
}

function updatePlayer(dt) {
  const player = state.player;
  let dx = 0;
  let dy = 0;

  if (keys.has("KeyW")) dy -= 1;
  if (keys.has("KeyS")) dy += 1;
  if (keys.has("KeyA")) dx -= 1;
  if (keys.has("KeyD")) dx += 1;

  const len = Math.hypot(dx, dy) || 1;
  const mvx = (dx / len) * player.speed;
  const mvy = (dy / len) * player.speed;
  player.x += mvx * dt;
  player.y += mvy * dt;
  player.x = clamp(player.x, player.r, canvas.width - player.r);
  player.y = clamp(player.y, player.r, canvas.height - player.r);
  player.hurtTimer = Math.max(0, player.hurtTimer - dt);
  player.leechHealTimer = Math.max(0, (player.leechHealTimer || 0) - dt);
  if (dx !== 0 || dy !== 0) { player.lastVx = mvx; player.lastVy = mvy; }
}

function getActiveFusion(sp) {
  const active = Object.keys(sp).filter(k => sp[k]).sort();
  if (active.length < 2) return null;
  // 특수탄이 3개 이상이어도 첫 두 개로 융합 유지 (빌드가 강해질수록 융합이 꺼지는 역행 방지)
  return active[0] + '_' + active[1];
}

function makeSideBullet(player, angle, sp, fusion, dmg) {
  const bx = player.x + Math.cos(angle) * 18;
  const by = player.y + Math.sin(angle) * 18;
  const spd = player.bulletSpeed;
  const vx = Math.cos(angle) * spd;
  const vy = Math.sin(angle) * spd;
  const szB = player.bulletSizeBonus;
  const hitEnemies = new Set();

  let imitateType = null;
  if (fusion) {
    const parts = fusion.split('_');
    if (parts.includes('boomerang'))      imitateType = 'boomerang';
    else if (parts.includes('slime'))     imitateType = 'slime';
    else if (parts.includes('leech'))     imitateType = 'leech';
    else if (parts.includes('drill'))     imitateType = 'drill';
    else if (parts.includes('scatter'))   imitateType = 'scatter';
    else if (parts.includes('explosive')) imitateType = 'explosive';
    else if (parts.includes('poison'))    imitateType = 'poison';
    else if (parts.includes('freeze'))    imitateType = 'freeze';
    else if (parts.includes('chain'))     imitateType = 'chain';
    else                                  imitateType = 'machinegun';
  } else {
    if (sp.boomerang)       imitateType = 'boomerang';
    else if (sp.slime)      imitateType = 'slime';
    else if (sp.leech)      imitateType = 'leech';
    else if (sp.drill)      imitateType = 'drill';
    else if (sp.scatter)    imitateType = 'scatter';
    else if (sp.machinegun) imitateType = 'machinegun';
    else if (sp.explosive)  imitateType = 'explosive';
    else if (sp.poison)     imitateType = 'poison';
    else if (sp.chain)      imitateType = 'chain';
    else if (sp.freeze)     imitateType = 'freeze';
  }
  const heals  = !!(fusion && fusion.includes('leech'));
  const drills = !!(fusion && fusion.includes('drill'));

  switch (imitateType) {
    case 'boomerang':
      return { type: 'boomerang', x: bx, y: by, vx: vx * 0.85, vy: vy * 0.85,
               r: 7 + szB, damage: dmg, life: 2.5, boomerangState: 'out',
               bounces: 0, pierce: Math.max(1, player.pierce),
               ...(heals  && { fusionHeals: true }),
               ...(drills && { fusionDrills: true, pierce: 999, drillMultiplier: 1.0 }),
               hitEnemies };
    case 'slime':
      return { type: 'slime', x: bx, y: by, vx: vx * 0.85, vy: vy * 0.85,
               r: 7 + szB, damage: dmg, life: 3.0,
               slimeHops: Math.max(1, player.bounces + 1),
               ...(heals  && { fusionHeals: true }),
               ...(drills && { fusionDrills: true, pierce: 999, drillMultiplier: 1.0 }),
               hitEnemies };
    case 'leech':
      return { type: 'leech', x: bx, y: by, vx, vy,
               r: 5 + szB, damage: dmg,
               life: player.bounces > 0 ? 2.0 : 1.2,
               bounces: player.bounces, pierce: player.pierce,
               lightBounceBoost: player.lightBounceBoost, growOnBounce: player.bounceGrow,
               ...(drills && { fusionDrills: true, pierce: 999, bounces: 0, drillMultiplier: 1.0 }),
               fusionHeals: true, hitEnemies };
    case 'drill':
      return { type: 'drill', x: bx, y: by, vx: vx * 1.1, vy: vy * 1.1,
               r: 5 + szB, damage: dmg, life: 1.2, bounces: 0, pierce: 999,
               drillMultiplier: 1.0,
               ...(heals && { fusionHeals: true }),
               hitEnemies };
    case 'scatter':
      return { type: 'scatter', x: bx, y: by, vx, vy, r: 4, damage: dmg,
               life: player.bounces > 0 ? 1.5 : 0.8,
               bounces: player.bounces, pierce: player.pierce,
               lightBounceBoost: player.lightBounceBoost, growOnBounce: player.bounceGrow,
               hitEnemies };
    case 'machinegun':
      return { type: 'machinegun', x: bx, y: by, vx: vx * 1.3, vy: vy * 1.3,
               r: 3 + szB * 0.3, damage: dmg, life: 0.8,
               bounces: player.bounces, pierce: player.pierce, hitEnemies };
    case 'explosive':
      return { type: 'explosive', x: bx, y: by, vx: vx * 0.9, vy: vy * 0.9,
               r: 9 + szB, damage: dmg, life: 1.8, bounces: 0,
               pierce: Math.max(0, player.pierce - 1), hitEnemies };
    case 'poison':
      return { type: 'poison', x: bx, y: by, vx: vx * 0.85, vy: vy * 0.85,
               r: 6 + szB, damage: dmg, life: 2.0,
               bounces: player.bounces, pierce: player.pierce, hitEnemies };
    case 'chain':
      return { type: 'chain', x: bx, y: by, vx: vx * 1.2, vy: vy * 1.2,
               r: 5 + szB, damage: dmg, life: 1.2, bounces: 0,
               pierce: player.pierce, chainCount: 1, hitEnemies };
    case 'freeze':
      return { type: 'freeze', x: bx, y: by, vx: vx * 0.8, vy: vy * 0.8,
               r: 7 + szB, damage: dmg, life: 1.8,
               bounces: player.bounces, pierce: player.pierce, hitEnemies };
    default:
      return { x: bx, y: by, vx, vy, r: 5 + szB, damage: dmg,
               life: 1.0, bounces: player.bounces, pierce: player.pierce, hitEnemies };
  }
}

function shoot(now) {
  const player = state.player;
  const aim = getAimDirection();
  if (!aim) return;

  const sp = player.specialBullets;
  const fusion = getActiveFusion(sp);
  const hasSpecial = sp.machinegun || sp.boomerang || sp.slime || sp.leech || sp.drill || sp.scatter || sp.explosive || sp.poison || sp.chain || sp.freeze;
  const baseAngle = Math.atan2(aim.y, aim.x);

  // 기관총: 독립 타이머로 빠르게 연사 (다른 특수탄과 별개)
  if (sp.machinegun) {
    const mgDelay = Math.max(70, player.fireDelay * 0.22);
    if (!player.lastMachinegunShot || now - player.lastMachinegunShot >= mgDelay) {
      const spd = player.bulletSpeed;
      const dmg = player.damage;
      const szB = player.bulletSizeBonus;
      const ang = baseAngle + (Math.random() - 0.5) * 0.06;
      const bx = player.x + Math.cos(ang) * 16, by = player.y + Math.sin(ang) * 16;
      const ax = Math.cos(ang), ay = Math.sin(ang);

      if (fusion === 'boomerang_machinegun') {
        state.bullets.push({
          type: 'fusion_mg_boom', fusionPhysics: 'boomerang',
          x: bx, y: by, vx: ax * spd * 0.85, vy: ay * spd * 0.85,
          r: (8 + szB) * 0.65, damage: dmg, life: 3.0,
          boomerangState: 'out', bounces: 0, pierce: Math.max(2, player.pierce),
          hitEnemies: new Set(),
        });
      } else if (fusion === 'leech_machinegun') {
        state.bullets.push({
          type: 'fusion_mg_leech', fusionPhysics: 'normal', fusionHeals: true,
          x: bx, y: by, vx: ax * spd * 1.3, vy: ay * spd * 1.3,
          r: 5, damage: dmg, life: 1.0,
          bounces: player.bounces, pierce: player.pierce,
          lightBounceBoost: player.lightBounceBoost, growOnBounce: player.bounceGrow,
          hitEnemies: new Set(),
        });
      } else if (fusion === 'machinegun_slime') {
        state.bullets.push({
          type: 'fusion_mg_slime', fusionPhysics: 'slime',
          x: bx, y: by, vx: ax * spd * 1.0, vy: ay * spd * 1.0,
          r: 5, damage: dmg, life: 4.0, slimeHops: player.bounces + 3,
          hitEnemies: new Set(),
        });
      } else if (fusion === 'drill_machinegun') {
        state.bullets.push({
          type: 'fusion_mg_drill', fusionPhysics: 'normal', fusionDrills: true,
          x: bx, y: by, vx: ax * spd * 1.2, vy: ay * spd * 1.2,
          r: 5, damage: dmg, life: 1.5, bounces: 0, pierce: 999,
          drillMultiplier: 1.0, hitEnemies: new Set(),
        });
      } else if (fusion === 'machinegun_scatter') {
        for (const offset of [-0.22, 0, 0.22]) {
          const sa = ang + offset;
          state.bullets.push({
            type: 'fusion_mg_scatter', fusionPhysics: 'normal',
            x: bx, y: by,
            vx: Math.cos(sa) * spd * 1.3, vy: Math.sin(sa) * spd * 1.3,
            r: 4, damage: Math.max(1, Math.ceil(dmg * 0.6)),
            life: 0.9, bounces: 0, pierce: player.pierce, hitEnemies: new Set(),
          });
        }
      } else if (fusion === 'chain_machinegun') {
        state.bullets.push({
          type: 'fusion_mg_chain', fusionPhysics: 'normal', chainCount: 1,
          x: bx, y: by, vx: ax * spd * 1.3, vy: ay * spd * 1.3,
          r: 5, damage: dmg, life: 0.9,
          bounces: 0, pierce: player.pierce, hitEnemies: new Set(),
        });
      } else if (fusion === 'explosive_machinegun') {
        state.bullets.push({
          type: 'fusion_mg_explosive', fusionPhysics: 'normal', fusionExplodes: true,
          x: bx, y: by, vx: ax * spd * 1.1, vy: ay * spd * 1.1,
          r: 6, damage: dmg, life: 1.0, bounces: 0, pierce: 0, hitEnemies: new Set(),
        });
      } else if (fusion === 'freeze_machinegun') {
        state.bullets.push({
          type: 'fusion_mg_freeze', fusionPhysics: 'normal', fusionFreezes: true,
          x: bx, y: by, vx: ax * spd * 1.1, vy: ay * spd * 1.1,
          r: 4, damage: dmg, life: 0.8, bounces: 0, pierce: player.pierce, hitEnemies: new Set(),
        });
      } else if (fusion === 'machinegun_poison') {
        state.bullets.push({
          type: 'fusion_mg_poison', fusionPhysics: 'normal', fusionPoisons: true,
          x: bx, y: by, vx: ax * spd * 1.2, vy: ay * spd * 1.2,
          r: 4, damage: dmg, life: 0.9, bounces: 0, pierce: player.pierce, hitEnemies: new Set(),
        });
      } else {
        // 단독 기관총
        state.bullets.push({
          type: "machinegun",
          x: bx, y: by,
          vx: ax * spd * 1.3, vy: ay * spd * 1.3,
          r: 4 + szB * 0.4,
          damage: dmg,
          life: 1.0, bounces: player.bounces, pierce: player.pierce,
          lightBounceBoost: player.lightBounceBoost, growOnBounce: player.bounceGrow,
          hitEnemies: new Set(),
        });
      }
      // 기관총 보조 탄 (machinegun 타입 유지)
      if (player.sideShots > 0) {
        const sdmg = Math.max(1, Math.ceil(dmg * 0.45));
        const shotCount = 1 + Math.min(player.sideShots, 2);
        for (let si = 0; si < shotCount; si++) {
          const sOff = (si - (shotCount - 1) / 2) * 0.22;
          if (sOff === 0) continue;
          state.bullets.push(makeSideBullet(player, ang + sOff, sp, fusion, sdmg));
        }
      }
      player.lastMachinegunShot = now;
    }
  }

  // 메인 타이머 체크 (기관총 제외 나머지)
  if (now - player.lastShot < player.fireDelay) return;
  player.lastShot = now;

  // 융합탄 (machinegun 미포함 2종 활성)
  if (fusion && !fusion.includes('machinegun')) {
    const spd = player.bulletSpeed;
    const dmg = player.damage;
    const szB = player.bulletSizeBonus;
    const x = player.x + aim.x * 18, y = player.y + aim.y * 18;

    if (fusion === 'boomerang_leech') {
      state.bullets.push({
        type: 'fusion_boom_leech', fusionPhysics: 'boomerang', fusionHeals: true,
        x, y, vx: aim.x * spd * 0.85, vy: aim.y * spd * 0.85,
        r: 10 + szB, damage: dmg, life: 3.0,
        boomerangState: 'out', bounces: 0, pierce: Math.max(2, player.pierce),
        hitEnemies: new Set(),
      });
    } else if (fusion === 'boomerang_slime') {
      state.bullets.push({
        type: 'fusion_boom_slime', fusionPhysics: 'boomerang',
        x, y, vx: aim.x * spd * 0.85, vy: aim.y * spd * 0.85,
        r: 10 + szB, damage: dmg, life: 3.5,
        boomerangState: 'out', bounces: 0, pierce: Math.max(2, player.pierce),
        slimeHops: player.bounces + 2, hitEnemies: new Set(),
      });
    } else if (fusion === 'boomerang_drill') {
      state.bullets.push({
        type: 'fusion_boom_drill', fusionPhysics: 'boomerang', fusionDrills: true,
        x, y, vx: aim.x * spd * 0.85, vy: aim.y * spd * 0.85,
        r: 10 + szB, damage: dmg, life: 3.0,
        boomerangState: 'out', bounces: 0, pierce: 999,
        drillMultiplier: 1.0, hitEnemies: new Set(),
      });
    } else if (fusion === 'boomerang_scatter') {
      for (const offset of [-0.25, 0, 0.25]) {
        const angle = baseAngle + offset;
        state.bullets.push({
          type: 'fusion_boom_scatter', fusionPhysics: 'boomerang',
          x, y,
          vx: Math.cos(angle) * spd * 0.85, vy: Math.sin(angle) * spd * 0.85,
          r: 7 + szB * 0.5, damage: Math.max(1, Math.ceil(dmg * 0.6)), life: 3.0,
          boomerangState: 'out', bounces: 0, pierce: 2, hitEnemies: new Set(),
        });
      }
    } else if (fusion === 'leech_slime') {
      state.bullets.push({
        type: 'fusion_leech_slime', fusionPhysics: 'slime', fusionHeals: true,
        x, y, vx: aim.x * spd * 0.85, vy: aim.y * spd * 0.85,
        r: 10 + szB, damage: dmg, life: 5.0, slimeHops: player.bounces + 4,
        hitEnemies: new Set(),
      });
    } else if (fusion === 'drill_leech') {
      state.bullets.push({
        type: 'fusion_leech_drill', fusionPhysics: 'normal', fusionHeals: true, fusionDrills: true,
        x, y, vx: aim.x * spd * 1.1, vy: aim.y * spd * 1.1,
        r: 7 + szB, damage: dmg, life: 1.8, bounces: 0, pierce: 999,
        drillMultiplier: 1.0, hitEnemies: new Set(),
      });
    } else if (fusion === 'leech_scatter') {
      for (let i = 0; i < 5; i++) {
        const spread = (Math.random() - 0.5) * 0.65;
        const ang = baseAngle + spread;
        state.bullets.push({
          type: 'fusion_leech_scatter', fusionPhysics: 'normal', fusionHeals: true,
          x, y,
          vx: Math.cos(ang) * spd * 1.15, vy: Math.sin(ang) * spd * 1.15,
          r: 4, damage: Math.max(1, Math.ceil(dmg * 0.6)),
          life: 0.9, bounces: 0, pierce: player.pierce, hitEnemies: new Set(),
        });
      }
    } else if (fusion === 'drill_slime') {
      state.bullets.push({
        type: 'fusion_drill_slime', fusionPhysics: 'slime', fusionDrills: true,
        x, y, vx: aim.x * spd * 0.9, vy: aim.y * spd * 0.9,
        r: 8 + szB, damage: dmg, life: 5.0, slimeHops: player.bounces + 3,
        drillMultiplier: 1.0, pierce: 999, hitEnemies: new Set(),
      });
    } else if (fusion === 'scatter_slime') {
      for (const offset of [-0.25, 0, 0.25]) {
        const angle = baseAngle + offset;
        state.bullets.push({
          type: 'fusion_scatter_slime', fusionPhysics: 'slime',
          x, y,
          vx: Math.cos(angle) * spd * 0.85, vy: Math.sin(angle) * spd * 0.85,
          r: 7, damage: Math.max(1, Math.ceil(dmg * 0.6)),
          life: 4.0, slimeHops: player.bounces + 2, hitEnemies: new Set(),
        });
      }
    } else if (fusion === 'drill_scatter') {
      for (const offset of [-0.22, 0, 0.22]) {
        const angle = baseAngle + offset;
        state.bullets.push({
          type: 'fusion_drill_scatter', fusionPhysics: 'normal', fusionDrills: true,
          x, y,
          vx: Math.cos(angle) * spd * 1.1, vy: Math.sin(angle) * spd * 1.1,
          r: 5, damage: Math.max(1, Math.ceil(dmg * 0.6)),
          life: 1.5, bounces: 0, pierce: 999, drillMultiplier: 1.0,
          hitEnemies: new Set(),
        });
      }
    } else if (fusion === 'chain_explosive') {
      for (const offset of [-0.2, 0, 0.2]) {
        state.bullets.push({
          type: 'fusion_chain_explosive', fusionPhysics: 'normal', fusionExplodes: true, chainCount: 1,
          x, y, vx: Math.cos(baseAngle + offset) * spd * 1.1, vy: Math.sin(baseAngle + offset) * spd * 1.1,
          r: 7 + szB, damage: Math.max(1, Math.ceil(dmg * 0.75)), life: 1.4,
          bounces: 0, pierce: player.pierce, hitEnemies: new Set(),
        });
      }
    } else if (fusion === 'chain_freeze') {
      state.bullets.push({
        type: 'fusion_chain_freeze', fusionPhysics: 'normal', fusionFreezes: true, chainCount: 2,
        x, y, vx: aim.x * spd * 1.15, vy: aim.y * spd * 1.15,
        r: 7 + szB, damage: dmg, life: 1.3, bounces: 0, pierce: player.pierce, hitEnemies: new Set(),
      });
    } else if (fusion === 'chain_poison') {
      state.bullets.push({
        type: 'fusion_chain_poison', fusionPhysics: 'normal', fusionPoisons: true, chainCount: 2,
        x, y, vx: aim.x * spd * 1.1, vy: aim.y * spd * 1.1,
        r: 7 + szB, damage: dmg, life: 1.5, bounces: 0, pierce: player.pierce + 1, hitEnemies: new Set(),
      });
    } else if (fusion === 'explosive_freeze') {
      state.bullets.push({
        type: 'fusion_explosive_freeze', fusionPhysics: 'normal', fusionExplodes: true, fusionFreezes: true,
        x, y, vx: aim.x * spd * 0.85, vy: aim.y * spd * 0.85,
        r: 10 + szB, damage: dmg, life: 2.0, bounces: 0, pierce: 0, hitEnemies: new Set(),
      });
    } else if (fusion === 'explosive_poison') {
      state.bullets.push({
        type: 'fusion_explosive_poison', fusionPhysics: 'normal', fusionExplodes: true, fusionPoisons: true,
        x, y, vx: aim.x * spd * 0.9, vy: aim.y * spd * 0.9,
        r: 10 + szB, damage: dmg, life: 1.8, bounces: 0, pierce: 0, hitEnemies: new Set(),
      });
    } else if (fusion === 'freeze_poison') {
      state.bullets.push({
        type: 'fusion_freeze_poison', fusionPhysics: 'normal', fusionFreezes: true, fusionPoisons: true,
        x, y, vx: aim.x * spd * 0.85, vy: aim.y * spd * 0.85,
        r: 9 + szB, damage: dmg, life: 2.0, bounces: player.bounces, pierce: player.pierce, hitEnemies: new Set(),
      });
    } else {
      // 제네릭 폴백: 양쪽 특수탄 속성 조합
      const parts = fusion.split('_');
      const hasBoomerang = parts.includes('boomerang');
      const hasSlime     = parts.includes('slime');
      const hasDrill     = parts.includes('drill');
      const hasScatter   = parts.includes('scatter');
      const hasLeech     = parts.includes('leech');
      const hasExplosive = parts.includes('explosive');
      const hasPoison    = parts.includes('poison');
      const hasChain     = parts.includes('chain');
      const hasFreeze    = parts.includes('freeze');
      const extraProps = {
        ...(hasLeech    && { fusionHeals: true }),
        ...(hasDrill    && { fusionDrills: true, drillMultiplier: 1.0 }),
        ...(hasExplosive && { fusionExplodes: true }),
        ...(hasPoison   && { fusionPoisons: true }),
        ...(hasChain    && { chainCount: 1 }),
        ...(hasFreeze   && { fusionFreezes: true }),
      };
      if (hasScatter) {
        for (let i = 0; i < 4; i++) {
          const ang = baseAngle + (Math.random() - 0.5) * 0.65;
          state.bullets.push({
            type: 'fusion_generic_scatter', fusionPhysics: hasSlime ? 'slime' : 'normal',
            x, y, vx: Math.cos(ang) * spd * 1.1, vy: Math.sin(ang) * spd * 1.1,
            r: 5, damage: Math.max(1, Math.ceil(dmg * 0.6)), life: 1.2,
            bounces: 0, pierce: hasDrill ? 999 : player.pierce,
            ...(hasSlime && { slimeHops: player.bounces + 2 }),
            hitEnemies: new Set(), ...extraProps,
          });
        }
      } else if (hasBoomerang) {
        state.bullets.push({
          type: 'fusion_generic_boom', fusionPhysics: 'boomerang',
          x, y, vx: aim.x * spd * 0.85, vy: aim.y * spd * 0.85,
          r: 10 + szB, damage: dmg, life: 3.0,
          boomerangState: 'out', bounces: 0, pierce: Math.max(2, player.pierce),
          hitEnemies: new Set(), ...extraProps,
        });
      } else if (hasSlime) {
        state.bullets.push({
          type: 'fusion_generic_slime', fusionPhysics: 'slime',
          x, y, vx: aim.x * spd * 0.85, vy: aim.y * spd * 0.85,
          r: 9 + szB, damage: dmg, life: 4.0,
          slimeHops: player.bounces + 3, hitEnemies: new Set(), ...extraProps,
        });
      } else {
        state.bullets.push({
          type: 'fusion_generic', fusionPhysics: 'normal',
          x, y, vx: aim.x * spd, vy: aim.y * spd,
          r: 7 + szB, damage: dmg, life: 1.8,
          bounces: hasDrill ? 0 : player.bounces,
          pierce: hasDrill ? 999 : player.pierce,
          hitEnemies: new Set(), ...extraProps,
        });
      }
    }
    // 보조 탄(sideShots) — 융합탄 타입 유지
    if (player.sideShots > 0) {
      const sdmg = Math.max(1, Math.ceil(player.damage * 0.45));
      const shotCount = 1 + Math.min(player.sideShots, 2);
      for (let i = 0; i < shotCount; i++) {
        const offset = (i - (shotCount - 1) / 2) * 0.18;
        if (offset === 0) continue;
        state.bullets.push(makeSideBullet(player, baseAngle + offset, sp, fusion, sdmg));
      }
    }
    return;
  }

  // 일반 탄환 (특수탄 없을 때)
  if (!hasSpecial) {
    const shotCount = 1 + Math.min(player.sideShots, 2);
    const spread = shotCount === 1 ? 0 : 0.18;
    for (let i = 0; i < shotCount; i += 1) {
      const offset = (i - (shotCount - 1) / 2) * spread;
      const angle = baseAngle + offset;
      const isMain = i === Math.floor(shotCount / 2);
      state.bullets.push({
        x: player.x + Math.cos(angle) * 18, y: player.y + Math.sin(angle) * 18,
        vx: Math.cos(angle) * player.bulletSpeed, vy: Math.sin(angle) * player.bulletSpeed,
        r: 5 + player.bulletSizeBonus,
        damage: isMain ? player.damage : Math.max(1, Math.ceil(player.damage * 0.45)),
        life: player.bounces > 0 ? 2.4 : 1.25,
        bounces: player.bounces, pierce: player.pierce,
        lightBounceBoost: player.lightBounceBoost, growOnBounce: player.bounceGrow,
        hitEnemies: new Set(),
      });
    }
  }

  // 특수탄 보유 시 보조 탄 — 현재 특수탄 타입 유지 (machinegun은 자체 타이머에서 처리)
  if (hasSpecial && !sp.machinegun && player.sideShots > 0) {
    const sdmg = Math.max(1, Math.ceil(player.damage * 0.45));
    const shotCount = 1 + Math.min(player.sideShots, 2);
    for (let i = 0; i < shotCount; i += 1) {
      const offset = (i - (shotCount - 1) / 2) * 0.18;
      if (offset === 0) continue;
      state.bullets.push(makeSideBullet(player, baseAngle + offset, sp, null, sdmg));
    }
  }

  // 부메랑
  if (sp.boomerang) {
    state.bullets.push({
      type: "boomerang",
      x: player.x + aim.x * 18, y: player.y + aim.y * 18,
      vx: aim.x * player.bulletSpeed * 0.85, vy: aim.y * player.bulletSpeed * 0.85,
      r: 10 + player.bulletSizeBonus, damage: player.damage,
      life: 3.0, bounces: 0, pierce: Math.max(2, player.pierce), hitEnemies: new Set(),
      boomerangState: "out",
    });
  }

  // 슬라임 탄환: 벽 + 적에게 튕기며 데미지
  if (sp.slime) {
    state.bullets.push({
      type: "slime",
      x: player.x + aim.x * 18, y: player.y + aim.y * 18,
      vx: aim.x * player.bulletSpeed * 0.85, vy: aim.y * player.bulletSpeed * 0.85,
      r: 10 + player.bulletSizeBonus, damage: player.damage,
      life: 5.0, bounces: 0, slimeHops: player.bounces + 4,
      hitEnemies: new Set(),
    });
  }

  // 흡혈 탄환: 적 명중 시 HP 회복
  if (sp.leech) {
    state.bullets.push({
      type: "leech",
      x: player.x + aim.x * 18, y: player.y + aim.y * 18,
      vx: aim.x * player.bulletSpeed, vy: aim.y * player.bulletSpeed,
      r: 7 + player.bulletSizeBonus, damage: player.damage,
      life: player.bounces > 0 ? 2.4 : 1.5,
      bounces: player.bounces, pierce: player.pierce,
      lightBounceBoost: player.lightBounceBoost, growOnBounce: player.bounceGrow,
      hitEnemies: new Set(),
    });
  }

  // 드릴 탄환: 관통 시마다 피해 증가
  if (sp.drill) {
    state.bullets.push({
      type: "drill",
      x: player.x + aim.x * 18, y: player.y + aim.y * 18,
      vx: aim.x * player.bulletSpeed * 1.1, vy: aim.y * player.bulletSpeed * 1.1,
      r: 7 + player.bulletSizeBonus, damage: player.damage,
      life: 1.8, bounces: 0, pierce: 999,
      drillMultiplier: 1.0,
      hitEnemies: new Set(),
    });
  }

  // 산탄: 5발 랜덤 확산
  if (sp.scatter) {
    for (let i = 0; i < 5; i += 1) {
      const spread = (Math.random() - 0.5) * 0.65;
      const ang = baseAngle + spread;
      state.bullets.push({
        type: "scatter",
        x: player.x + Math.cos(ang) * 16, y: player.y + Math.sin(ang) * 16,
        vx: Math.cos(ang) * player.bulletSpeed * 1.15, vy: Math.sin(ang) * player.bulletSpeed * 1.15,
        r: 4, damage: Math.max(1, Math.ceil(player.damage * 0.6)),
        life: player.bounces > 0 ? 2.0 : 0.9, bounces: player.bounces, pierce: player.pierce,
        lightBounceBoost: player.lightBounceBoost, growOnBounce: player.bounceGrow,
        hitEnemies: new Set(),
      });
    }
  }

  // 폭발 탄환: 착탄 시 AoE
  if (sp.explosive) {
    state.bullets.push({
      type: "explosive",
      x: player.x + aim.x * 18, y: player.y + aim.y * 18,
      vx: aim.x * player.bulletSpeed * 0.9, vy: aim.y * player.bulletSpeed * 0.9,
      r: 9 + player.bulletSizeBonus, damage: player.damage,
      life: 1.8, bounces: 0, pierce: player.pierce, hitEnemies: new Set(),
    });
  }

  // 독 탄환: 명중한 적에게 독 상태
  if (sp.poison) {
    state.bullets.push({
      type: "poison",
      x: player.x + aim.x * 18, y: player.y + aim.y * 18,
      vx: aim.x * player.bulletSpeed * 0.85, vy: aim.y * player.bulletSpeed * 0.85,
      r: 7 + player.bulletSizeBonus, damage: player.damage,
      life: 2.0, bounces: player.bounces, pierce: player.pierce,
      lightBounceBoost: player.lightBounceBoost, growOnBounce: player.bounceGrow,
      hitEnemies: new Set(),
    });
  }

  // 번개(체인) 탄환: 명중 시 인접 적으로 체인
  if (sp.chain) {
    state.bullets.push({
      type: "chain",
      x: player.x + aim.x * 18, y: player.y + aim.y * 18,
      vx: aim.x * player.bulletSpeed * 1.2, vy: aim.y * player.bulletSpeed * 1.2,
      r: 6 + player.bulletSizeBonus, damage: player.damage,
      life: 1.2, bounces: 0, pierce: player.pierce,
      chainCount: 2, hitEnemies: new Set(),
    });
  }

  // 빙결 탄환: 명중한 적 이동속도 감소
  if (sp.freeze) {
    state.bullets.push({
      type: "freeze",
      x: player.x + aim.x * 18, y: player.y + aim.y * 18,
      vx: aim.x * player.bulletSpeed * 0.8, vy: aim.y * player.bulletSpeed * 0.8,
      r: 8 + player.bulletSizeBonus, damage: player.damage,
      life: 1.8, bounces: player.bounces, pierce: player.pierce,
      lightBounceBoost: player.lightBounceBoost, growOnBounce: player.bounceGrow,
      hitEnemies: new Set(),
    });
  }
}

function getAimDirection() {
  let dx = 0;
  let dy = 0;

  if (keys.has("ArrowUp")) dy -= 1;
  if (keys.has("ArrowDown")) dy += 1;
  if (keys.has("ArrowLeft")) dx -= 1;
  if (keys.has("ArrowRight")) dx += 1;

  if (dx === 0 && dy === 0) return null;
  const len = Math.hypot(dx, dy);
  return { x: dx / len, y: dy / len };
}

function triggerExplosion(cx, cy, radius, aoeDmg, excludeEnemy, big = false) {
  addParticles(cx, cy, "#f97316", big ? 14 : 6);
  addParticles(cx, cy, "#fbbf24", big ? 8 : 3);
  if (big) state.screenShake = Math.min(1, state.screenShake + 0.12);
  for (const e of state.enemies) {
    if (e === excludeEnemy) continue;
    if (Math.hypot(e.x - cx, e.y - cy) < radius) {
      const dmg = Math.max(1, aoeDmg);
      e.hp -= dmg;
      addFloatText(e.x + (Math.random() - 0.5) * 14, e.y - e.r - 5, String(dmg), "#f97316");
      addParticles(e.x, e.y, "#fbbf24", big ? 5 : 2);
    }
  }
}

function updateBullets(dt) {
  const brambleSpawn = [];
  for (const bullet of state.bullets) {

    // 슬라임 탄환: 벽에서 튕기며 이동 (적 충돌은 아래 별도 처리)
    if (bullet.type === "slime" || bullet.fusionPhysics === "slime") {
      bullet.x += bullet.vx * dt;
      bullet.y += bullet.vy * dt;
      bullet.life -= dt;
      if (bullet.x < bullet.r) { bullet.x = bullet.r; bullet.vx = Math.abs(bullet.vx); }
      else if (bullet.x > canvas.width - bullet.r) { bullet.x = canvas.width - bullet.r; bullet.vx = -Math.abs(bullet.vx); }
      if (bullet.y < bullet.r) { bullet.y = bullet.r; bullet.vy = Math.abs(bullet.vy); }
      else if (bullet.y > canvas.height - bullet.r) { bullet.y = canvas.height - bullet.r; bullet.vy = -Math.abs(bullet.vy); }
      continue;
    }

    if (bullet.type === "boomerang" || bullet.fusionPhysics === "boomerang") {
      if (bullet.boomerangState === "out") {
        bullet.vx *= Math.pow(0.08, dt);
        bullet.vy *= Math.pow(0.08, dt);
        const spd = Math.sqrt(bullet.vx * bullet.vx + bullet.vy * bullet.vy);
        if (spd < 60) {
          bullet.boomerangState = "returning";
          bullet.hitEnemies.clear();
        }
      } else {
        const dx = state.player.x - bullet.x;
        const dy = state.player.y - bullet.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        if (dist < 28) { bullet.life = 0; }
        else {
          bullet.vx = (dx / dist) * 500;
          bullet.vy = (dy / dist) * 500;
        }
      }
      bullet.x += bullet.vx * dt;
      bullet.y += bullet.vy * dt;
      bullet.life -= dt;
      continue;
    }

    bullet.x += bullet.vx * dt;
    bullet.y += bullet.vy * dt;
    bullet.life -= dt;

    if (bullet.bounces > 0 && (bullet.x < bullet.r || bullet.x > canvas.width - bullet.r)) {
      bullet.x = clamp(bullet.x, bullet.r, canvas.width - bullet.r);
      bullet.vx *= -1;
      bullet.bounces -= 1;
      boostBulletAfterBounce(bullet);
    }

    if (bullet.bounces > 0 && (bullet.y < bullet.r || bullet.y > canvas.height - bullet.r)) {
      bullet.y = clamp(bullet.y, bullet.r, canvas.height - bullet.r);
      bullet.vy *= -1;
      bullet.bounces -= 1;
      boostBulletAfterBounce(bullet);
    }
  }
  state.bullets.push(...brambleSpawn);

  for (const bullet of state.bullets) {
    for (const enemy of state.enemies) {
      if (!circleHit(bullet, enemy)) continue;
      if (bullet.hitEnemies.has(enemy)) continue;

      // 치명타 체크: healOnKillChance * 0.35 확률 (행운 빌드 자연 연동)
      const critChance = (state.player.healOnKillChance || 0) * 0.35;
      const isCrit = critChance > 0 && Math.random() < critChance;
      const critMult = isCrit ? 2 : 1;

      // ghost 무적: 무적 상태면 탄환 통과
      if (enemy.kind === "ghost" && enemy.ghostInvincible) {
        addParticles(enemy.x, enemy.y, "#e0e7ff", 4);
        continue;
      }

      // 쉴더 방어막: 관통 3 이상 또는 드릴/폭발 탄은 돌파, 아니면 탄환 소멸
      if (enemy.armored && (bullet.pierce || 0) < 3
          && bullet.type !== "drill" && !bullet.fusionDrills
          && bullet.type !== "explosive" && !bullet.fusionExplosive) {
        addParticles(enemy.x, enemy.y, "#e2e8f0", 6);
        bullet.life = 0;
        bullet.bounces = 0;
        continue;
      }

      const rawDmg = (bullet.type === "drill" || bullet.fusionDrills)
        ? Math.ceil(bullet.damage * (bullet.drillMultiplier || 1) * critMult)
        : Math.ceil(bullet.damage * critMult);
      const actualDmg = enemy.kind === "tank" ? Math.max(1, rawDmg - (enemy.armor || 0)) : rawDmg;

      // 슬라임: 적에서 반사 + 데미지 (별도 처리)
      if (bullet.type === "slime" || bullet.fusionPhysics === "slime") {
        enemy.hp -= actualDmg;
        addFloatText(enemy.x + (Math.random() - 0.5) * 16, enemy.y - enemy.r - 5,
          isCrit ? `★${actualDmg}` : String(actualDmg), isCrit ? "#facc15" : "#d1d5db");
        addParticles(enemy.x, enemy.y, "#4ade80", 6);
        if (bullet.slimeHops > 0) {
          const dx = bullet.x - enemy.x, dy = bullet.y - enemy.y;
          const len = Math.hypot(dx, dy) || 1;
          const nx = dx / len, ny = dy / len;
          const dot = bullet.vx * nx + bullet.vy * ny;
          bullet.vx -= 2 * dot * nx;
          bullet.vy -= 2 * dot * ny;
          bullet.slimeHops -= 1;
          bullet.hitEnemies.clear();
          bullet.hitEnemies.add(enemy);
        } else {
          bullet.life = 0;
        }
        break;
      }

      enemy.hp -= actualDmg;
      bullet.hitEnemies.add(enemy);
      addFloatText(enemy.x + (Math.random() - 0.5) * 16, enemy.y - enemy.r - 5,
        isCrit ? `★${actualDmg}` : String(actualDmg), isCrit ? "#facc15" : "#d1d5db");
      addParticles(enemy.x, enemy.y, "#ff6b6b", 6);

      // 드릴: 관통할수록 피해 증가
      if (bullet.type === "drill" || bullet.fusionDrills) {
        bullet.drillMultiplier = (bullet.drillMultiplier || 1) + 0.6;
        if (bullet.fusionHeals) {
          state.player.hp = Math.min(state.player.maxHp, state.player.hp + 1);
          addParticles(state.player.x, state.player.y, "#dc2626", 5);
        }
        break;
      }

      // 흡혈: 명중 시 HP 회복 (0.8초 쿨다운으로 연사 힐 제한)
      if ((bullet.type === "leech" || bullet.fusionHeals) && state.player.leechHealTimer <= 0) {
        state.player.hp = Math.min(state.player.maxHp, state.player.hp + 1);
        state.player.leechHealTimer = 0.8;
        addParticles(state.player.x, state.player.y, "#dc2626", 5);
      }

      // 폭발 탄: 첫 명중 시 AoE
      if ((bullet.type === 'explosive' || bullet.fusionExplodes) && !bullet.explosionTriggered) {
        bullet.explosionTriggered = true;
        triggerExplosion(bullet.x, bullet.y, 70 + state.player.bulletSizeBonus * 4, Math.ceil(bullet.damage * 0.7), enemy, true);
      }

      // 독 탄: 명중한 적에게 독 상태
      if (bullet.type === 'poison' || bullet.fusionPoisons) {
        enemy.poisonTimer = 3.0;
        enemy.poisonDmg = Math.max(1, Math.ceil(state.player.damage * 0.4));
        if (!enemy.poisonDamageTimer) enemy.poisonDamageTimer = 0.7;
        addParticles(enemy.x, enemy.y, "#4ade80", 4);
      }

      // 빙결 탄: 명중한 적 감속
      if (bullet.type === 'freeze' || bullet.fusionFreezes) {
        enemy.freezeTimer = 2.0;
        addParticles(enemy.x, enemy.y, "#93c5fd", 6);
      }

      // 번개(체인) 탄: 인접 적으로 체인 발사
      if ((bullet.type === 'chain' || bullet.type === 'chain_arc' || bullet.fusionChains) && (bullet.chainCount || 0) > 0) {
        let chainTarget = null, chainDist = Infinity;
        for (const e2 of state.enemies) {
          if (e2 === enemy || bullet.hitEnemies.has(e2)) continue;
          const cd = Math.hypot(e2.x - bullet.x, e2.y - bullet.y);
          if (cd < 220 && cd < chainDist) { chainDist = cd; chainTarget = e2; }
        }
        if (chainTarget) {
          const cdx = chainTarget.x - bullet.x, cdy = chainTarget.y - bullet.y;
          const clen = Math.hypot(cdx, cdy) || 1;
          state.bullets.push({
            type: 'chain_arc',
            x: bullet.x, y: bullet.y,
            vx: cdx / clen * 700, vy: cdy / clen * 700,
            r: Math.max(3, bullet.r * 0.75),
            damage: Math.max(1, Math.ceil(bullet.damage * 0.7)),
            life: 0.8, bounces: 0, pierce: 0,
            chainCount: (bullet.chainCount || 0) - 1,
            hitEnemies: new Set([...bullet.hitEnemies, enemy]),
          });
        }
      }

      if (bullet.pierce > 0) {
        if (state.player.pierceExplosion) {
          bullet.pierceExplosionCount = (bullet.pierceExplosionCount || 0) + 1;
          if (bullet.pierceExplosionCount <= 3) {
            triggerExplosion(bullet.x, bullet.y, 40, Math.max(1, Math.ceil(bullet.damage * 0.35)), enemy);
          }
        }
        bullet.pierce -= 1;
      } else {
        bullet.life = 0;
      }
      break;
    }
  }

  let xpGained = 0;
  const toSpawn = [];
  state.enemies = state.enemies.filter((enemy) => {
    if (enemy.hp > 0) return true;
    state.kills += 1;
    xpGained += getEnemyXp(enemy);
    tryDropGold(enemy);
    tryDropShard(enemy);
    if (state.player.healOnKillChance > 0 && Math.random() < state.player.healOnKillChance) {
      state.player.hp = Math.min(state.player.maxHp, state.player.hp + 1);
      addParticles(state.player.x, state.player.y, "#4ade80", 6);
    }
    if (state.player.killSummonSpark && Math.random() < 0.25) {
      let sparkTarget = null, sparkDist = Infinity;
      for (const e2 of state.enemies) {
        if (e2 === enemy) continue;
        const sd = Math.hypot(e2.x - enemy.x, e2.y - enemy.y);
        if (sd < 260 && sd < sparkDist) { sparkDist = sd; sparkTarget = e2; }
      }
      if (sparkTarget) {
        const sdx = sparkTarget.x - enemy.x, sdy = sparkTarget.y - enemy.y;
        const slen = Math.hypot(sdx, sdy) || 1;
        state.bullets.push({
          type: "chain_arc",
          x: enemy.x, y: enemy.y,
          vx: sdx / slen * 650, vy: sdy / slen * 650,
          r: 5, damage: Math.max(1, Math.ceil(state.player.damage * 0.6)),
          life: 0.7, bounces: 0, pierce: 0, chainCount: 1,
          hitEnemies: new Set(),
        });
        addParticles(enemy.x, enemy.y, "#fde68a", 8);
      }
    }
    addParticles(enemy.x, enemy.y, "#ff4545", 14);
    if (enemy.kind === "splitter") {
      for (let i = 0; i < 2; i += 1) {
        const ang = Math.PI * i + (Math.random() - 0.5) * 0.8;
        toSpawn.push({
          x: enemy.x + Math.cos(ang) * 20,
          y: enemy.y + Math.sin(ang) * 20,
          kind: "mini", r: 9, hp: 1, speed: enemy.speed * 1.5, touchTimer: 0,
        });
      }
    }
    if (enemy.kind === "splitter2") {
      for (let i = 0; i < 2; i += 1) {
        const ang = Math.PI * i + (Math.random() - 0.5) * 0.8;
        const sStats = getEnemyStats("splitter");
        toSpawn.push({
          x: enemy.x + Math.cos(ang) * 26,
          y: enemy.y + Math.sin(ang) * 26,
          kind: "splitter", maxHp: sStats.hp, ...sStats, touchTimer: 0,
        });
      }
    }
    if (enemy.kind === "kamikaze" && enemy.kamikazeExplode) {
      const dist = Math.hypot(state.player.x - enemy.x, state.player.y - enemy.y);
      if (dist < enemy.explodeRadius) {
        if (state.player.hurtTimer <= 0) {
          state.player.hp -= enemy.explodeDmg;
          state.player.hurtTimer = 0.6;
          state.screenShake = Math.min(1, state.screenShake + 0.3);
          if (state.player.hp <= 0) endGame();
        }
      }
      triggerExplosion(enemy.x, enemy.y, enemy.explodeRadius, 0, null, true);
    }
    return false;
  });
  if (toSpawn.length) state.enemies.push(...toSpawn);

  if (xpGained > 0) {
    addExperience(xpGained);
  }

  // 폭발 탄 수명 만료 시 AoE (명중 없이 소멸)
  for (const bullet of state.bullets) {
    if ((bullet.type === 'explosive' || bullet.fusionExplodes) && bullet.life <= 0 && !bullet.explosionTriggered) {
      bullet.explosionTriggered = true;
      triggerExplosion(bullet.x, bullet.y, 70 + state.player.bulletSizeBonus * 4, Math.ceil(bullet.damage * 0.5), null, true);
    }
  }

  state.bullets = state.bullets.filter((bullet) => {
    return bullet.life > 0
      && bullet.x > -30
      && bullet.x < canvas.width + 30
      && bullet.y > -30
      && bullet.y < canvas.height + 30;
  });

  // 탄환 하드캡 80개 — 초과 시 life가 짧은 탄부터 제거
  const BULLET_CAP = 80;
  if (state.bullets.length > BULLET_CAP) {
    state.bullets.sort((a, b) => a.life - b.life);
    state.bullets.splice(0, state.bullets.length - BULLET_CAP);
  }
}

function boostBulletAfterBounce(bullet) {
  bullet.life = Math.max(bullet.life, 1.1);

  if (bullet.growOnBounce) {
    bullet.r = Math.min(16, bullet.r + 1.5);
  }

  if (bullet.lightBounceBoost) {
    bullet.vx *= 1.08;
    bullet.vy *= 1.08;
  }

  // bounceChainShot: 분열탄 대신 반사할수록 피해 증폭 (탄 복제 없음)
  if (state.player.bounceChainShot) {
    const maxDmg = (state.player.damage || 1) * 5;
    bullet.damage = Math.min(Math.ceil(bullet.damage * 1.6), maxDmg);
    bullet.r = Math.min(bullet.r + 0.8, 18); // 반사할수록 탄 커짐
  }
}

function tryDropGold(enemy) {
  if (enemy.kind === "jackpotGold") {
    state.goldDrops.push({
      x: enemy.x,
      y: enemy.y,
      r: 13,
      value: 25 + Math.floor(state.wave * 1.5),
      life: 22,
    });
    return;
  }

  if (enemy.kind === "bonusGold") {
    state.goldDrops.push({
      x: enemy.x,
      y: enemy.y,
      r: 10,
      value: 7 + Math.floor(state.wave * 0.7),
      life: 20,
    });
    return;
  }

  const chance = enemy.kind === "boss" ? 1 : enemy.kind === "miniBoss" ? 0.8 : 0.12;
  if (Math.random() > chance) return;

  const lateBonus = state.wave >= 25 ? Math.floor((state.wave - 25) / 5) : 0;
  const normalBase = 1 + Math.floor(state.wave / 10) + Math.floor(Math.random() * 3) + lateBonus;
  const bossGold = 20 + Math.floor(state.wave / 5) * 3;
  const baseValue = enemy.kind === "boss" ? bossGold : enemy.kind === "miniBoss" ? 8 + Math.floor(state.wave / 10) : normalBase;
  const bonus = state.player.goldDropBonus || 1;
  state.goldDrops.push({
    x: enemy.x,
    y: enemy.y,
    r: enemy.kind === "normal" ? 7 : 10,
    value: Math.round(baseValue * bonus),
    life: 18,
  });
}

function tryDropShard(enemy) {
  const chance = enemy.kind === "boss"
    ? 0.35
    : enemy.kind === "miniBoss"
      ? 0.14
      : enemy.kind === "jackpotGold"
        ? 0.08
        : enemy.kind === "bonusGold"
          ? 0.04
          : 0.012;

  if (Math.random() > chance) return;

  state.shardDrops.push({
    x: enemy.x,
    y: enemy.y,
    r: enemy.kind === "boss" ? 11 : 8,
    value: enemy.kind === "boss" ? 3 : enemy.kind === "miniBoss" ? 2 : 1,
    life: 24,
  });
}

function getEnemyXp(enemy) {
  const waveBonus = Math.floor(state.wave / 4);
  if (enemy.kind === "jackpotGold" || enemy.kind === "bonusGold") return 1 + Math.floor(state.wave / 6);
  if (enemy.kind === "boss") return 14 + waveBonus * 3;
  if (enemy.kind === "miniBoss") return 7 + waveBonus * 2;
  if (enemy.kind === "charger")  return 2 + Math.floor(state.wave / 6);
  if (enemy.kind === "splitter") return 3 + Math.floor(state.wave / 5);
  if (enemy.kind === "tank")     return 5 + Math.floor(state.wave / 4);
  if (enemy.kind === "speeder" || enemy.kind === "mini") return 1;
  if (enemy.kind === "sniper") return 3 + Math.floor(state.wave / 7);
  if (enemy.kind === "kamikaze") return 1;
  if (enemy.kind === "shielder") return 4 + Math.floor(state.wave / 5);
  if (enemy.kind === "splitter2") return 4 + Math.floor(state.wave / 5);
  if (enemy.kind === "ghost") return 4 + Math.floor(state.wave / 5);
  if (enemy.kind === "summoner") return 6 + Math.floor(state.wave / 4);
  return 1 + Math.floor(state.wave / 6);
}

function addExperience(amount) {
  state.xp += amount;
  if (state.mode !== "playing" || state.xp < state.xpToNext) return;

  state.xp -= state.xpToNext;
  state.level += 1;
  state.xpToNext = getXpToNextLevel(state.level);
  // 레벨업마다 공격력 +0.2, 공격속도 1% 증가
  state.player.damage += 0.2;
  state.player.fireDelay = Math.max(100, state.player.fireDelay * 0.99);
  addFloatText(state.player.x, state.player.y - 20, "⚔+  ⚡+", "#fbbf24");
  state.mode = "reward";
  showRewards(state.enemies.length === 0 ? "nextWave" : "resume");
}

function getXpToNextLevel(level) {
  return Math.floor(5 + level * 4 + Math.pow(level, 2.2) * 1.5);
}

function updateEnemies(dt) {
  const player = state.player;

  for (const enemy of state.enemies) {
    enemy.touchTimer = Math.max(0, enemy.touchTimer - dt);

    // 독 DoT
    if (enemy.poisonTimer > 0) {
      enemy.poisonTimer = Math.max(0, enemy.poisonTimer - dt);
      enemy.poisonDamageTimer = Math.max(0, (enemy.poisonDamageTimer || 0.7) - dt);
      if (enemy.poisonDamageTimer <= 0 && enemy.poisonTimer > 0) {
        const pdmg = enemy.poisonDmg || 1;
        enemy.hp -= pdmg;
        enemy.poisonDamageTimer = 0.7;
        addFloatText(enemy.x + (Math.random() - 0.5) * 12, enemy.y - enemy.r - 5, String(pdmg), "#4ade80");
        addParticles(enemy.x, enemy.y, "#166534", 3);
      }
    }
    // 빙결 슬로우
    if (enemy.freezeTimer > 0) enemy.freezeTimer = Math.max(0, enemy.freezeTimer - dt);
    const freezeMult = enemy.freezeTimer > 0 ? 0.35 : 1;

    if (enemy.kind === "charger") {
      enemy.chargeTimer -= dt;
      if (!enemy.charging && enemy.chargeTimer <= 0) {
        enemy.charging = true;
        enemy.chargeDuration = 0.45;
        const ang = Math.atan2(player.y - enemy.y, player.x - enemy.x);
        enemy.chargeVx = Math.cos(ang) * enemy.chargeSpeed;
        enemy.chargeVy = Math.sin(ang) * enemy.chargeSpeed;
      }
      if (enemy.charging) {
        enemy.x += enemy.chargeVx * freezeMult * dt;
        enemy.y += enemy.chargeVy * freezeMult * dt;
        enemy.chargeDuration -= dt;
        if (enemy.chargeDuration <= 0) {
          enemy.charging = false;
          enemy.chargeTimer = 2 + Math.random() * 1.5;
        }
      } else {
        const ang = Math.atan2(player.y - enemy.y, player.x - enemy.x);
        enemy.x += Math.cos(ang) * enemy.speed * 0.3 * freezeMult * dt;
        enemy.y += Math.sin(ang) * enemy.speed * 0.3 * freezeMult * dt;
      }
    } else if (enemy.kind === "speeder") {
      enemy.zigzagTimer -= dt;
      if (enemy.zigzagTimer <= 0) {
        enemy.zigzagAngle = (Math.random() - 0.5) * Math.PI * 0.7;
        enemy.zigzagTimer = 0.25 + Math.random() * 0.3;
      }
      const baseAng = Math.atan2(player.y - enemy.y, player.x - enemy.x);
      enemy.x += Math.cos(baseAng + enemy.zigzagAngle) * enemy.speed * freezeMult * dt;
      enemy.y += Math.sin(baseAng + enemy.zigzagAngle) * enemy.speed * freezeMult * dt;
    } else if (enemy.kind === "sniper") {
      const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);
      const IDEAL = 250;
      const ang = Math.atan2(player.y - enemy.y, player.x - enemy.x);
      if (dist < IDEAL - 40) {
        enemy.x -= Math.cos(ang) * enemy.speed * freezeMult * dt;
        enemy.y -= Math.sin(ang) * enemy.speed * freezeMult * dt;
      } else if (dist > IDEAL + 40) {
        enemy.x += Math.cos(ang) * enemy.speed * 0.6 * freezeMult * dt;
        enemy.y += Math.sin(ang) * enemy.speed * 0.6 * freezeMult * dt;
      }
      enemy.x = clamp(enemy.x, enemy.r, canvas.width - enemy.r);
      enemy.y = clamp(enemy.y, enemy.r, canvas.height - enemy.r);
      enemy.shootTimer = (enemy.shootTimer || 0) - dt;
      if (enemy.shootTimer <= 0) {
        enemy.shootTimer = 2.0 + Math.random() * 1.0;
        const bSpd = 200 + state.wave * 3;
        // 웨이브 20 이상에서 플레이어 이동 방향 예측 조준
        let fireAng = ang;
        if (state.wave >= 20 && state.player.speed > 0) {
          const travelTime = dist / bSpd;
          const predX = player.x + (player.lastVx || 0) * travelTime * 0.5;
          const predY = player.y + (player.lastVy || 0) * travelTime * 0.5;
          fireAng = Math.atan2(predY - enemy.y, predX - enemy.x);
        }
        state.enemyBullets.push({
          x: enemy.x, y: enemy.y,
          vx: Math.cos(fireAng) * bSpd, vy: Math.sin(fireAng) * bSpd,
          r: 7, damage: 1 + Math.floor(state.wave / 8), life: 3.5,
        });
        addParticles(enemy.x, enemy.y, "#3b82f6", 8);
      }
    } else if (enemy.kind === "kamikaze") {
      const ang = Math.atan2(player.y - enemy.y, player.x - enemy.x);
      enemy.x += Math.cos(ang) * enemy.speed * freezeMult * dt;
      enemy.y += Math.sin(ang) * enemy.speed * freezeMult * dt;
    } else if (enemy.kind === "shielder") {
      const ang = Math.atan2(player.y - enemy.y, player.x - enemy.x);
      enemy.x += Math.cos(ang) * enemy.speed * freezeMult * dt;
      enemy.y += Math.sin(ang) * enemy.speed * freezeMult * dt;
      enemy.armorTimer = Math.max(0, (enemy.armorTimer || 0) - dt);
      if (enemy.armorTimer <= 0) {
        enemy.armored = !enemy.armored;
        enemy.armorTimer = enemy.armored ? enemy.armorDuration : enemy.armorCooldown;
      }
    } else if (enemy.kind === "ghost") {
      const ang = Math.atan2(player.y - enemy.y, player.x - enemy.x);
      enemy.x += Math.cos(ang) * enemy.speed * freezeMult * dt;
      enemy.y += Math.sin(ang) * enemy.speed * freezeMult * dt;
      enemy.ghostTimer = Math.max(0, (enemy.ghostTimer || 0) - dt);
      if (enemy.ghostTimer <= 0) {
        enemy.ghostInvincible = !enemy.ghostInvincible;
        enemy.ghostTimer = enemy.ghostInvincible ? enemy.ghostActiveDuration : enemy.ghostCooldown;
      }
    } else if (enemy.kind === "summoner") {
      const ang = Math.atan2(player.y - enemy.y, player.x - enemy.x);
      enemy.x += Math.cos(ang) * enemy.speed * freezeMult * dt;
      enemy.y += Math.sin(ang) * enemy.speed * freezeMult * dt;
      enemy.summonTimer = Math.max(0, (enemy.summonTimer || 0) - dt);
      if (enemy.summonTimer <= 0) {
        enemy.summonTimer = enemy.summonInterval || 5.0;
        if (state.enemies.length < 80) {
          for (let si = 0; si < 2; si++) {
            const spos = randomEdgePosition();
            const sStats = getEnemyStats("mini");
            state.enemies.push({ x: spos.x, y: spos.y, maxHp: sStats.hp, ...sStats, kind: "mini", touchTimer: 0 });
          }
          addParticles(enemy.x, enemy.y, "#a855f7", 14);
        }
      }
    } else {
      const angle = Math.atan2(player.y - enemy.y, player.x - enemy.x);
      enemy.x += Math.cos(angle) * enemy.speed * freezeMult * dt;
      enemy.y += Math.sin(angle) * enemy.speed * freezeMult * dt;
    }

    if (circleHit(player, enemy) && player.hurtTimer <= 0) {
      const dmg = getEnemyContactDamage(enemy);
      player.hp -= dmg;
      player.hurtTimer = Math.min(1.2, 0.85 + Math.floor(state.wave / 20) * 0.15);
      state.screenShake = Math.min(1, state.screenShake + 0.15 * dmg);
      addParticles(player.x, player.y, "#74a7ff", 18 + dmg * 6);

      if (player.hp <= 0) {
        endGame();
      }
    }
  }
}

function updateEnemyBullets(dt) {
  const player = state.player;
  for (const b of state.enemyBullets) {
    b.x += b.vx * dt;
    b.y += b.vy * dt;
    b.life -= dt;
    if (Math.hypot(player.x - b.x, player.y - b.y) < player.r + b.r && player.hurtTimer <= 0) {
      player.hp -= b.damage;
      player.hurtTimer = Math.min(1.2, 0.55 + Math.floor(state.wave / 20) * 0.12);
      state.screenShake = Math.min(1, state.screenShake + 0.12 * b.damage);
      addParticles(player.x, player.y, "#ef4444", 14);
      b.life = 0;
      if (player.hp <= 0) endGame();
    }
  }
  state.enemyBullets = state.enemyBullets.filter(b =>
    b.life > 0 && b.x > -20 && b.x < canvas.width + 20 && b.y > -20 && b.y < canvas.height + 20
  );
}

function updateGoldDrops(dt) {
  const player = state.player;

  for (const drop of state.goldDrops) {
    drop.life -= dt;
    if (Math.hypot(player.x - drop.x, player.y - drop.y) < player.r + drop.r + 8) {
      state.gold += drop.value;
      drop.life = 0;
      addParticles(drop.x, drop.y, "#f0c14b", 10);
    }
  }

  state.goldDrops = state.goldDrops.filter((drop) => drop.life > 0);
}

function updateShardDrops(dt) {
  const player = state.player;

  for (const drop of state.shardDrops) {
    drop.life -= dt;
    if (Math.hypot(player.x - drop.x, player.y - drop.y) < player.r + drop.r + 8) {
      meta.shards += drop.value;
      saveMeta();
      renderCharacters();
      drop.life = 0;
      addParticles(drop.x, drop.y, "#67e8f9", 14);
    }
  }

  state.shardDrops = state.shardDrops.filter((drop) => drop.life > 0);
}

function updateParticles(dt) {
  for (const p of state.particles) {
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.life -= dt;
  }
  state.particles = state.particles.filter((p) => p.life > 0);
}

function addParticles(x, y, color, count) {
  for (let i = 0; i < count; i += 1) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 50 + Math.random() * 180;
    state.particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      r: 2 + Math.random() * 3,
      color,
      life: 0.25 + Math.random() * 0.35,
    });
  }
}

function addFloatText(x, y, text, color = "#fbbf24") {
  state.floatTexts.push({ x, y, text, color, life: 1.4, vy: -38 });
}

function updateFloatTexts(dt) {
  for (const t of state.floatTexts) {
    t.y += t.vy * dt;
    t.life -= dt;
  }
  state.floatTexts = state.floatTexts.filter((t) => t.life > 0);
}

function checkWaveClear() {
  if (state.enemies.length > 0 || state.mode !== "playing") return;
  state.wave += 1;
  showWaveToast();
  if (state.wave % 10 === 0) {
    // 10웨이브마다 상점 오픈, 닫으면 spawnWave 호출
    state.pausedMode = "waveShop";
    state.mode = "shop";
    state.expandedFinalId = null;
    renderShop();
    shopPanel.classList.remove("hidden");
  } else {
    spawnWave();
  }
}

function showFusionToast(fusionKey) {
  if (!fusionToast) return;
  const name = fusionNames[fusionKey] || fusionKey;
  fusionToast.textContent = `⚡ 융합탄 해금: ${name}`;
  fusionToast.classList.remove("hidden");
  state.fusionToastTimer = 2.0;
}

function updateFusionToast(dt) {
  if (!state.fusionToastTimer || state.fusionToastTimer <= 0) return;
  state.fusionToastTimer = Math.max(0, state.fusionToastTimer - dt);
  if (state.fusionToastTimer === 0) {
    fusionToast.classList.add("hidden");
  }
}

function showWaveToast() {
  waveToast.textContent = `Wave ${state.wave}`;
  waveToast.classList.remove("hidden");
  state.waveToastTimer = 1.15;
}

function updateWaveToast(dt) {
  if (state.waveToastTimer <= 0) return;
  state.waveToastTimer = Math.max(0, state.waveToastTimer - dt);
  if (state.waveToastTimer === 0) {
    waveToast.classList.add("hidden");
  }
}

// 보상 1회 선택 후 닫힘(1초) 전까지 추가 선택 차단 — pointer-events는 마우스만 막고 keydown은 못 막음
let rewardPickLocked = false;

function showRewards(nextAction = "resume") {
  // 픽 한도 소진 + wave 20 이상일 때만 후기 강화 풀 사용
  // wave 20 미만에서 한도 소진하면 골드 보너스로 대체
  if (state.rewardPicksRemaining <= 0 && state.wave < 20) {
    const bonusGold = 5 + Math.floor(state.wave / 3);
    state.gold += bonusGold;
    addFloatText(state.player.x, state.player.y - 30, `+${bonusGold}G (레벨업)`, "#fbbf24");
    state.mode = "playing";
    updateHud();
    return;
  }
  const useLatePool = state.rewardPicksRemaining <= 0;
  state.rewardNextAction = nextAction;
  rewardPickLocked = false;
  rewardCards.innerHTML = "";

  const counter = document.createElement("p");
  counter.className = "reward-picks-counter";
  counter.textContent = useLatePool
    ? `★ 후기 강화 (Wave ${state.wave})`
    : `남은 선택 횟수: ${state.rewardPicksRemaining} / ${REWARD_PICK_LIMIT}`;
  rewardCards.appendChild(counter);

  let currentRewards;
  if (useLatePool) {
    const pool = [...lateRewards];
    currentRewards = [];
    for (let i = 0; i < 3 && pool.length > 0; i++) {
      const idx = Math.floor(Math.random() * pool.length);
      currentRewards.push(pool.splice(idx, 1)[0]);
    }
  } else {
    currentRewards = pickRewards(3);
  }

  for (let i = 0; i < currentRewards.length; i += 1) {
    rewardCards.appendChild(createRewardCard(currentRewards, i, useLatePool));
  }
  rewardPanel.classList.remove("hidden");
}

function createRewardCard(currentRewards, index, rerolled, upgraded = false) {
  const reward = currentRewards[index];
  const card = document.createElement("article");
  card.className = `reward-card tier-${reward.tier}${upgraded ? " upgraded" : ""} ${getTypeMatchClass(reward.type)}`;
  card.tabIndex = 0;
  card.role = "button";
  card.innerHTML = `<em>${tierLabels[reward.tier]}${upgraded ? " UP" : ""}</em><em class="type">${rewardTypeLabels[reward.type]}</em><strong>${reward.title}</strong><span>${reward.text}</span>${rewardSetHint(reward.type)}`;
  const selectReward = () => {
    if (rewardPickLocked) return;
    rewardPickLocked = true;
    // 선택한 카드 강조, 나머지 흐릿하게 (인라인 스타일로 CSS 캐시 우회)
    card.style.cssText += ";position:relative;z-index:10;transform:scale(1.18);transition:transform 0.2s ease;";
    rewardCards.querySelectorAll(".reward-card").forEach((c) => {
      if (c !== card) {
        c.style.cssText += ";opacity:0.12;filter:blur(3px);pointer-events:none;transition:opacity 0.2s ease,filter 0.2s ease;";
      } else {
        c.style.pointerEvents = "none";
      }
    });

    // setTimeout을 먼저 등록해 게임 로직 에러에 영향받지 않도록 함
    setTimeout(() => {
      rewardPanel.classList.add("hidden");
      state.mode = "playing";
    }, 1000);

    reward.apply(state);
    applyRewardTypeProgress(reward.type);
    if (state.rewardPicksRemaining > 0) state.rewardPicksRemaining -= 1;
  };

  card.addEventListener("click", selectReward);
  card.addEventListener("keydown", (event) => {
    if (event.code === "Enter" || event.code === "Space") {
      event.preventDefault();
      selectReward();
    }
  });

  const rerollButton = document.createElement("button");
  rerollButton.className = "reward-reroll";
  rerollButton.type = "button";
  rerollButton.textContent = "↻";
  rerollButton.title = rerolled ? "후기 강화 카드는 리롤 불가" : "카드를 새로 뽑습니다. 18% 확률로 한 단계 위 티어로 업그레이드.";
  if (rerolled) {
    rerollButton.style.display = "none";
  } else {
    rerollButton.addEventListener("click", (event) => {
      event.stopPropagation();
      const result = pickReplacementReward(currentRewards, reward.tier);
      currentRewards[index] = result.reward;
      card.replaceWith(createRewardCard(currentRewards, index, true, result.upgraded));
    });
  }

  card.appendChild(rerollButton);
  return card;
}

function getTypeMatchClass(type) {
  const nextCount = (state.rewardTypes[type] || 0) + 1;
  if (nextCount >= 4) return "match-rainbow";
  if (nextCount === 3) return "match-gold";
  if (nextCount === 2) return "match-glow";
  return "";
}

function rewardSetHint(type) {
  const current = state.rewardTypes[type] || 0;
  const bonuses = rewardSetBonuses[type] || [];
  const next = bonuses.find((bonus) => bonus.count > current);
  if (!next) return `<span class="set-hint">${rewardTypeLabels[type]} ${current}개</span>`;
  return `<span class="set-hint">${rewardTypeLabels[type]} ${current}/${next.count}: ${next.text}</span>`;
}

function applyRewardTypeProgress(type) {
  state.rewardTypes[type] = (state.rewardTypes[type] || 0) + 1;
  const count = state.rewardTypes[type];
  const bonuses = rewardSetBonuses[type] || [];

  for (const bonus of bonuses) {
    const key = `${type}-${bonus.count}`;
    if (count >= bonus.count && !state.activeSetBonuses[key]) {
      const prevFusion = getActiveFusion(state.player.specialBullets);
      bonus.apply(state);
      state.activeSetBonuses[key] = true;
      state.setBonusMessage = bonus.text;
      addParticles(state.player.x, state.player.y, "#d8b4fe", 26);
      const newFusion = getActiveFusion(state.player.specialBullets);
      if (!prevFusion && newFusion) {
        showFusionToast(newFusion);
      }
    }
  }

}

function pickReplacementReward(currentRewards, currentTier) {
  const currentSet = new Set(currentRewards);
  const upgradedTier = getNextTier(currentTier);
  const shouldUpgrade = upgradedTier && Math.random() < rerollUpgradeChance;
  const upgradedPool = shouldUpgrade
    ? rewards.filter((reward) => reward.tier === upgradedTier && !currentSet.has(reward))
    : [];

  if (upgradedPool.length > 0) {
    return {
      reward: upgradedPool[Math.floor(Math.random() * upgradedPool.length)],
      upgraded: true,
    };
  }

  const pool = rewards.filter((reward) => !currentSet.has(reward));
  if (pool.length === 0) {
    return {
      reward: rewards[Math.floor(Math.random() * rewards.length)],
      upgraded: false,
    };
  }

  return {
    reward: pool[Math.floor(Math.random() * pool.length)],
    upgraded: false,
  };
}

function getNextTier(tier) {
  const index = tierOrder.indexOf(tier);
  if (index < 0 || index >= tierOrder.length - 1) return null;
  return tierOrder[index + 1];
}


function startReadyPrompt(action = "nextWave") {
  state.mode = "ready";
  state.readyAction = action;
  readyText.textContent = "방향키";
  readyHint.textContent = action === "nextWave"
    ? "공격 방향을 누르면 다음 웨이브가 시작됩니다."
    : "공격 방향을 누르면 전투가 계속됩니다.";
  readyPanel.classList.remove("hidden");
  updateHud();
}

function startNextWaveFromReady() {
  if (state.mode !== "ready") return;
  readyPanel.classList.add("hidden");
  state.mode = "playing";
  if (state.readyAction === "nextWave") {
    state.wave += 1;
    spawnWave();
    showWaveToast();
  }
  updateHud();
}

function openShop() {
  if (state.mode === "start" || state.mode === "gameOver" || state.mode === "reward" || state.mode === "shop") return;
  state.pausedMode = state.mode;
  state.hiddenReadyForShop = state.mode === "ready";
  if (state.hiddenReadyForShop) {
    readyPanel.classList.add("hidden");
  }
  state.mode = "shop";
  state.expandedFinalId = null;
  renderShop();
  shopPanel.classList.remove("hidden");
}

function closeShop() {
  if (state.mode !== "shop") return;
  shopPanel.classList.add("hidden");
  if (state.pausedMode === "waveShop") {
    state.pausedMode = null;
    state.mode = "playing";
    spawnWave();
    updateHud();
  } else {
    state.mode = state.pausedMode || "playing";
    state.pausedMode = null;
    state.hiddenReadyForShop = false;
  }
}

function renderShop() {
  shopItems.innerHTML = "";

  for (const item of shopCatalog) {
    if (item.type === "component") continue;
    if (item.minWave && state.wave < item.minWave) continue;

    if (item.type === "final") {
      shopItems.appendChild(renderFinalShopItem(item));
    } else if (item.type === "late_final") {
      shopItems.appendChild(renderLateFinalShopItem(item));
    } else {
      shopItems.appendChild(renderSimpleShopItem(item));
    }
  }
}

function renderSimpleShopItem(item) {
  const canBuy = canBuyShopItem(item);
  const card = document.createElement("article");
  card.className = `shop-item${canBuy ? "" : " disabled"}`;
  card.innerHTML = shopItemHtml(item);
  if (canBuy) {
    card.addEventListener("click", () => {
      if (!canBuyShopItem(item)) return;
      buyShopItem(item);
      renderShop();
      updateHud();
    });
  }
  return card;
}

function renderFinalShopItem(item) {
  const owned = (state.inventory[item.id] || 0) >= 1;
  const expanded = state.expandedFinalId === item.id;
  const blocked = !owned && shopCatalog.some(
    (it) => it.type === "final" && it.id !== item.id && (state.inventory[it.id] || 0) >= 1
  );
  const card = document.createElement("article");
  card.className = `shop-item shop-final${expanded ? " expanded" : ""}${owned ? " owned" : ""}${blocked ? " disabled" : ""}`;

  if (owned) {
    const compRefund = (item.requires || []).reduce((sum, reqId) => {
      const comp = shopCatalog.find(it => it.id === reqId);
      return sum + (comp && state.inventory[reqId] ? Math.floor(comp.cost * 0.5) : 0);
    }, 0);
    const totalRefund = Math.floor(item.cost * 0.5) + compRefund;
    card.innerHTML = `<em>최종 아이템</em><strong>🔧 ${item.title}</strong><span>${item.text}</span><div style="display:flex;align-items:center;gap:8px;margin-top:10px;"><span class="purchased-tag">✓ 구매함</span><button class="shop-sell-button" type="button">팔기 (${totalRefund}G 환불)</button></div>`;
    const sellBtn = card.querySelector('.shop-sell-button');
    sellBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      sellShopItem(item);
      renderShop();
      updateHud();
    });
    return card;
  }

  if (blocked) {
    card.innerHTML = `<em>최종 아이템</em><strong>🔧 ${item.title}</strong><span>${item.text}</span><small style="color:#6b7280">다른 최종 아이템 보유 중</small>`;
    return card;
  }

  if (!expanded) {
    card.innerHTML = `<em>최종 아이템</em><strong>🔧 ${item.title}</strong><span>${item.text}</span><small>${item.cost} Gold</small>`;
    card.addEventListener("click", () => {
      state.expandedFinalId = item.id;
      renderShop();
    });
    return card;
  }

  let recipeRowsHtml = "";
  for (const reqId of item.requires) {
    const comp = shopCatalog.find((shopItem) => shopItem.id === reqId);
    const owned = (state.inventory[comp.id] || 0) >= 1;
    const cost = getShopItemCost(comp);
    const affordable = state.gold >= cost;
    const buyLabel = owned ? "✓ 보유" : `${cost} G`;
    const buyClass = owned ? "shop-component-buy owned-tag" : "shop-component-buy";
    recipeRowsHtml += `
      <div class="shop-component-row${owned ? " owned" : ""}">
        <div class="shop-component-info">
          <strong>${comp.title}</strong>
          <em>${comp.text}</em>
        </div>
        <button class="${buyClass}" type="button" data-buy="${comp.id}" ${owned || !affordable ? "disabled" : ""}>
          ${buyLabel}
        </button>
      </div>`;
  }

  const canCraft = canBuyShopItem(item);
  card.innerHTML = `
    <em>최종 아이템</em>
    <strong>🔧 ${item.title}</strong>
    <span>${item.text}</span>
    <div class="shop-recipe">
      <span class="shop-recipe-label">재료</span>
      <div class="shop-recipe-list">${recipeRowsHtml}</div>
      <button class="shop-craft-button" type="button" ${canCraft ? "" : "disabled"}>
        🔨 조합하기 (${item.cost} Gold)
      </button>
      <button class="shop-collapse-button" type="button">▲ 접기</button>
    </div>
  `;

  for (const btn of card.querySelectorAll("[data-buy]")) {
    btn.addEventListener("click", (event) => {
      event.stopPropagation();
      const compId = btn.dataset.buy;
      const comp = shopCatalog.find((shopItem) => shopItem.id === compId);
      if (!canBuyShopItem(comp)) return;
      buyShopItem(comp);
      renderShop();
      updateHud();
    });
  }

  const craftBtn = card.querySelector(".shop-craft-button");
  craftBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    if (!canBuyShopItem(item)) return;
    buyShopItem(item);
    state.expandedFinalId = null;
    renderShop();
    updateHud();
  });

  const collapseBtn = card.querySelector(".shop-collapse-button");
  collapseBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    state.expandedFinalId = null;
    renderShop();
  });

  return card;
}

function renderLateFinalShopItem(item) {
  const owned = (state.inventory[item.id] || 0) >= 1;
  const canBuy = canBuyShopItem(item);
  const card = document.createElement("article");
  card.className = `shop-item late-final${owned ? " owned" : ""}${canBuy ? "" : " disabled"}`;
  card.innerHTML = `
    <span class="late-badge">Wave ${item.minWave}+</span>
    ${shopItemHtml(item)}
    ${owned ? `<button class="sell-btn" type="button">판매 (+${Math.floor(item.cost * 0.5)}G)</button>` : ""}
  `;
  if (canBuy && !owned) {
    card.addEventListener("click", () => {
      buyShopItem(item);
      renderShop();
      updateHud();
    });
  }
  if (owned) {
    card.querySelector(".sell-btn")?.addEventListener("click", (e) => {
      e.stopPropagation();
      sellShopItem(item);
      renderShop();
      updateHud();
    });
  }
  return card;
}

function canBuyShopItem(item) {
  if (state.gold < getShopItemCost(item)) return false;
  if (item.id === "healing_potion" && state.player.hp >= state.player.maxHp) return false;
  if (item.type === "component" && (state.inventory[item.id] || 0) >= 1) return false;
  if (item.type === "final" && (state.inventory[item.id] || 0) >= 1) return false;
  if (item.type === "final") {
    const alreadyOwnsOne = shopCatalog.some(
      (it) => it.type === "final" && it.id !== item.id && (state.inventory[it.id] || 0) >= 1
    );
    if (alreadyOwnsOne) return false;
    return item.requires.every((id) => (state.inventory[id] || 0) > 0);
  }
  if (item.type === "late_final") {
    if ((state.inventory[item.id] || 0) >= 1) return false;
    return true;
  }
  return true;
}

function buyShopItem(item) {
  state.gold -= getShopItemCost(item);
  item.buy(state);

  if (item.type === "component" || item.type === "final" || item.scalingCost) {
    state.inventory[item.id] = (state.inventory[item.id] || 0) + 1;
  }
}

function sellShopItem(item) {
  if (!item.sell) return;
  let refund = Math.floor(item.cost * 0.5);
  item.sell(state);
  delete state.inventory[item.id];
  // also reverse and remove required components
  if (item.requires) {
    for (const reqId of item.requires) {
      const comp = shopCatalog.find(it => it.id === reqId);
      if (comp && state.inventory[reqId]) {
        if (comp.sell) comp.sell(state);
        delete state.inventory[reqId];
        refund += Math.floor(comp.cost * 0.5);
      }
    }
  }
  state.gold += refund;
  addFloatText(state.player.x, state.player.y - 20, `+${refund}G 판매`, "#f0c14b");
}

function shopItemHtml(item) {
  const owned = state.inventory[item.id] || 0;
  const ownedText = item.type === "component"
    ? `<small>보유 ${owned}/1</small>`
    : item.scalingCost
      ? `<small>구매 ${owned}회</small>`
      : "";
  const requireText = item.type === "final"
    ? `<span class="requirements">${formatRequirements(item.requires)}</span>`
    : "";
  const typeText = item.type === "final" ? "최종 아이템" : item.type === "component" ? "하위 아이템" : "소모품";
  return `<em>${typeText}</em><strong>${item.title}</strong><span>${item.text}</span>${requireText}<small>${getShopItemCost(item)} Gold</small>${ownedText}`;
}

function getShopItemCost(item) {
  return item.cost + (item.scalingCost || 0) * (state.inventory[item.id] || 0);
}

function formatRequirements(requires) {
  return `필요: ${requires.map((id) => {
    const item = shopCatalog.find((shopItem) => shopItem.id === id);
    const owned = state.inventory[id] || 0;
    return `${item.title} ${owned}/1`;
  }).join(", ")}`;
}

function rollRewardTier() {
  const total = tierWeights.reduce((s, t) => s + t.w, 0);
  let r = Math.random() * total;
  for (const t of tierWeights) {
    r -= t.w;
    if (r <= 0) return t.tier;
  }
  return "bronze";
}

function pickRewards(count) {
  const tier = rollRewardTier();
  let pool = rewards.filter((r) => r.tier === tier);

  // If not enough unique cards, fill from adjacent tiers
  if (pool.length < count) {
    const tierIdx = tierOrder.indexOf(tier);
    for (let i = tierIdx - 1; i >= 0 && pool.length < count; i -= 1) {
      pool = [...pool, ...rewards.filter((r) => r.tier === tierOrder[i])];
    }
    for (let i = tierIdx + 1; i < tierOrder.length && pool.length < count; i += 1) {
      pool = [...pool, ...rewards.filter((r) => r.tier === tierOrder[i])];
    }
  }
  if (pool.length === 0) pool = [...rewards];

  const picked = [];
  const available = [...pool];
  for (let i = 0; i < count; i += 1) {
    if (available.length === 0) break;
    const idx = Math.floor(Math.random() * available.length);
    picked.push(available.splice(idx, 1)[0]);
  }
  return picked;
}

function endGame() {
  state.mode = "gameOver";
  finalStats.textContent = `Wave ${state.wave}, Kills ${state.kills}`;
  gameOverPanel.classList.remove("hidden");
  updateHud();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const shake = state.screenShake || 0;
  if (shake > 0) {
    ctx.save();
    ctx.translate(
      (Math.random() - 0.5) * shake * 16,
      (Math.random() - 0.5) * shake * 16
    );
  }

  drawArena();
  drawVignetteWarning();
  drawBullets();
  drawEnemyBullets();
  drawEnemies();
  drawGoldDrops();
  drawShardDrops();
  drawPlayer();
  drawPlayerBars();
  drawParticles();
  drawFloatTexts();

  if (shake > 0) ctx.restore();

  drawTypeTracker();
  drawAimLine();
}

function drawEnemyBullets() {
  for (const b of state.enemyBullets) {
    ctx.save();
    ctx.shadowColor = "#ef4444"; ctx.shadowBlur = 14;
    ctx.fillStyle = "#dc2626";
    ctx.strokeStyle = "#fca5a5"; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();
    // 탄심 흰 점
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#fef2f2";
    ctx.beginPath(); ctx.arc(b.x, b.y, b.r * 0.3, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
}

function drawGoldDrops() {
  for (const drop of state.goldDrops) {
    ctx.beginPath();
    ctx.arc(drop.x, drop.y, drop.r, 0, Math.PI * 2);
    ctx.fillStyle = "#f0c14b";
    ctx.fill();
    ctx.strokeStyle = "#fff1a8";
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

function drawShardDrops() {
  for (const drop of state.shardDrops) {
    ctx.beginPath();
    ctx.moveTo(drop.x, drop.y - drop.r);
    ctx.lineTo(drop.x + drop.r, drop.y);
    ctx.lineTo(drop.x, drop.y + drop.r);
    ctx.lineTo(drop.x - drop.r, drop.y);
    ctx.closePath();
    ctx.fillStyle = "#67e8f9";
    ctx.fill();
    ctx.strokeStyle = "#cffafe";
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

function drawVignetteWarning() {
  const ratio = Math.max(0, state.player.hp / state.player.maxHp);
  if (ratio > 0.2) return;
  const pulse = 0.7 + 0.3 * Math.sin(Date.now() / 200);
  const alpha = (0.2 - ratio) / 0.2 * 0.5 * pulse;
  const grad = ctx.createRadialGradient(
    canvas.width / 2, canvas.height / 2, canvas.height * 0.25,
    canvas.width / 2, canvas.height / 2, canvas.height * 0.9
  );
  grad.addColorStop(0, 'rgba(220,38,38,0)');
  grad.addColorStop(1, `rgba(220,38,38,${alpha.toFixed(3)})`);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawArena() {
  ctx.fillStyle = "#171720";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "#242431";
  ctx.lineWidth = 1;
  for (let x = 0; x < canvas.width; x += 48) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y < canvas.height; y += 48) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
}

function drawPlayer() {
  const player = state.player;
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.r, 0, Math.PI * 2);
  ctx.fillStyle = player.hurtTimer > 0 ? "#ffffff" : "#4e8cff";
  ctx.fill();

  ctx.beginPath();
  ctx.arc(player.x, player.y, player.r + 4, 0, Math.PI * 2);
  ctx.strokeStyle = "#93bcff";
  ctx.lineWidth = 2;
  ctx.stroke();
}

function drawPlayerBars() {
  const player = state.player;
  const width = 54;
  const height = 6;
  const x = player.x - width / 2;
  const hpY = player.y + player.r + 10;
  const xpY = hpY + 9;
  const hpRatio = Math.max(0, player.hp / player.maxHp);
  const xpRatio = Math.max(0, Math.min(1, state.xp / state.xpToNext));

  drawMiniBar(x, hpY, width, height, hpRatio, "#ef4444", "#431316");
  drawMiniBar(x, xpY, width, height, xpRatio, "#38bdf8", "#0f2633");
}

function drawMiniBar(x, y, width, height, ratio, fill, bg) {
  ctx.fillStyle = bg;
  ctx.fillRect(x, y, width, height);
  ctx.fillStyle = fill;
  ctx.fillRect(x, y, width * ratio, height);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
  ctx.lineWidth = 1;
  ctx.strokeRect(x, y, width, height);
}

function drawTypeTracker() {
  if (state.mode !== "playing" && state.mode !== "ready") return;
  const types = [
    { key: "power",     label: "화력", color: "#f97316" },
    { key: "speed",     label: "속도", color: "#38bdf8" },
    { key: "vitality",  label: "생존", color: "#4ade80" },
    { key: "bounce",    label: "도탄", color: "#a78bfa" },
    { key: "pierce",    label: "관통", color: "#fb7185" },
    { key: "luck",      label: "행운", color: "#fbbf24" },
    { key: "explosion", label: "폭발", color: "#f97316" },
    { key: "poison",    label: "독",   color: "#86efac" },
    { key: "lightning", label: "번개", color: "#c4b5fd" },
    { key: "frost",     label: "빙결", color: "#7dd3fc" },
  ];

  const active = types.filter(t => (state.rewardTypes[t.key] || 0) > 0);
  if (active.length === 0) return;

  const x = 10, startY = 12;
  const rowH = 16;

  ctx.save();
  ctx.font = "bold 11px Arial";
  ctx.textBaseline = "middle";

  active.forEach((t, i) => {
    const count = state.rewardTypes[t.key] || 0;
    const y = startY + i * rowH;
    const unlocked = count >= 4;

    // 배경 필 (4세트면 테두리 글로우)
    ctx.globalAlpha = unlocked ? 0.75 : 0.55;
    ctx.fillStyle = unlocked ? `rgba(${hexToRgb(t.color)},0.15)` : "#0d0d12";
    if (unlocked) {
      ctx.shadowColor = t.color;
      ctx.shadowBlur = 10;
    }
    ctx.beginPath();
    ctx.roundRect(x, y - 7, 68, 14, 4);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;

    // 타입 이름
    ctx.fillStyle = t.color;
    if (unlocked) { ctx.shadowColor = t.color; ctx.shadowBlur = 6; }
    ctx.fillText(t.label, x + 5, y);
    ctx.shadowBlur = 0;

    // 점 4개
    for (let d = 0; d < 4; d++) {
      ctx.beginPath();
      ctx.arc(x + 34 + d * 9, y, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = d < count ? t.color : "rgba(255,255,255,0.15)";
      if (unlocked && d < count) { ctx.shadowColor = t.color; ctx.shadowBlur = 7; }
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // 4개 달성 시 별 표시
    if (unlocked) {
      ctx.shadowColor = t.color;
      ctx.shadowBlur = 8;
      ctx.fillStyle = t.color;
      ctx.font = "bold 10px Arial";
      ctx.fillText("★", x + 56, y);
      ctx.shadowBlur = 0;
      ctx.font = "bold 11px Arial";
    }
  });

  ctx.textBaseline = "alphabetic";
  ctx.restore();
}

function drawAimLine() {
  if (state.mode !== "playing") return;
  const aim = getAimDirection();
  if (!aim) return;
  const player = state.player;
  ctx.beginPath();
  ctx.moveTo(player.x, player.y);
  ctx.lineTo(player.x + aim.x * 34, player.y + aim.y * 34);
  ctx.strokeStyle = "#dbe7ff";
  ctx.lineWidth = 3;
  ctx.stroke();
}

function drawEnemies() {
  for (const enemy of state.enemies) {
    if (enemy.kind === "miniBoss" || enemy.kind === "boss") {
      drawBoss(enemy);
      continue;
    }

    // ── 스나이퍼: 별도 그리기 ──────────────────────────────────────
    if (enemy.kind === "sniper") {
      ctx.save();
      ctx.translate(enemy.x, enemy.y);
      // 몸통 (파란 사각형)
      ctx.shadowColor = "#3b82f6"; ctx.shadowBlur = 14;
      ctx.fillStyle = "#1e3a8a"; ctx.strokeStyle = "#93c5fd"; ctx.lineWidth = 2;
      const sr = enemy.r;
      ctx.fillRect(-sr, -sr, sr * 2, sr * 2);
      ctx.strokeRect(-sr, -sr, sr * 2, sr * 2);
      // 조준경 십자
      ctx.shadowBlur = 0;
      ctx.strokeStyle = "#bfdbfe"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(-sr * 0.6, 0); ctx.lineTo(sr * 0.6, 0); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, -sr * 0.6); ctx.lineTo(0, sr * 0.6); ctx.stroke();
      ctx.beginPath(); ctx.arc(0, 0, sr * 0.32, 0, Math.PI * 2); ctx.stroke();
      // 발사 직전 충전 표시
      if (enemy.shootTimer !== undefined && enemy.shootTimer < 0.6) {
        const charge = 1 - enemy.shootTimer / 0.6;
        ctx.globalAlpha = charge * 0.85;
        ctx.strokeStyle = "#ef4444"; ctx.lineWidth = 3;
        ctx.shadowColor = "#ef4444"; ctx.shadowBlur = 18;
        ctx.beginPath();
        ctx.arc(0, 0, sr + 8, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * charge);
        ctx.stroke();
      }
      ctx.restore();

      // HP 바
      if (enemy.maxHp && enemy.hp < enemy.maxHp) {
        const bw = sr * 2.4;
        const hpR = Math.max(0, enemy.hp / enemy.maxHp);
        ctx.fillStyle = "#1e293b";
        ctx.fillRect(enemy.x - bw / 2, enemy.y - sr - 9, bw, 4);
        ctx.fillStyle = hpR < 0.3 ? "#ef4444" : "#3b82f6";
        ctx.fillRect(enemy.x - bw / 2, enemy.y - sr - 9, bw * hpR, 4);
      }
      continue;
    }

    ctx.beginPath();
    ctx.arc(enemy.x, enemy.y, enemy.r, 0, Math.PI * 2);

    if (enemy.kind === "charger") {
      ctx.fillStyle = enemy.charging ? "#ff6200" : "#c84400";
      ctx.strokeStyle = enemy.charging ? "#ffaa44" : "#ff8866";
    } else if (enemy.kind === "speeder") {
      ctx.fillStyle = "#84cc16";
      ctx.strokeStyle = "#d9f99d";
    } else if (enemy.kind === "splitter") {
      ctx.fillStyle = "#0d9488";
      ctx.strokeStyle = "#5eead4";
    } else if (enemy.kind === "tank") {
      ctx.fillStyle = "#475569";
      ctx.strokeStyle = "#94a3b8";
    } else if (enemy.kind === "mini") {
      ctx.fillStyle = "#f87171";
      ctx.strokeStyle = "#fca5a5";
    } else if (enemy.kind === "shielder") {
      ctx.fillStyle = enemy.armored ? "#334155" : "#1e293b";
      ctx.strokeStyle = enemy.armored ? "#94a3b8" : "#475569";
    } else if (enemy.kind === "kamikaze") {
      ctx.fillStyle = "#dc2626";
      ctx.strokeStyle = "#fca5a5";
    } else if (enemy.kind === "splitter2") {
      ctx.fillStyle = "#0f766e";
      ctx.strokeStyle = "#2dd4bf";
    } else if (enemy.kind === "ghost") {
      ctx.globalAlpha = enemy.ghostInvincible ? 0.22 : 0.82;
      ctx.fillStyle = "#e0e7ff";
      ctx.strokeStyle = "#c7d2fe";
    } else if (enemy.kind === "summoner") {
      ctx.fillStyle = "#7c3aed";
      ctx.strokeStyle = "#c4b5fd";
    } else if (enemy.kind === "jackpotGold") {
      ctx.fillStyle = "#facc15";
      ctx.strokeStyle = "#fef08a";
    } else if (enemy.kind === "bonusGold") {
      ctx.fillStyle = "#f59e0b";
      ctx.strokeStyle = "#fde68a";
    } else {
      ctx.fillStyle = "#f04444";
      ctx.strokeStyle = "#ff9a9a";
    }

    ctx.fill();
    ctx.lineWidth = 2;
    ctx.stroke();

    // ghost: 알파 복원
    if (enemy.kind === "ghost") {
      ctx.globalAlpha = 1;
    }

    // summoner: 십자 아이콘
    if (enemy.kind === "summoner") {
      ctx.save();
      ctx.translate(enemy.x, enemy.y);
      ctx.strokeStyle = "#e9d5ff";
      ctx.shadowColor = "#a855f7"; ctx.shadowBlur = 10;
      ctx.lineWidth = 2.5;
      const sp = enemy.r * 0.45;
      for (let si = 0; si < 4; si++) {
        const a = (Math.PI / 2) * si;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(a) * sp, Math.sin(a) * sp);
        ctx.stroke();
      }
      ctx.restore();
    }

    // 쉴더: 방어막 링 표시
    if (enemy.kind === "shielder") {
      const pulse = 0.6 + 0.4 * Math.sin(Date.now() / 300);
      if (enemy.armored) {
        ctx.save();
        ctx.strokeStyle = `rgba(226,232,240,${pulse})`;
        ctx.lineWidth = 3;
        ctx.shadowColor = "#e2e8f0"; ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(enemy.x, enemy.y, enemy.r + 7, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
    }

    if (enemy.kind === "charger" && !enemy.charging && enemy.chargeTimer < 0.9) {
      ctx.save();
      ctx.globalAlpha = 0.35 + 0.55 * (0.9 - enemy.chargeTimer) / 0.9;
      ctx.beginPath();
      ctx.arc(enemy.x, enemy.y, enemy.r + 9, 0, Math.PI * 2);
      ctx.strokeStyle = "#ffcc00";
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.restore();
    }

    // HP 바: 피해 입은 모든 적에게 표시
    if (enemy.maxHp && enemy.hp < enemy.maxHp) {
      const bw = enemy.r * 2.2;
      const hpR = Math.max(0, enemy.hp / enemy.maxHp);
      ctx.fillStyle = "#1e293b";
      ctx.fillRect(enemy.x - bw / 2, enemy.y - enemy.r - 9, bw, 4);
      const barColor = hpR < 0.3 ? "#ef4444" : hpR < 0.6 ? "#f59e0b" : "#4ade80";
      ctx.fillStyle = barColor;
      ctx.fillRect(enemy.x - bw / 2, enemy.y - enemy.r - 9, bw * hpR, 4);
    }
  }
}

function drawBoss(enemy) {
  const size = enemy.r * 2;
  const spin = performance.now() * 0.001 * (enemy.kind === "boss" ? 0.7 : 1.1);
  ctx.save();
  ctx.translate(enemy.x, enemy.y);
  ctx.rotate(Math.PI / 4 + spin);
  const hpRatio = Math.max(0, enemy.hp / enemy.maxHp);
  const lowHp = hpRatio < 0.3;
  if (lowHp) { ctx.shadowColor = enemy.kind === "boss" ? "#a855f7" : "#f97316"; ctx.shadowBlur = 22; }
  ctx.fillStyle = enemy.kind === "boss" ? "#a855f7" : "#f97316";
  ctx.fillRect(-enemy.r, -enemy.r, size, size);
  ctx.strokeStyle = enemy.kind === "boss" ? "#e9d5ff" : "#fed7aa";
  ctx.lineWidth = 3;
  ctx.strokeRect(-enemy.r, -enemy.r, size, size);
  ctx.restore();

  const barWidth = enemy.r * 2.3;
  ctx.fillStyle = "#2a2a34";
  ctx.fillRect(enemy.x - barWidth / 2, enemy.y - enemy.r - 18, barWidth, 6);
  const barColor = hpRatio < 0.3 ? "#ef4444" : hpRatio < 0.6 ? "#f59e0b" : (enemy.kind === "boss" ? "#d8b4fe" : "#fdba74");
  ctx.fillStyle = barColor;
  ctx.fillRect(enemy.x - barWidth / 2, enemy.y - enemy.r - 18, barWidth * hpRatio, 6);
}

function drawBullets() {
  for (const bullet of state.bullets) {
    ctx.save();
    ctx.translate(bullet.x, bullet.y);
    const ang = Math.atan2(bullet.vy, bullet.vx);
    const r = bullet.r;

    switch (bullet.type) {

      // ── 부메랑: 초승달 ────────────────────────────────────────────
      case 'boomerang': {
        ctx.rotate(ang);
        ctx.shadowColor = "#fed7aa"; ctx.shadowBlur = 12;
        ctx.fillStyle = bullet.boomerangState === "returning" ? "#fb923c" : "#f97316";
        ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
        ctx.globalCompositeOperation = "destination-out";
        ctx.beginPath(); ctx.arc(r * 0.55, 0, r * 0.75, 0, Math.PI * 2); ctx.fill();
        ctx.globalCompositeOperation = "source-over";
        break;
      }

      // ── 기관총+부메랑: 수리검 (4점 별) ──────────────────────────
      case 'fusion_mg_boom': {
        ctx.rotate(ang + performance.now() * 0.005);
        ctx.shadowColor = "#67e8f9"; ctx.shadowBlur = 18;
        ctx.fillStyle = "#22d3ee"; ctx.strokeStyle = "#fb923c"; ctx.lineWidth = 1.5;
        ctx.beginPath();
        for (let i = 0; i < 8; i++) {
          const rr = i % 2 === 0 ? r * 1.35 : r * 0.42;
          const a = (Math.PI / 4) * i;
          i === 0 ? ctx.moveTo(Math.cos(a) * rr, Math.sin(a) * rr)
                  : ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr);
        }
        ctx.closePath(); ctx.fill(); ctx.stroke();
        break;
      }

      // ── 흡혈+부메랑: 박쥐 날개 ───────────────────────────────────
      case 'fusion_boom_leech': {
        ctx.rotate(ang);
        ctx.shadowColor = "#7f1d1d"; ctx.shadowBlur = 16;
        ctx.fillStyle = "#9b1c1c"; ctx.strokeStyle = "#fca5a5"; ctx.lineWidth = 1.5;
        // 왼쪽 날개
        ctx.beginPath();
        ctx.moveTo(r * 0.2, 0);
        ctx.arc(-r * 0.4, -r * 0.3, r, Math.PI * 0.05, Math.PI * 0.95);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        // 오른쪽 날개
        ctx.beginPath();
        ctx.moveTo(r * 0.2, 0);
        ctx.arc(-r * 0.4, r * 0.3, r, -Math.PI * 0.95, -Math.PI * 0.05);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        // 몸통
        ctx.fillStyle = "#dc2626";
        ctx.beginPath(); ctx.arc(r * 0.25, 0, r * 0.36, 0, Math.PI * 2); ctx.fill();
        break;
      }

      // ── 슬라임+부메랑: 울퉁불퉁 초승달 ──────────────────────────
      case 'fusion_boom_slime': {
        ctx.rotate(ang);
        ctx.shadowColor = "#4ade80"; ctx.shadowBlur = 14;
        ctx.fillStyle = "#059669"; ctx.strokeStyle = "#86efac"; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
        ctx.globalCompositeOperation = "destination-out";
        ctx.beginPath(); ctx.arc(r * 0.5, 0, r * 0.72, 0, Math.PI * 2); ctx.fill();
        ctx.globalCompositeOperation = "source-over";
        ctx.fillStyle = "#4ade80";
        ctx.shadowColor = "#4ade80"; ctx.shadowBlur = 8;
        for (let b = 0; b < 3; b++) {
          const ba = (-0.55 + b * 0.55) * Math.PI;
          ctx.beginPath();
          ctx.arc(Math.cos(ba) * r, Math.sin(ba) * r, r * 0.27, 0, Math.PI * 2);
          ctx.fill();
        }
        break;
      }

      // ── 드릴+부메랑: 드릴 끝 초승달 ─────────────────────────────
      case 'fusion_boom_drill': {
        ctx.rotate(ang);
        ctx.shadowColor = "#f97316"; ctx.shadowBlur = 14;
        ctx.fillStyle = "#c2410c"; ctx.strokeStyle = "#fde68a"; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
        ctx.globalCompositeOperation = "destination-out";
        ctx.beginPath(); ctx.arc(r * 0.55, 0, r * 0.72, 0, Math.PI * 2); ctx.fill();
        ctx.globalCompositeOperation = "source-over";
        ctx.fillStyle = "#fde68a";
        ctx.beginPath();
        ctx.moveTo(r * 1.05, 0); ctx.lineTo(r * 1.9, -r * 0.28);
        ctx.lineTo(r * 2.35, 0); ctx.lineTo(r * 1.9, r * 0.28);
        ctx.closePath(); ctx.fill();
        break;
      }

      // ── 산탄+부메랑: 3연 마름모 부채꼴 ──────────────────────────
      case 'fusion_boom_scatter': {
        ctx.rotate(ang);
        ctx.shadowColor = "#7dd3fc"; ctx.shadowBlur = 10;
        for (const [off, scale] of [[-0.38, 0.62], [0, 1.0], [0.38, 0.62]]) {
          ctx.save(); ctx.rotate(off);
          ctx.globalAlpha = off === 0 ? 1 : 0.7;
          ctx.fillStyle = "#38bdf8";
          const dr = r * scale * 1.3;
          ctx.beginPath();
          ctx.moveTo(dr, 0); ctx.lineTo(0, dr * 0.55);
          ctx.lineTo(-dr, 0); ctx.lineTo(0, -dr * 0.55);
          ctx.closePath(); ctx.fill();
          ctx.restore();
        }
        break;
      }

      // ── 기관총: 길쭉한 캡슐 ──────────────────────────────────────
      case 'machinegun': {
        ctx.rotate(ang);
        ctx.shadowColor = "#facc15"; ctx.shadowBlur = 8;
        ctx.fillStyle = "#fde047";
        ctx.beginPath();
        ctx.ellipse(0, 0, r * 1.6, r * 0.45, 0, 0, Math.PI * 2);
        ctx.fill();
        break;
      }

      // ── 흡혈+기관총: 송곳니 캡슐 ─────────────────────────────────
      case 'fusion_mg_leech': {
        ctx.rotate(ang);
        ctx.shadowColor = "#dc2626"; ctx.shadowBlur = 14;
        ctx.fillStyle = "#991b1b"; ctx.strokeStyle = "#fca5a5"; ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(-r * 0.15, 0, r * 1.45, r * 0.5, 0, 0, Math.PI * 2);
        ctx.fill(); ctx.stroke();
        // 뒤쪽 송곳니 두 개
        ctx.fillStyle = "#fca5a5";
        ctx.beginPath();
        ctx.moveTo(-r * 1.1, 0); ctx.lineTo(-r * 1.75, -r * 0.55); ctx.lineTo(-r * 0.9, -r * 0.18);
        ctx.closePath(); ctx.fill();
        ctx.beginPath();
        ctx.moveTo(-r * 1.1, 0); ctx.lineTo(-r * 1.75, r * 0.55); ctx.lineTo(-r * 0.9, r * 0.18);
        ctx.closePath(); ctx.fill();
        break;
      }

      // ── 슬라임+기관총: 슬라임 유탄 ───────────────────────────────
      case 'fusion_mg_slime': {
        ctx.rotate(ang);
        ctx.shadowColor = "#4ade80"; ctx.shadowBlur = 14;
        ctx.fillStyle = "#16a34a"; ctx.strokeStyle = "#86efac"; ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.ellipse(0, 0, r * 1.75, r * 0.7, 0, 0, Math.PI * 2);
        ctx.fill(); ctx.stroke();
        ctx.fillStyle = "#86efac";
        ctx.beginPath(); ctx.arc(r * 1.45, 0, r * 0.32, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(r * 0.55, -r * 0.6, r * 0.22, 0, Math.PI * 2); ctx.fill();
        break;
      }

      // ── 드릴+기관총: 육각 드릴 캡슐 ─────────────────────────────
      case 'fusion_mg_drill': {
        ctx.rotate(ang);
        const mgdb = Math.min(1, ((bullet.drillMultiplier || 1) - 1) / 3);
        ctx.shadowColor = "#f97316"; ctx.shadowBlur = 10 + mgdb * 16;
        ctx.fillStyle = "#c2410c"; ctx.strokeStyle = "#fde68a"; ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.ellipse(-r * 0.3, 0, r * 1.3, r * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#fde68a";
        ctx.beginPath();
        for (let h = 0; h < 6; h++) {
          const ha = (Math.PI / 3) * h;
          const hx = r * 1.15 + Math.cos(ha) * r * 0.48;
          const hy = Math.sin(ha) * r * 0.42;
          h === 0 ? ctx.moveTo(hx, hy) : ctx.lineTo(hx, hy);
        }
        ctx.closePath(); ctx.fill(); ctx.stroke();
        break;
      }

      // ── 산탄+기관총: X자 십자 ─────────────────────────────────────
      case 'fusion_mg_scatter': {
        ctx.rotate(ang + Math.PI / 4);
        ctx.shadowColor = "#c084fc"; ctx.shadowBlur = 12;
        ctx.fillStyle = "#a855f7"; ctx.strokeStyle = "#e9d5ff"; ctx.lineWidth = 1.5;
        const xr = r * 1.35, xw = r * 0.48;
        ctx.beginPath();
        ctx.moveTo(-xr, -xw); ctx.lineTo(-xw, -xw); ctx.lineTo(-xw, -xr);
        ctx.lineTo(xw, -xr);  ctx.lineTo(xw, -xw);  ctx.lineTo(xr, -xw);
        ctx.lineTo(xr, xw);   ctx.lineTo(xw, xw);   ctx.lineTo(xw, xr);
        ctx.lineTo(-xw, xr);  ctx.lineTo(-xw, xw);  ctx.lineTo(-xr, xw);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        break;
      }

      // ── 흡혈탄: 물방울 ───────────────────────────────────────────
      case 'leech': {
        ctx.rotate(ang + Math.PI / 2);
        ctx.shadowColor = "#dc2626"; ctx.shadowBlur = 14;
        ctx.fillStyle = "#991b1b"; ctx.strokeStyle = "#fca5a5"; ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, -r * 1.6);
        ctx.bezierCurveTo(r * 1.1, -r * 0.4, r * 1.1, r * 0.8, 0, r * 0.8);
        ctx.bezierCurveTo(-r * 1.1, r * 0.8, -r * 1.1, -r * 0.4, 0, -r * 1.6);
        ctx.fill(); ctx.stroke();
        break;
      }

      // ── 슬라임탄: 울퉁불퉁 육각형 ───────────────────────────────
      case 'slime': {
        ctx.shadowColor = "#4ade80"; ctx.shadowBlur = 14;
        ctx.fillStyle = "#15803d"; ctx.strokeStyle = "#86efac"; ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const a = (Math.PI * 2 / 6) * i - Math.PI / 2;
          const bump = r + (i % 2 === 0 ? r * 0.3 : 0);
          i === 0 ? ctx.moveTo(Math.cos(a) * bump, Math.sin(a) * bump)
                  : ctx.lineTo(Math.cos(a) * bump, Math.sin(a) * bump);
        }
        ctx.closePath(); ctx.fill(); ctx.stroke();
        break;
      }

      // ── 드릴탄: 화살 삼각형 ──────────────────────────────────────
      case 'drill': {
        ctx.rotate(ang);
        const db = Math.min(1, ((bullet.drillMultiplier || 1) - 1) / 3);
        ctx.shadowColor = "#f97316"; ctx.shadowBlur = 10 + db * 20;
        ctx.fillStyle = `hsl(${22 + db * 15},100%,${38 + db * 28}%)`;
        ctx.strokeStyle = "#fed7aa"; ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(r * 1.6, 0); ctx.lineTo(-r, -r * 0.9);
        ctx.lineTo(-r * 0.4, 0); ctx.lineTo(-r, r * 0.9);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        break;
      }

      // ── 산탄: 마름모 ─────────────────────────────────────────────
      case 'scatter': {
        ctx.rotate(ang);
        ctx.shadowColor = "#38bdf8"; ctx.shadowBlur = 7;
        ctx.fillStyle = "#7dd3fc";
        const sr = r * 1.4;
        ctx.beginPath();
        ctx.moveTo(sr, 0); ctx.lineTo(0, sr * 0.55);
        ctx.lineTo(-sr, 0); ctx.lineTo(0, -sr * 0.55);
        ctx.closePath(); ctx.fill();
        break;
      }

      // ── 흡혈+슬라임: 아메바 블롭 ─────────────────────────────────
      case 'fusion_leech_slime': {
        ctx.shadowColor = "#e879f9"; ctx.shadowBlur = 16;
        ctx.fillStyle = "#c084fc"; ctx.strokeStyle = "#e879f9"; ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i < 8; i++) {
          const a = (Math.PI * 2 / 8) * i;
          const rr = r * (i % 2 === 0 ? 1.35 : 0.68);
          i === 0 ? ctx.moveTo(Math.cos(a) * rr, Math.sin(a) * rr)
                  : ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr);
        }
        ctx.closePath(); ctx.fill(); ctx.stroke();
        break;
      }

      // ── 흡혈+드릴: 피의 드릴 화살 ───────────────────────────────
      case 'fusion_leech_drill': {
        ctx.rotate(ang);
        const ldb = Math.min(1, ((bullet.drillMultiplier || 1) - 1) / 3);
        ctx.shadowColor = "#dc2626"; ctx.shadowBlur = 10 + ldb * 16;
        ctx.fillStyle = "#991b1b"; ctx.strokeStyle = "#fca5a5"; ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(r * 1.6, 0); ctx.lineTo(-r, -r * 0.9);
        ctx.lineTo(-r * 0.4, 0); ctx.lineTo(-r, r * 0.9);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle = "#fca5a5";
        ctx.beginPath(); ctx.arc(-r * 1.3, 0, r * 0.4, 0, Math.PI * 2); ctx.fill();
        break;
      }

      // ── 흡혈+산탄: 피의 6점 별 ───────────────────────────────────
      case 'fusion_leech_scatter': {
        ctx.shadowColor = "#f472b6"; ctx.shadowBlur = 14;
        ctx.fillStyle = "#ec4899"; ctx.strokeStyle = "#fbcfe8"; ctx.lineWidth = 1;
        ctx.beginPath();
        for (let i = 0; i < 12; i++) {
          const rr = i % 2 === 0 ? r * 1.35 : r * 0.5;
          const a = (Math.PI / 6) * i - Math.PI / 2;
          i === 0 ? ctx.moveTo(Math.cos(a) * rr, Math.sin(a) * rr)
                  : ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr);
        }
        ctx.closePath(); ctx.fill(); ctx.stroke();
        break;
      }

      // ── 드릴+슬라임: 산성 삼각형 ─────────────────────────────────
      case 'fusion_drill_slime': {
        ctx.rotate(ang);
        const dsb = Math.min(1, ((bullet.drillMultiplier || 1) - 1) / 3);
        ctx.shadowColor = "#22c55e"; ctx.shadowBlur = 10 + dsb * 16;
        ctx.fillStyle = "#15803d"; ctx.strokeStyle = "#bbf7d0"; ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(r * 1.6, 0); ctx.lineTo(r * 0.1, -r * 1.1);
        ctx.lineTo(-r * 1.2, -r * 0.25); ctx.lineTo(-r * 1.2, r * 0.25);
        ctx.lineTo(r * 0.1, r * 1.1);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle = "#86efac";
        ctx.beginPath(); ctx.arc(-r * 0.65, -r * 0.55, r * 0.22, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(-r * 0.65, r * 0.55, r * 0.22, 0, Math.PI * 2); ctx.fill();
        break;
      }

      // ── 슬라임+산탄: 둥근 마름모 블롭 ───────────────────────────
      case 'fusion_scatter_slime': {
        ctx.shadowColor = "#4ade80"; ctx.shadowBlur = 12;
        ctx.fillStyle = "#86efac"; ctx.strokeStyle = "#4ade80"; ctx.lineWidth = 1.5;
        const sslr = r * 1.2;
        ctx.beginPath();
        ctx.moveTo(sslr, 0);
        ctx.bezierCurveTo(sslr * 0.6, sslr * 0.5, sslr * 0.5, sslr * 0.6, 0, sslr);
        ctx.bezierCurveTo(-sslr * 0.5, sslr * 0.6, -sslr * 0.6, sslr * 0.5, -sslr, 0);
        ctx.bezierCurveTo(-sslr * 0.6, -sslr * 0.5, -sslr * 0.5, -sslr * 0.6, 0, -sslr);
        ctx.bezierCurveTo(sslr * 0.5, -sslr * 0.6, sslr * 0.6, -sslr * 0.5, sslr, 0);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        break;
      }

      // ── 드릴+산탄: 폭발 6점 별 ───────────────────────────────────
      case 'fusion_drill_scatter': {
        ctx.rotate(ang);
        const dscb = Math.min(1, ((bullet.drillMultiplier || 1) - 1) / 3);
        ctx.shadowColor = "#f97316"; ctx.shadowBlur = 12 + dscb * 18;
        ctx.fillStyle = "#ea580c"; ctx.strokeStyle = "#fde68a"; ctx.lineWidth = 1.5;
        ctx.beginPath();
        for (let i = 0; i < 12; i++) {
          const rr = i % 2 === 0 ? r * 1.55 : r * 0.55;
          const a = (Math.PI / 6) * i;
          i === 0 ? ctx.moveTo(Math.cos(a) * rr, Math.sin(a) * rr)
                  : ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr);
        }
        ctx.closePath(); ctx.fill(); ctx.stroke();
        break;
      }

      // ── 폭발 탄: 회전 불꽃 별 ────────────────────────────────────
      case 'explosive':
      case 'fusion_mg_explosive':
      case 'fusion_chain_explosive':
      case 'fusion_explosive_freeze':
      case 'fusion_explosive_poison': {
        ctx.rotate(ang + performance.now() * 0.003);
        ctx.shadowColor = "#f97316"; ctx.shadowBlur = 18;
        ctx.fillStyle = "#ea580c"; ctx.strokeStyle = "#fde68a"; ctx.lineWidth = 1.5;
        ctx.beginPath();
        for (let i = 0; i < 8; i++) {
          const rr = i % 2 === 0 ? r * 1.45 : r * 0.6;
          const a = (Math.PI / 4) * i;
          i === 0 ? ctx.moveTo(Math.cos(a) * rr, Math.sin(a) * rr)
                  : ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr);
        }
        ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.shadowColor = "#fbbf24"; ctx.shadowBlur = 8;
        ctx.fillStyle = "#fbbf24";
        ctx.beginPath(); ctx.arc(0, 0, r * 0.45, 0, Math.PI * 2); ctx.fill();
        break;
      }

      // ── 독 탄: 독구슬 + 방울 ─────────────────────────────────────
      case 'poison':
      case 'fusion_mg_poison':
      case 'fusion_chain_poison':
      case 'fusion_freeze_poison': {
        ctx.shadowColor = "#4ade80"; ctx.shadowBlur = 14;
        ctx.fillStyle = "#15803d"; ctx.strokeStyle = "#86efac"; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = "#4ade80";
        ctx.beginPath(); ctx.arc(-r * 0.3, -r * 0.3, r * 0.35, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#bbf7d0";
        ctx.beginPath(); ctx.arc(-r * 0.3, -r * 0.3, r * 0.15, 0, Math.PI * 2); ctx.fill();
        for (let i = 0; i < 3; i++) {
          const da = (Math.PI * 2 / 3) * i + performance.now() * 0.002;
          ctx.fillStyle = "#4ade80";
          ctx.beginPath(); ctx.arc(Math.cos(da) * r * 1.35, Math.sin(da) * r * 1.35, r * 0.28, 0, Math.PI * 2); ctx.fill();
        }
        break;
      }

      // ── 번개(체인) 탄: 번개 모양 ────────────────────────────────
      case 'chain':
      case 'chain_arc':
      case 'fusion_mg_chain':
      case 'fusion_generic': {
        ctx.rotate(ang);
        ctx.shadowColor = "#a78bfa"; ctx.shadowBlur = 20;
        ctx.fillStyle = "#7c3aed"; ctx.strokeStyle = "#c4b5fd"; ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(r * 1.5, 0);
        ctx.lineTo(r * 0.2, -r * 0.7);
        ctx.lineTo(r * 0.6, -r * 0.25);
        ctx.lineTo(-r * 1.2, -r * 0.8);
        ctx.lineTo(-r * 0.2, 0);
        ctx.lineTo(-r * 1.2, r * 0.8);
        ctx.lineTo(r * 0.6, r * 0.25);
        ctx.lineTo(r * 0.2, r * 0.7);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.shadowColor = "#ddd6fe"; ctx.shadowBlur = 6;
        ctx.fillStyle = "#ddd6fe";
        ctx.beginPath(); ctx.arc(0, 0, r * 0.32, 0, Math.PI * 2); ctx.fill();
        break;
      }

      // ── 빙결 탄: 눈결정 ──────────────────────────────────────────
      case 'freeze':
      case 'fusion_mg_freeze':
      case 'fusion_explosive_freeze':
      case 'fusion_freeze_poison': {
        ctx.shadowColor = "#93c5fd"; ctx.shadowBlur = 16;
        ctx.strokeStyle = "#bfdbfe"; ctx.lineWidth = 2;
        ctx.fillStyle = "#1d4ed8";
        ctx.beginPath(); ctx.arc(0, 0, r * 0.6, 0, Math.PI * 2); ctx.fill();
        for (let i = 0; i < 6; i++) {
          const a = (Math.PI / 3) * i;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(Math.cos(a) * r * 1.45, Math.sin(a) * r * 1.45);
          ctx.stroke();
          const mx = Math.cos(a) * r * 0.8, my = Math.sin(a) * r * 0.8;
          const pa = a + Math.PI / 2;
          ctx.beginPath();
          ctx.moveTo(mx - Math.cos(pa) * r * 0.4, my - Math.sin(pa) * r * 0.4);
          ctx.lineTo(mx + Math.cos(pa) * r * 0.4, my + Math.sin(pa) * r * 0.4);
          ctx.stroke();
        }
        ctx.fillStyle = "#93c5fd";
        ctx.beginPath(); ctx.arc(0, 0, r * 0.32, 0, Math.PI * 2); ctx.fill();
        break;
      }

      // ── 제네릭 융합 (부메랑) ──────────────────────────────────────
      case 'fusion_generic_boom': {
        ctx.rotate(ang);
        ctx.shadowColor = "#a78bfa"; ctx.shadowBlur = 14;
        ctx.fillStyle = "#6d28d9"; ctx.strokeStyle = "#c4b5fd"; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
        ctx.globalCompositeOperation = "destination-out";
        ctx.beginPath(); ctx.arc(r * 0.55, 0, r * 0.75, 0, Math.PI * 2); ctx.fill();
        ctx.globalCompositeOperation = "source-over";
        break;
      }

      // ── 제네릭 융합 (슬라임) ──────────────────────────────────────
      case 'fusion_generic_slime': {
        ctx.shadowColor = "#a78bfa"; ctx.shadowBlur = 12;
        ctx.fillStyle = "#4c1d95"; ctx.strokeStyle = "#c4b5fd"; ctx.lineWidth = 1.5;
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const a = (Math.PI * 2 / 6) * i - Math.PI / 2;
          const bump = r + (i % 2 === 0 ? r * 0.3 : 0);
          i === 0 ? ctx.moveTo(Math.cos(a) * bump, Math.sin(a) * bump)
                  : ctx.lineTo(Math.cos(a) * bump, Math.sin(a) * bump);
        }
        ctx.closePath(); ctx.fill(); ctx.stroke();
        break;
      }

      // ── 제네릭 융합 (산탄) ────────────────────────────────────────
      case 'fusion_generic_scatter': {
        ctx.rotate(ang);
        ctx.shadowColor = "#a78bfa"; ctx.shadowBlur = 8;
        ctx.fillStyle = "#7c3aed";
        const fgsr = r * 1.3;
        ctx.beginPath();
        ctx.moveTo(fgsr, 0); ctx.lineTo(0, fgsr * 0.55);
        ctx.lineTo(-fgsr, 0); ctx.lineTo(0, -fgsr * 0.55);
        ctx.closePath(); ctx.fill();
        break;
      }

      // ── 기본 탄환 ─────────────────────────────────────────────────
      default: {
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.fillStyle = "#f8f8ff";
        ctx.fill();
        break;
      }
    }
    ctx.restore();
  }
}

function drawParticles() {
  for (const p of state.particles) {
    ctx.globalAlpha = Math.max(0, p.life * 2.5);
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

function drawFloatTexts() {
  ctx.font = "bold 13px Arial";
  ctx.textAlign = "center";
  for (const t of state.floatTexts) {
    ctx.globalAlpha = Math.max(0, Math.min(1, t.life * 1.2));
    ctx.fillStyle = t.color;
    ctx.fillText(t.text, t.x, t.y);
  }
  ctx.globalAlpha = 1;
  ctx.textAlign = "left";
}

function updateHud() {
  hpText.textContent = `${Math.max(0, state.player.hp)} / ${state.player.maxHp}`;
  const hpRatio = Math.max(0, state.player.hp / state.player.maxHp);
  hpFill.style.width = `${hpRatio * 100}%`;
  if (hpRatio <= 0.2) hpFill.classList.add('danger');
  else hpFill.classList.remove('danger');
  levelText.textContent = state.level;
  xpText.textContent = `${state.xp} / ${state.xpToNext}`;
  xpFill.style.width = `${Math.max(0, Math.min(1, state.xp / state.xpToNext)) * 100}%`;
  goldText.textContent = state.gold;
  shardText.textContent = meta.shards;
  waveText.textContent = state.wave;
  killsText.textContent = state.kills;
}

function circleHit(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y) < a.r + b.r;
}


function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function loop(now) {
  const dt = Math.min(0.033, (now - lastTime) / 1000);
  lastTime = now;
  update(dt, now);
  draw();
  requestAnimationFrame(loop);
}

window.addEventListener("keydown", (event) => {
  if (event.code.startsWith("Arrow")) {
    event.preventDefault();
    startNextWaveFromReady();
  }

  keys.add(event.code);
});

window.addEventListener("keyup", (event) => {
  if (event.code.startsWith("Arrow")) {
    event.preventDefault();
  }
  keys.delete(event.code);
});

startButton.addEventListener("click", startGame);
helpButton.addEventListener("click", showHelp);
backToMenuButton.addEventListener("click", hideHelp);
mainMenuButton.addEventListener("click", showMainMenu);
closeShopButton.addEventListener("click", closeShop);
fusionTableButton.addEventListener("click", openFusionTable);
closeFusionTableButton.addEventListener("click", () => fusionTablePanel.classList.add("hidden"));

renderCharacters();
updateHud();
requestAnimationFrame(loop);

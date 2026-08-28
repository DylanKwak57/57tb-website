/**
 * 태국 주소 한 덩어리 → 우리 폼의 칸들로 분해한다.
 *
 * 원장은 자기 가게 주소를 이미 폰 어딘가(라인 메모·페이스북·구글맵)에 갖고 있다.
 * 칸마다 옮겨 적게 하지 말고 **통째로 붙여넣게** 한다 — Flash 앱 `Smart Input` 과 같은 발상이다.
 *
 * 🚨 태국어 주소만 받는다. 영어(구글맵 기본 복사본)는 **일부러 거부**한다.
 *    실측(구글맵 살롱 주소 100건, 2026-08-28): 영어는 성공률 47% 에 **파싱된 것 중 15% 가 조용한 오답**이었다.
 *    `444 Phaya Thai Rd, Wang Mai, Pathum Wan` → 반환 `Pathum Wan`(정답은 `Wang Mai`).
 *    방콕은 tambon 과 amphoe 가 같은 이름인 곳이 흔해(Pathum Wan · Chatuchak · Khlong Toei · Prawet)
 *    점수 계산이 뒤집힌다. **틀린 แขวง 이 송장에 찍히는 건 빈칸보다 나쁘다.**
 *    ⇒ 거부는 우리가 코드로 막는 게 아니라 DB 가 태국어 전용이라 자연히 null 이 된다(교차 확인함).
 *
 * 🚨 파싱 결과를 그대로 제출하지 않는다 — **칸에 채워 넣어 원장이 눈으로 확인·수정**하게 한다.
 *
 * 실측 근거 → `57 Shopee 유통/dealer-targets/05-체험단-캠페인-계획.md` §9-a-4
 */

export type PastedRegion = {
  district: string; // ตำบล / แขวง
  amphoe: string; // อำเภอ / เขต
  province: string; // จังหวัด
  zipcode: number;
};

export type PastedAddress = {
  houseNo: string;
  building: string;
  soi: string;
  road: string;
  region: PastedRegion;
};

/**
 * 붙여넣기 원문을 다듬는다.
 * 🚨 `\b`(워드 경계)를 쓰지 않는다 — 태국어에는 단어 사이 공백이 없어 `\bประเทศไทย\b` 가 매칭되지 않고,
 *    "ประเทศไทย" 가 상세주소에 그대로 남는다(2026-08-28 실측으로 잡은 버그).
 */
function normalize(raw: string): string {
  return raw
    .replace(/ประเทศไทย/g, ' ')
    .replace(/Thailand/gi, ' ')
    .replace(/[,\n\r\t]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * 상세주소 한 줄 → 번지 / 건물·마을 / 소이 / 도로.
 * `ซอย`(`ซ.`)·`ถนน`(`ถ.`) 키워드 위치에서 자르고, 그 앞을 번지 + 건물로 나눈다.
 * 실측 10/10 (2026-08-28).
 */
export function splitDetail(detail: string) {
  const s = (detail || '').replace(/\s+/g, ' ').trim();
  const out = { houseNo: '', building: '', soi: '', road: '' };
  if (!s) return out;

  const KEYWORDS: { key: 'soi' | 'road'; re: RegExp }[] = [
    { key: 'soi', re: /(?:^|\s)(?:ซอย|ซ\.)\s*/ },
    { key: 'road', re: /(?:^|\s)(?:ถนน|ถ\.)\s*/ },
  ];
  const marks: { key: 'soi' | 'road'; start: number; from: number }[] = [];
  for (const { key, re } of KEYWORDS) {
    const m = re.exec(s);
    if (m) {
      marks.push({
        key,
        start: m.index + (m[0].startsWith(' ') ? 1 : 0),
        from: m.index + m[0].length,
      });
    }
  }
  marks.sort((a, b) => a.start - b.start);

  const head = marks.length > 0 ? s.slice(0, marks[0].start).trim() : s;
  marks.forEach((mark, i) => {
    const end = i + 1 < marks.length ? marks[i + 1].start : s.length;
    out[mark.key] = s.slice(mark.from, end).trim();
  });

  // 앞머리 = 번지(숫자로 시작) + 나머지는 건물·마을
  const headMatch = head.match(/^(\d+[\d/-]*(?:\s+\d+[\d/-]*)?)\s*(.*)$/);
  if (headMatch) {
    out.houseNo = headMatch[1].trim();
    out.building = headMatch[2].trim();
  } else {
    out.building = head;
  }
  return out;
}

/**
 * 붙여넣은 태국어 주소를 분해한다. 못 알아보면 `null` — 그때는 손으로 채우면 된다.
 * 🚨 주소 데이터(약 2MB)는 이 함수를 부를 때만 내려받는다. 첫 화면 번들에 넣지 않는다.
 */
export async function parsePastedThaiAddress(raw: string): Promise<PastedAddress | null> {
  const text = normalize(raw);
  if (text.length < 10) return null;

  let hit: (PastedRegion & { address: string }) | null = null;
  try {
    const db = await import('thai-address-database');
    hit = db.splitAddress(text) as (PastedRegion & { address: string }) | null;
  } catch {
    return null;
  }
  if (!hit) return null;

  return { ...splitDetail(hit.address), region: { ...hit, zipcode: Number(hit.zipcode) } };
}

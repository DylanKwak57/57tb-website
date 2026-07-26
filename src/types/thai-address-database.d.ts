// `thai-address-database`(v0.0.31)는 타입 선언을 제공하지 않는다 → 쓰는 함수만 선언한다.
// 반환 형태는 실제 호출로 확인했다: { district, amphoe, province, zipcode }
declare module 'thai-address-database' {
  export type ThaiAddress = {
    district: string;   // แขวง(방콕) / ตำบล(지방)
    amphoe: string;     // เขต(방콕) / อำเภอ(지방)
    province: string;   // จังหวัด
    zipcode: number;    // 5자리
  };
  export function searchAddressByDistrict(term: string, maxResult?: number): ThaiAddress[];
  export function searchAddressByAmphoe(term: string, maxResult?: number): ThaiAddress[];
  export function searchAddressByProvince(term: string, maxResult?: number): ThaiAddress[];
  export function searchAddressByZipcode(term: string | number, maxResult?: number): ThaiAddress[];
  export function splitAddress(address: string): ThaiAddress | null;
}

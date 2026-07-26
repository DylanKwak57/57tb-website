#!/usr/bin/env python3
"""BELLISTA 쇼피 정사각 대표컷을 웹 갤러리 WebP로 가져온다.

- 소스 정본은 쇼피 리스팅 폴더(`57 CEO/57 Shopee 유통/shopee-listings/<폴더>/main-NN.jpg`)다.
  규격·제작 절차는 그 폴더의 README.md가 정본이므로 여기서 이미지를 새로 조판하지 않는다.
- 원본 비율·픽셀 크기를 그대로 유지하고 컨테이너 포맷만 WebP로 바꾼다(리사이즈 금지).
- 소스에 빠진 번호는 건너뛴다. 예: collagen-essence는 main-04가 없어 7장이다.
  파일명은 소스 번호를 그대로 보존하므로, 웹에서 쓰는 번호 목록은
  `src/data/gallery.ts`에 명시해 둔다(정적 export라 런타임에 파일 존재를 볼 수 없다).
"""
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SHOPEE_SOURCE = Path('/Users/dylanmacm5pro/Projects/57TB/57 CEO/57 Shopee 유통/shopee-listings')
OUT = ROOT / 'public/products'
MAIN_RANGE = range(1, 9)

# 쇼피 리스팅 폴더 → 웹 slug
SLUG_BY_SOURCE = {
    'silk-mist': 'bellista-silk-mist',
    'keratin-mist': 'bellista-keratin-mist',
    'collagen-mist': 'bellista-collagen-mist',
    'silk-serum': 'bellista-silk-shine-serum',
    'keratin-serum': 'bellista-keratin-nourish-serum',
    'collagen-serum': 'bellista-collagen-moist-serum',
    'silk-cream': 'bellista-silk-curl-cream',
    'keratin-waterpack': 'bellista-keratin-water-pack',
    'collagen-essence': 'bellista-collagen-aqua-essence',
    # 두피케어(스칼프케어) 5종 — 2026-07-26 쇼피 대표컷 제작 완료분
    'caffeine-shampoo': 'bellista-caffeine-shampoo',
    'caffeine-treatment': 'bellista-caffeine-treatment',
    'caffeine-tonic': 'bellista-caffeine-tonic',
    '3step-set': 'bellista-3step-set',
    'scaling-gel': 'bellista-scaling-gel',
}


def save(image: Image.Image, destination: Path) -> None:
    destination.parent.mkdir(parents=True, exist_ok=True)
    image.convert('RGB').save(destination, 'WEBP', quality=82, method=6)


def convert_gallery(source_dir: str, slug: str) -> list[int]:
    converted: list[int] = []
    for index in MAIN_RANGE:
        name = f'main-{index:02d}'
        source = SHOPEE_SOURCE / source_dir / f'{name}.jpg'
        if not source.exists():
            continue
        save(Image.open(source), OUT / slug / 'gallery' / f'{name}.webp')
        converted.append(index)
    return converted


if __name__ == '__main__':
    total = 0
    for source_dir, slug in SLUG_BY_SOURCE.items():
        indexes = convert_gallery(source_dir, slug)
        total += len(indexes)
        numbers = ', '.join(f'{index:02d}' for index in indexes) or 'none'
        print(f'{slug}: {len(indexes)} images (main-{numbers})')
    print(f'total: {total} gallery images across {len(SLUG_BY_SOURCE)} products')

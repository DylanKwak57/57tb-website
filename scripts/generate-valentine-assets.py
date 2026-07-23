#!/usr/bin/env python3
"""Create deterministic Valentine WebP assets from approved art and Shopee listings."""
from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
SOURCE = Path('/Users/dylanmacm5pro/Projects/57TB/57 CEO/57 Shopee 유통/shopee-listings/valentine/assets')
SHOPEE_SOURCE = Path('/Users/dylanmacm5pro/Projects/57TB/57 CEO/57 Shopee 유통/shopee-listings')
OUT = ROOT / 'public/products'
PAPER = (248, 246, 243, 255)

def save(image: Image.Image, destination: Path, *, quality: int = 82) -> None:
    destination.parent.mkdir(parents=True, exist_ok=True)
    image.convert('RGB').save(destination, 'WEBP', quality=quality, method=6)

def cutout(name: str) -> Image.Image:
    return Image.open(SOURCE / f'{name}-cutout.png').convert('RGBA')

def paste_fit(canvas: Image.Image, art: Image.Image, box: tuple[int, int, int, int]) -> None:
    x, y, width, height = box
    fitted = art.copy()
    fitted.thumbnail((width, height), Image.Resampling.LANCZOS)
    left = x + (width - fitted.width) // 2
    top = y + height - fitted.height
    canvas.alpha_composite(fitted, (left, top))

def magic_assets() -> None:
    target = OUT / 'valentine-magic-straight-system'
    canvas = Image.new('RGBA', (1500, 1050), PAPER)
    draw = ImageDraw.Draw(canvas)
    # Quiet vertical dividers make the two stages legible without changing label art.
    draw.line((750, 130, 750, 950), fill=(200, 192, 183, 255), width=2)
    draw.line((70, 130, 680, 130), fill=(200, 192, 183, 255), width=2)
    draw.line((820, 130, 1430, 130), fill=(200, 192, 183, 255), width=2)
    for name, box in zip(('h1', 'd1', 'c2', 'l2'), ((70, 160, 300, 760), (380, 160, 300, 760), (820, 160, 300, 760), (1130, 160, 300, 760))):
        paste_fit(canvas, cutout(name), box)
    save(canvas, target / 'hero.webp', quality=80)
    thumb = Image.new('RGBA', (800, 800), PAPER)
    for name, box in zip(('h1', 'd1', 'c2', 'l2'), ((35, 90, 175, 610), (215, 90, 175, 610), (410, 90, 175, 610), (590, 90, 175, 610))):
        paste_fit(thumb, cutout(name), box)
    save(thumb, target / 'thumb.webp', quality=78)

def lpp_assets() -> None:
    target = OUT / 'valentine-lpp-treatment'
    art = cutout('lpp')
    hero = Image.new('RGBA', (1100, 1100), PAPER)
    paste_fit(hero, art, (130, 70, 840, 930))
    save(hero, target / 'hero.webp', quality=80)
    thumb = Image.new('RGBA', (800, 800), PAPER)
    paste_fit(thumb, art, (130, 55, 540, 680))
    save(thumb, target / 'thumb.webp', quality=78)

def listing_assets() -> None:
    """Import every approved Shopee visual at its source dimensions and aspect ratio."""
    specs = {
        'valentine-magic-straight-system': {'h1': 'valentine-h1', 'd1': 'valentine-d1', 'c2': 'valentine-c2', 'l2': 'valentine-l2'},
        'valentine-lpp-treatment': {'gallery': 'valentine-lpp'},
    }
    for slug, groups in specs.items():
        for target_group, source_group in groups.items():
            for prefix, count in (('main', 8), ('desc', 6)):
                for index in range(1, count + 1):
                    source = SHOPEE_SOURCE / source_group / f'{prefix}-{index:02d}.jpg'
                    destination = OUT / slug / target_group / f'{prefix}-{index:02d}.webp'
                    if not source.exists():
                        raise FileNotFoundError(f'Missing approved Shopee visual: {source}')
                    image = Image.open(source)
                    save(image, destination, quality=82 if prefix == 'main' else 80)

if __name__ == '__main__':
    magic_assets()
    lpp_assets()
    listing_assets()

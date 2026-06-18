#!/usr/bin/env python3
"""Detailed 16-bit full-body fighter sprites for the Girl Fight 404 game.
Shape-based figures (jacket/shirt/pants/shoes + face) on an 18×34 grid, with an
auto-generated dark outline + soft top-left shading, then nearest-neighbor upscale."""
from PIL import Image, ImageDraw
import os

GW, GH, CELL = 18, 34, 9
OUT = '/Users/jordanrush/girl-fight/public/404/sprites'
os.makedirs(OUT, exist_ok=True)

SKIN = (236, 190, 150); SKIN2 = (208, 158, 120)
EYE = (28, 24, 30); MOUTH = (150, 80, 70)
BOOT = (44, 42, 50); BOOT2 = (28, 26, 34)
OUTLINE = (24, 22, 28)

def shade(col, x, y):
    f = 1.10 - (x / GW) * 0.26 - (y / GH) * 0.12
    f = max(0.62, min(1.18, f))
    return tuple(max(0, min(255, int(c * f))) for c in col)

def darker(c, k=0.7): return tuple(int(v * k) for v in c)

def build(hair, jacket, shirt, pants, *, female=False, singlet=False, tee=False,
          mustache=False, skin=SKIN, hairpink=False, trim=None):
    img = Image.new('RGBA', (GW, GH), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    def box(x0, y0, x1, y1, c): d.rectangle([x0, y0, x1, y1], fill=(*c, 255))

    # ── head ──
    box(6, 3, 11, 9, skin)                 # face
    box(5, 2, 12, 4, hair)                 # hair top
    box(5, 4, 6, 7, hair)                  # hair sides
    box(11, 4, 12, 7, hair)
    box(6, 2, 11, 2, hair)
    if female:                             # longer hair framing + down
        box(5, 4, 5, 12, hair); box(12, 4, 12, 12, hair)
        box(4, 5, 5, 10, hair); box(12, 5, 13, 10, hair)
    img.putpixel((7, 6), (*EYE, 255))
    img.putpixel((10, 6), (*EYE, 255))
    box(8, 8, 9, 8, MOUTH)                 # mouth
    if mustache: box(7, 7, 10, 7, EYE)
    box(8, 9, 9, 9, skin)                  # neck

    # ── torso + legs ──
    if singlet:                            # wrestling singlet: bare arms + legs
        box(5, 11, 6, 18, skin); box(11, 11, 12, 18, skin)   # bare arms
        box(5, 18, 6, 20, skin); box(11, 18, 12, 20, skin)   # forearms/hands
        box(6, 10, 11, 23, shirt)          # singlet body
        box(7, 10, 7, 11, skin); box(10, 10, 10, 11, skin)   # strap gaps (bare shoulders)
        if trim:                           # contrast side stripes
            box(6, 11, 6, 22, trim); box(11, 11, 11, 22, trim)
        box(8, 11, 9, 22, darker(shirt, .85))                # center shadow
        box(6, 23, 8, 30, skin); box(9, 23, 11, 30, skin)    # bare legs
        box(8, 23, 9, 30, darker(skin, .88))
    elif tee:                              # plain t-shirt, short sleeves
        box(5, 10, 12, 22, shirt)          # t-shirt torso
        box(8, 10, 9, 10, darker(shirt, .72))                # crew neck
        box(4, 11, 5, 13, shirt); box(12, 11, 13, 13, shirt) # short sleeves
        box(4, 13, 5, 20, skin); box(12, 13, 13, 20, skin)   # bare arms + hands
        box(6, 22, 8, 30, pants); box(9, 22, 11, 30, pants)  # legs
        box(8, 22, 9, 30, darker(pants, .75))
    else:                                  # jacket open over a shirt
        box(5, 10, 12, 22, jacket)         # jacket body
        box(8, 10, 9, 22, shirt)           # inner shirt strip
        box(7, 10, 10, 11, darker(jacket, .65))   # collar
        for yy in (12, 15, 18): img.putpixel((8, yy), (*darker(shirt, .6), 255))  # zipper
        box(4, 11, 5, 19, jacket); box(12, 11, 13, 19, jacket)  # sleeves
        box(4, 19, 5, 20, skin); box(12, 19, 13, 20, skin)      # hands
        box(6, 22, 8, 30, pants); box(9, 22, 11, 30, pants)     # legs
        box(8, 22, 9, 30, darker(pants, .75))                   # seam shadow

    # ── shoes (common) ──
    box(5, 30, 8, 32, BOOT); box(9, 30, 12, 32, BOOT)
    box(5, 32, 8, 32, BOOT2); box(9, 32, 12, 32, BOOT2)
    return img

# ── animals ──────────────────────────────────────────────
def dog():
    img = Image.new('RGBA', (GW, GH), (0, 0, 0, 0)); d = ImageDraw.Draw(img)
    F = (242, 242, 240); F2 = (205, 205, 205)
    def box(x0, y0, x1, y1, c): d.rectangle([x0, y0, x1, y1], fill=(*c, 255))
    box(4, 2, 6, 5, F); box(11, 2, 13, 5, F)         # ears
    box(4, 5, 13, 13, F)                              # head
    box(3, 13, 14, 26, F)                             # body
    box(3, 8, 4, 12, F); box(13, 8, 14, 12, F)
    img.putpixel((6, 9), (*EYE, 255)); img.putpixel((11, 9), (*EYE, 255))
    box(8, 11, 9, 12, (20, 20, 24))                   # nose
    box(4, 26, 6, 31, F); box(11, 26, 13, 31, F)      # legs
    box(7, 26, 10, 31, F)
    box(4, 31, 13, 32, F2)
    return img

def cat():
    img = Image.new('RGBA', (GW, GH), (0, 0, 0, 0)); d = ImageDraw.Draw(img)
    F = (244, 244, 242); F2 = (208, 208, 208)
    def box(x0, y0, x1, y1, c): d.rectangle([x0, y0, x1, y1], fill=(*c, 255))
    box(4, 1, 6, 4, F); box(11, 1, 13, 4, F)          # pointy ears
    box(5, 4, 12, 12, F)                              # head
    box(4, 12, 13, 27, F)                             # body
    img.putpixel((7, 8), (*EYE, 255)); img.putpixel((10, 8), (*EYE, 255))
    box(8, 9, 9, 9, (255, 133, 241))                  # pink nose
    box(7, 10, 10, 10, (30, 28, 34))                  # mouth
    box(4, 27, 6, 32, F); box(11, 27, 13, 32, F)      # front legs
    box(7, 27, 10, 32, F)
    return img

# ── assemble ─────────────────────────────────────────────
PINK = (255, 96, 210); DKJACKET = (44, 44, 56)
sprites = {
    'dylan':          build((74, 48, 30), None, (242, 242, 242), (40, 44, 60), tee=True),
    'helen':          build((230, 198, 120), None, (42, 42, 50), (40, 44, 60), female=True, tee=True),
    'lil-dylan':      build((120, 86, 50), (150, 60, 70), (235, 235, 235), (60, 56, 70), mustache=True),
    'lil-helen':      build((232, 200, 118), None, (38, 38, 44), (40, 44, 60), female=True, singlet=True, trim=(236, 206, 42)),
    'wrestler-dylan': build((84, 56, 34), None, (190, 40, 55), (190, 40, 55), singlet=True),
    'punk-helen':     build(PINK, DKJACKET, (200, 60, 150), (30, 30, 38), female=True),
}
sprites['chip'] = dog()
sprites['the-cat'] = cat()

# outline + shade + upscale ──────────────────────────────
def finish(img):
    w, h = img.size; px = img.load()
    # shade opaque pixels
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a: px[x, y] = (*shade((r, g, b), x, y), 255)
    # add 1px outline where transparent touches opaque
    out = img.copy(); op = out.load()
    for y in range(h):
        for x in range(w):
            if px[x, y][3] == 0:
                for dx, dy in ((-1, 0), (1, 0), (0, -1), (0, 1), (-1, -1), (1, 1), (-1, 1), (1, -1)):
                    nx, ny = x + dx, y + dy
                    if 0 <= nx < w and 0 <= ny < h and px[nx, ny][3] > 0:
                        op[x, y] = (*OUTLINE, 255); break
    return out.resize((w * CELL, h * CELL), Image.NEAREST)

order = ['dylan', 'chip', 'helen', 'lil-dylan', 'lil-helen', 'wrestler-dylan', 'the-cat', 'punk-helen']
final = {k: finish(sprites[k]) for k in order}
for k, s in final.items():
    s.save(f'{OUT}/{k}.png')

# contact sheet
from PIL import ImageDraw as ID
cw, chh, pad = GW * CELL, GH * CELL, 16
sheet = Image.new('RGB', (4 * (cw + pad) + pad, 2 * (chh + pad + 20) + pad), (52, 52, 60))
dd = ID.Draw(sheet)
for i, k in enumerate(order):
    cx = pad + (i % 4) * (cw + pad); cy = pad + (i // 4) * (chh + pad + 20)
    sheet.paste(final[k], (cx, cy), final[k])
    dd.text((cx, cy + chh + 4), k, fill=(255, 255, 255))
sheet.save('/tmp/sprite-sheet.png')
print('done', [f'{k}:{final[k].size}' for k in order])

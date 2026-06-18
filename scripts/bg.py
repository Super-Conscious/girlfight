#!/usr/bin/env python3
"""Night wrestling-stadium pixel-art background for the 404 game.
Low-res canvas → nearest-neighbor upscale (crisp pixels). Sky + stars + moon
+ stadium bowl with crowd dots + floodlights + dark arena floor."""
from PIL import Image
import random
random.seed(11)

W, H = 360, 188
SCALE = 5
im = Image.new('RGB', (W, H))
px = im.load()

def vline(x, y0, y1, col):
    for y in range(max(0, y0), min(H, y1)):
        px[x, y] = col
def dot(x, y, col):
    if 0 <= x < W and 0 <= y < H:
        px[x, y] = col

# ── sky gradient (night) ──────────────────────────────────
HORIZON = 118
for y in range(H):
    if y < HORIZON:
        f = y / HORIZON
        col = (int(7 + f * 16), int(8 + f * 20), int(28 + f * 34))
    else:
        col = (16, 14, 24)
    for x in range(W):
        px[x, y] = col

# ── stars ─────────────────────────────────────────────────
for _ in range(140):
    x, y = random.randint(0, W - 1), random.randint(0, int(HORIZON * 0.72))
    b = random.choice([150, 185, 215, 245, 255])
    dot(x, y, (b, b, min(255, b + 10)))
    if random.random() < 0.12:
        dot(x + 1, y, (b // 2, b // 2, b // 2)); dot(x - 1, y, (b // 2, b // 2, b // 2))
        dot(x, y + 1, (b // 2, b // 2, b // 2)); dot(x, y - 1, (b // 2, b // 2, b // 2))

# ── moon ──────────────────────────────────────────────────
mx, my, mr = 262, 28, 13
for yy in range(my - mr, my + mr):
    for xx in range(mx - mr, mx + mr):
        if (xx - mx) ** 2 + (yy - my) ** 2 <= mr * mr:
            dot(xx, yy, (226, 226, 208))
for yy in range(my - mr, my + mr):       # crescent shadow
    for xx in range(mx - mr, mx + mr):
        if (xx - mx + 6) ** 2 + (yy - my - 2) ** 2 <= (mr - 1) ** 2:
            if px[xx, yy] == (226, 226, 208): dot(xx, yy, (int(7 + (yy / HORIZON) * 16), int(8 + (yy / HORIZON) * 20), int(28 + (yy / HORIZON) * 34)))

# ── stadium bowl (stands) ─────────────────────────────────
# trapezoid: top edge inset, bottom edge full → seats rise toward the back
STAND_TOP, STAND_BOT = 66, HORIZON      # y range of stands
STAND_INSET = 54                        # horizontal inset at the top
struct = (30, 27, 40)
rim = (52, 48, 66)
for y in range(STAND_TOP, STAND_BOT):
    t = (y - STAND_TOP) / (STAND_BOT - STAND_TOP)
    inset = int(STAND_INSET * (1 - t))
    for x in range(inset, W - inset):
        px[x, y] = struct
# rim / roof line
for x in range(STAND_INSET, W - STAND_INSET):
    dot(x, STAND_TOP - 1, rim); dot(x, STAND_TOP - 2, (40, 38, 52))

# crowd dots — rows of little people, dim night colors
CROWD = [(150, 90, 80), (90, 110, 150), (160, 150, 90), (120, 90, 140),
         (90, 140, 120), (170, 120, 90), (110, 120, 130), (150, 150, 150)]
row = 0
y = STAND_TOP + 2
while y < STAND_BOT - 2:
    t = (y - STAND_TOP) / (STAND_BOT - STAND_TOP)
    inset = int(STAND_INSET * (1 - t)) + 3
    step = 3
    off = (row % 2) * 1
    for x in range(inset + off, W - inset, step):
        if random.random() < 0.82:
            dot(x, y, random.choice(CROWD))
    y += 3
    row += 1

# ── floodlight towers ─────────────────────────────────────
for fx in (40, 320):
    vline(fx, STAND_TOP - 34, STAND_TOP + 4, (60, 60, 72))   # pole
    # lamp box
    for yy in range(STAND_TOP - 40, STAND_TOP - 32):
        for xx in range(fx - 7, fx + 8):
            dot(xx, yy, (40, 40, 50))
    for yy in range(STAND_TOP - 39, STAND_TOP - 33):         # bright bulbs
        for xx in range(fx - 6, fx + 7, 2):
            dot(xx, yy, (255, 252, 210))
    # glow
    for yy in range(STAND_TOP - 44, STAND_TOP - 28):
        for xx in range(fx - 12, fx + 13):
            if random.random() < 0.10 and px[xx, yy] != None:
                dot(xx, yy, (90, 88, 70))

# ── arena floor (dark, in front of stands) ────────────────
for y in range(HORIZON, H):
    f = (y - HORIZON) / (H - HORIZON)
    col = (int(20 - f * 6), int(17 - f * 5), int(26 - f * 8))
    for x in range(W):
        px[x, y] = col
# barrier line between floor and stands
for x in range(W):
    dot(x, HORIZON, (44, 40, 30)); dot(x, HORIZON + 1, (30, 27, 20))

out = im.resize((W * SCALE, H * SCALE), Image.NEAREST)
out.save('/Users/jordanrush/girl-fight/public/404/arena-bg.png')
print('done', out.size)

import os, zlib, struct

def write_png(path, width, height, pixels):
    def png_chunk(chunk_type, data):
        return struct.pack('>I', len(data)) + chunk_type + data + struct.pack('>I', zlib.crc32(chunk_type + data) & 0xffffffff)
    raw = b''.join(b'\x00' + b''.join(bytes(pixels[y*width+x]) for x in range(width)) for y in range(height))
    with open(path, 'wb') as f:
        f.write(b'\x89PNG\r\n\x1a\n')
        f.write(png_chunk(b'IHDR', struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0)))
        f.write(png_chunk(b'IDAT', zlib.compress(raw, 9)))
        f.write(png_chunk(b'IEND', b''))


def blend(c1, c2, t):
    return tuple(int(c1[i] + (c2[i]-c1[i])*t) for i in range(3)) + (255,)

w = 128
h = 128
pixels = [(0,0,0,0)] * (w*h)
for y in range(h):
    t = y/(h-1)
    color = blend((63,94,251), (67,34,216), t)
    for x in range(w):
        pixels[y*w + x] = color

for y in range(14, 114):
    for x in range(24, 104):
        if x in (24, 103) or y in (14, 113):
            pixels[y*w + x] = (255,255,255,200)
        elif 28 <= x < 100 and 18 <= y < 110:
            pixels[y*w + x] = (255,255,255,60)

for y in range(52, 76):
    for x in range(42, 86):
        if abs((x-64)*0.7) + abs(y-64) < 20:
            pixels[y*w + x] = (255,255,255,220)

for i in range(0, 12):
    idx = 64*w + 46 - i
    if 0 <= idx < len(pixels): pixels[idx] = (40,40,40,255)

for i in range(-4, 5):
    idx = (64+i)*w + 46
    if 0 <= idx < len(pixels): pixels[idx] = (40,40,40,255)
    idx = (64+i)*w + 34
    if 0 <= idx < len(pixels): pixels[idx] = (40,40,40,255)

for i in range(0, 12):
    idx = 64*w + 82 + i
    if 0 <= idx < len(pixels): pixels[idx] = (40,40,40,255)

for i in range(-4, 5):
    idx = (64+i)*w + 82
    if 0 <= idx < len(pixels): pixels[idx] = (40,40,40,255)
    idx = (64+i)*w + 94
    if 0 <= idx < len(pixels): pixels[idx] = (40,40,40,255)

for y in range(62, 66):
    for x in range(54, 74):
        pixels[y*w + x] = (255,255,255,255)

for yy in (42, 56, 70, 84, 98):
    for x in range(40, 88):
        pixels[yy*w + x] = (255,255,255,180)

write_png('assets/icon128.png', w, h, pixels)

for size in (48, 16):
    out = []
    for y in range(size):
        for x in range(size):
            sx = int(x * w / size)
            sy = int(y * h / size)
            out.append(pixels[sy*w + sx])
    write_png(f'assets/icon{size}.png', size, size, out)

print('generated icons:', sorted([f for f in os.listdir('assets') if f.startswith('icon')]))

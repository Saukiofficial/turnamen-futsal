import os
from PIL import Image
from collections import deque

input_path = r"C:\Users\lalir\.gemini\antigravity-ide\brain\c5dfdc2e-91b0-45aa-a349-b00f764ff04c\.user_uploaded\media_1789876401796.jpg"
output_path = r"d:\laragon\www\Pendaftaran\public\images\saf_league_logo.png"
os.makedirs(os.path.dirname(output_path), exist_ok=True)

img = Image.open(input_path).convert("RGBA")
width, height = img.size
print(f"Image size: {width}x{height}")

pixels = img.load()
corner_color = pixels[0, 0][:3]
print(f"Corner color: {corner_color}")

# Identify background pixels starting from outer edges using BFS
visited = [False] * (width * height)
is_bg = [False] * (width * height)

def idx(x, y):
    return y * width + x

def is_background_pixel(r, g, b):
    # Light, off-white/gray background
    if r > 230 and g > 230 and b > 230:
        return True
    dist = max(abs(r - corner_color[0]), abs(g - corner_color[1]), abs(b - corner_color[2]))
    if dist < 35 and (r > 210 and g > 210 and b > 210):
        return True
    return False

queue = deque()

# Add all edge pixels
for x in range(width):
    for y in [0, height - 1]:
        p = pixels[x, y]
        if is_background_pixel(p[0], p[1], p[2]):
            i = idx(x, y)
            visited[i] = True
            is_bg[i] = True
            queue.append((x, y))

for y in range(height):
    for x in [0, width - 1]:
        i = idx(x, y)
        if not visited[i]:
            p = pixels[x, y]
            if is_background_pixel(p[0], p[1], p[2]):
                visited[i] = True
                is_bg[i] = True
                queue.append((x, y))

# BFS
directions = [(-1, 0), (1, 0), (0, -1), (0, 1)]
bg_count = len(queue)

while queue:
    cx, cy = queue.popleft()
    for dx, dy in directions:
        nx, ny = cx + dx, cy + dy
        if 0 <= nx < width and 0 <= ny < height:
            ni = idx(nx, ny)
            if not visited[ni]:
                visited[ni] = True
                p = pixels[nx, ny]
                if is_background_pixel(p[0], p[1], p[2]):
                    is_bg[ni] = True
                    bg_count += 1
                    queue.append((nx, ny))

print(f"Background pixels: {bg_count} / {width*height} ({bg_count/(width*height)*100:.1f}%)")

# Apply transparency and anti-aliasing
for y in range(height):
    for x in range(width):
        i = idx(x, y)
        r, g, b, a = pixels[x, y]
        if is_bg[i]:
            pixels[x, y] = (r, g, b, 0)
        else:
            # Check if adjacent to background for soft anti-aliasing
            has_bg_neighbor = False
            bg_neighbors = 0
            for dx, dy in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
                nx, ny = x + dx, y + dy
                if 0 <= nx < width and 0 <= ny < height and is_bg[idx(nx, ny)]:
                    has_bg_neighbor = True
                    bg_neighbors += 1
            if has_bg_neighbor:
                lum = 0.299 * r + 0.587 * g + 0.114 * b
                if lum > 215:
                    new_a = int(255 * max(0.0, 1.0 - (lum - 215) / 40.0 * (bg_neighbors / 4.0)))
                    pixels[x, y] = (r, g, b, min(a, new_a))

img.save(output_path, "PNG")
print(f"Successfully saved transparent logo to {output_path}")

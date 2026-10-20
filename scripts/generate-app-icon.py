#!/usr/bin/env python3
"""Genera el icono de la app (corazón sobre fondo rojo) en PNG, sin dependencias."""

import os
import struct
import zlib

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(ROOT, "public", "icons")


def write_png(path: str, size: int, rgba: bytes) -> None:
    def chunk(tag: bytes, data: bytes) -> bytes:
        return struct.pack(">I", len(data)) + tag + data + struct.pack(">I", zlib.crc32(tag + data) & 0xFFFFFFFF)

    stride = size * 4
    raw = bytearray()
    for y in range(size):
        raw.append(0)
        raw.extend(rgba[y * stride : (y + 1) * stride])

    ihdr = struct.pack(">IIBBBBB", size, size, 8, 6, 0, 0, 0)
    png = b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", ihdr) + chunk(b"IDAT", zlib.compress(bytes(raw), 9)) + chunk(b"IEND", b"")
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "wb") as handle:
        handle.write(png)


def inside_heart(nx: float, ny: float) -> bool:
    x = nx * 1.15
    y = -ny * 1.15 + 0.18
    return (x * x + y * y - 1) ** 3 - (x * x) * (y ** 3) <= 0


def inside_rounded_square(nx: float, ny: float) -> bool:
    radius = 0.38
    limit = 1 - radius
    dx = max(abs(nx) - limit, 0)
    dy = max(abs(ny) - limit, 0)
    return dx * dx + dy * dy <= radius * radius


def render(size: int) -> bytes:
    buf = bytearray(size * size * 4)
    for y in range(size):
        for x in range(size):
            nx = ((x + 0.5) / size) * 2 - 1
            ny = ((y + 0.5) / size) * 2 - 1
            if not inside_rounded_square(nx, ny):
                continue
            # El corazón queda dentro del 80 % central para que iOS pueda recortarlo en círculo.
            if inside_heart(nx / 0.72, ny / 0.72):
                color = (255, 255, 255, 255)
            else:
                color = (236, 19, 55, 255)
            offset = (y * size + x) * 4
            buf[offset : offset + 4] = bytes(color)
    return bytes(buf)


def main() -> None:
    os.makedirs(OUT_DIR, exist_ok=True)
    for size, name in (
        (180, "apple-touch-icon.png"),
        (192, "icon-192.png"),
        (512, "icon-512.png"),
        (1024, "icon-1024.png"),
    ):
        write_png(os.path.join(OUT_DIR, name), size, render(size))
        print(name)


if __name__ == "__main__":
    main()

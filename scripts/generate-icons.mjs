import { deflateSync, inflateSync } from 'node:zlib'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PUBLIC_DIR = resolve(__dirname, '..', 'public')
const SOURCE = resolve(PUBLIC_DIR, 'brand', 'icon-mark.png')

const CREAM = [0xff, 0xf9, 0xca]

const CRC_TABLE = (() => {
  const table = new Uint32Array(256)
  for (let n = 0; n < 256; n += 1) {
    let c = n
    for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    table[n] = c >>> 0
  }
  return table
})()

const crc32 = (buf) => {
  let crc = 0xffffffff
  for (let i = 0; i < buf.length; i += 1) crc = CRC_TABLE[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8)
  return (crc ^ 0xffffffff) >>> 0
}

const chunk = (type, data) => {
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data])
  const out = Buffer.alloc(body.length + 8)
  out.writeUInt32BE(data.length, 0)
  body.copy(out, 4)
  out.writeUInt32BE(crc32(body), body.length + 4)
  return out
}

function encodePng(width, height, rgba) {
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8
  ihdr[9] = 6
  const stride = width * 4
  const raw = Buffer.alloc((stride + 1) * height)
  for (let y = 0; y < height; y += 1) {
    raw[y * (stride + 1)] = 0
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, y * stride + stride)
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0))
  ])
}

function paeth(a, b, c) {
  const p = a + b - c
  const pa = Math.abs(p - a)
  const pb = Math.abs(p - b)
  const pc = Math.abs(p - c)
  if (pa <= pb && pa <= pc) return a
  if (pb <= pc) return b
  return c
}

function decodePng(buffer) {
  let offset = 8
  let width = 0
  let height = 0
  let colorType = 6
  let bitDepth = 8
  const idat = []

  while (offset < buffer.length) {
    const length = buffer.readUInt32BE(offset)
    const type = buffer.toString('ascii', offset + 4, offset + 8)
    const data = buffer.subarray(offset + 8, offset + 8 + length)
    if (type === 'IHDR') {
      width = data.readUInt32BE(0)
      height = data.readUInt32BE(4)
      bitDepth = data[8]
      colorType = data[9]
    } else if (type === 'IDAT') {
      idat.push(data)
    } else if (type === 'IEND') {
      break
    }
    offset += length + 12
  }

  if (bitDepth !== 8 || colorType !== 6) {
    throw new Error(`Поддерживается только 8-битный RGBA PNG, получено depth=${bitDepth} colorType=${colorType}`)
  }

  const raw = inflateSync(Buffer.concat(idat))
  const bpp = 4
  const stride = width * bpp
  const pixels = Buffer.alloc(height * stride)

  for (let y = 0; y < height; y += 1) {
    const filter = raw[y * (stride + 1)]
    const rowStart = y * (stride + 1) + 1
    const outStart = y * stride
    const prevStart = (y - 1) * stride

    for (let x = 0; x < stride; x += 1) {
      const rawByte = raw[rowStart + x]
      const a = x >= bpp ? pixels[outStart + x - bpp] : 0
      const b = y > 0 ? pixels[prevStart + x] : 0
      const c = x >= bpp && y > 0 ? pixels[prevStart + x - bpp] : 0
      let value
      switch (filter) {
        case 0:
          value = rawByte
          break
        case 1:
          value = rawByte + a
          break
        case 2:
          value = rawByte + b
          break
        case 3:
          value = rawByte + ((a + b) >> 1)
          break
        case 4:
          value = rawByte + paeth(a, b, c)
          break
        default:
          throw new Error(`Неизвестный фильтр PNG: ${filter}`)
      }
      pixels[outStart + x] = value & 0xff
    }
  }

  return { width, height, data: pixels }
}

function compositeOverCream({ width, height, data }) {
  const out = Buffer.alloc(width * height * 3)
  for (let i = 0, p = 0; i < data.length; i += 4, p += 3) {
    const alpha = data[i + 3] / 255
    out[p] = Math.round(data[i] * alpha + CREAM[0] * (1 - alpha))
    out[p + 1] = Math.round(data[i + 1] * alpha + CREAM[1] * (1 - alpha))
    out[p + 2] = Math.round(data[i + 2] * alpha + CREAM[2] * (1 - alpha))
  }
  return out
}

function renderIcon(source, size, contentRatio) {
  const { width: sw, height: sh } = source.dims
  const src = source.rgb
  const content = Math.round(size * contentRatio)
  const offset = Math.round((size - content) / 2)
  const out = Buffer.alloc(size * size * 4)

  for (let ty = 0; ty < size; ty += 1) {
    for (let tx = 0; tx < size; tx += 1) {
      const i = (ty * size + tx) * 4
      const cx = tx - offset
      const cy = ty - offset

      if (cx < 0 || cy < 0 || cx >= content || cy >= content) {
        out[i] = CREAM[0]
        out[i + 1] = CREAM[1]
        out[i + 2] = CREAM[2]
        out[i + 3] = 255
        continue
      }

      const x0 = Math.floor((cx * sw) / content)
      const x1 = Math.max(x0 + 1, Math.ceil(((cx + 1) * sw) / content))
      const y0 = Math.floor((cy * sh) / content)
      const y1 = Math.max(y0 + 1, Math.ceil(((cy + 1) * sh) / content))

      let r = 0
      let g = 0
      let b = 0
      let count = 0
      for (let sy = y0; sy < y1 && sy < sh; sy += 1) {
        for (let sx = x0; sx < x1 && sx < sw; sx += 1) {
          const sp = (sy * sw + sx) * 3
          r += src[sp]
          g += src[sp + 1]
          b += src[sp + 2]
          count += 1
        }
      }
      out[i] = Math.round(r / count)
      out[i + 1] = Math.round(g / count)
      out[i + 2] = Math.round(b / count)
      out[i + 3] = 255
    }
  }

  return encodePng(size, size, out)
}

const decoded = decodePng(readFileSync(SOURCE))
const source = { dims: decoded, rgb: compositeOverCream(decoded) }
console.log(`Источник: brand/icon-mark.png ${decoded.width}x${decoded.height}`)

mkdirSync(PUBLIC_DIR, { recursive: true })

const targets = [
  { file: 'pwa-192x192.png', size: 192, ratio: 0.82 },
  { file: 'pwa-512x512.png', size: 512, ratio: 0.82 },
  { file: 'pwa-maskable-512x512.png', size: 512, ratio: 0.62 },
  { file: 'apple-touch-icon.png', size: 180, ratio: 0.82 }
]

for (const target of targets) {
  const png = renderIcon(source, target.size, target.ratio)
  writeFileSync(resolve(PUBLIC_DIR, target.file), png)
  console.log(`✓ ${target.file} (${target.size}x${target.size}, ${png.length} байт)`)
}

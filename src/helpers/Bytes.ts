/**
 * bytes converts and formats common file sizes.
 *
 * @example
 * bytes.megabytes(5) // 5242880
 * bytes.format(5242880) // "5.0 MB"
 */
const bytes = {
  kilobytes: (value: number): number => value * 1024,
  megabytes: (value: number): number => value * 1024 * 1024,
  gigabytes: (value: number): number => value * 1024 * 1024 * 1024,
  format: (value: number): string => {
    if (value === 0) {
      return "0 bytes"
    }

    const units = ["bytes", "KB", "MB", "GB"]
    const unit = Math.min(
      Math.floor(Math.log(value) / Math.log(1024)),
      units.length - 1
    )
    const size = value / 1024 ** unit

    return `${unit === 0 ? size : size.toFixed(size >= 10 ? 0 : 1)} ${
      units[unit]
    }`
  },
}

export default bytes

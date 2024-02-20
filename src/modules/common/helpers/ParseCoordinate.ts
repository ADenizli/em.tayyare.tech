export default function parseCoordinate(
  direction: string,
  deg: string,
  min: string,
): number {
  const degrees = parseFloat(deg);
  const minutes = parseFloat(min);
  const sign = direction === 'N' || direction === 'E' ? 1 : -1;
  return sign * (degrees + minutes / 60);
}

import type { WidgetLayoutItem } from '@shared/types';

/**
 * Find the first open slot in a 12-column grid that fits w x h.
 * Scans row by row left-to-right. If no slot is open within the first 6 rows,
 * places at y = max(y+h) of existing items (i.e. on a new row at the bottom).
 */
export function findOpenSlot(
  items: WidgetLayoutItem[],
  w: number,
  h: number,
  cols: number,
  maxScanRows = 6
): { x: number; y: number } {
  const occupied = (x: number, y: number) =>
    items.some(
      (it) => x < it.x + it.w && x + w > it.x && y < it.y + it.h && y + h > it.y
    );

  for (let y = 0; y < maxScanRows; y++) {
    for (let x = 0; x <= cols - w; x++) {
      if (!occupied(x, y)) return { x, y };
    }
  }
  const maxY = items.reduce((m, it) => Math.max(m, it.y + it.h), 0);
  return { x: 0, y: maxY };
}

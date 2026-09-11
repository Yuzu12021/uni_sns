export function parseTags(value: string) {
  return Array.from(
    new Set(
      value
        .split(/[,、]/)
        .map((tag) => tag.trim())
        .filter(Boolean)
    )
  );
}
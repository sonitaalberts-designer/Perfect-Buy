export type CollectionLocker = {
  id: string;
  name: string;
  address: string;
  city: string;
  hours: string;
};

export type LockerSearchResult = {
  lockers: CollectionLocker[];
  matchType: "exact" | "area" | "none";
  matchedArea?: string;
};

const roadWords = new Set([
  "road",
  "street",
  "drive",
  "avenue",
  "boulevard",
  "lane",
  "corner",
  "cnr",
  "c",
  "o",
]);
const broadAreas = new Set([
  "south africa",
  "gauteng",
  "western cape",
  "eastern cape",
  "northern cape",
  "free state",
  "kwazulu natal",
  "limpopo",
  "mpumalanga",
  "north west",
  "northwest",
  "south africa za",
]);
const genericAreaWords = new Set([
  "north",
  "south",
  "east",
  "west",
  "central",
  "park",
  "city",
  "town",
  "new",
  "old",
  "extension",
  "ext",
  "estate",
  "estates",
  "africa",
  "province",
]);

function normaliseLockerSearch(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\btree rivers\b/g, "three rivers")
    .replace(/\brd\b/g, "road")
    .replace(/\bst\b/g, "street")
    .replace(/\bdr\b/g, "drive")
    .replace(/\bave\b/g, "avenue")
    .replace(/\bblvd\b/g, "boulevard")
    .replace(/\bln\b/g, "lane")
    .replace(/\bgen\b/g, "general");
}

function searchWords(value: string): string[] {
  return [
    ...new Set(
      normaliseLockerSearch(value)
        .split(" ")
        .filter((word) => word.length >= 2 && !roadWords.has(word)),
    ),
  ];
}

function wordMatches(queryWord: string, word: string): boolean {
  return word === queryWord || (queryWord.length >= 4 && word.startsWith(queryWord));
}

/** Search verified locker records; an address can fall back only to a named town/suburb in that address. */
export function searchCollectionLockers(
  lockers: CollectionLocker[],
  query: string,
): LockerSearchResult {
  const queryWords = searchWords(query);
  if (!queryWords.length) return { lockers: [], matchType: "none" };
  const ranked = lockers.map((locker) => {
    const words = searchWords(`${locker.name} ${locker.address} ${locker.city}`);
    const nameWords = searchWords(locker.name);
    const exact = queryWords.every((queryWord) =>
      words.some((word) => wordMatches(queryWord, word)),
    );
    const score = queryWords.reduce(
      (total, queryWord) =>
        total +
        (words.includes(queryWord)
          ? 3
          : words.some((word) => wordMatches(queryWord, word))
            ? 1
            : 0) +
        (nameWords.some((word) => wordMatches(queryWord, word)) ? 2 : 0),
      0,
    );
    return { locker, exact, score };
  });
  const compare = (
    a: { locker: CollectionLocker; score: number },
    b: { locker: CollectionLocker; score: number },
  ) =>
    b.score - a.score ||
    normaliseLockerSearch(a.locker.name).localeCompare(normaliseLockerSearch(b.locker.name));
  const exact = ranked.filter((entry) => entry.exact).sort(compare);
  if (exact.length)
    return { lockers: exact.slice(0, 40).map((entry) => entry.locker), matchType: "exact" };

  const areas = new Map<string, { label: string; words: string[]; city: boolean }>();
  for (const locker of lockers) {
    const candidates = [
      { label: locker.city, city: true },
      ...locker.address
        .split(",")
        .slice(1)
        .map((label) => ({ label: label.trim(), city: false })),
    ];
    for (const candidate of candidates) {
      const key = normaliseLockerSearch(candidate.label);
      const words = searchWords(candidate.label);
      if (
        !key ||
        broadAreas.has(key) ||
        !words.some((word) => /[a-z]/.test(word) && !genericAreaWords.has(word))
      )
        continue;
      if (!words.every((word) => queryWords.some((queryWord) => wordMatches(queryWord, word))))
        continue;
      const existing = areas.get(key);
      if (!existing || candidate.city)
        areas.set(key, { label: candidate.label.trim(), words, city: candidate.city });
    }
  }
  const area = [...areas.values()].sort(
    (a, b) =>
      b.words.length - a.words.length ||
      Number(b.city) - Number(a.city) ||
      a.label.localeCompare(b.label),
  )[0];
  if (!area) return { lockers: [], matchType: "none" };
  const matches = ranked
    .filter(({ locker }) => {
      const words = searchWords(`${locker.city} ${locker.address}`);
      return area.words.every((word) => words.includes(word));
    })
    .sort(compare);
  return {
    lockers: matches.slice(0, 40).map((entry) => entry.locker),
    matchType: "area",
    matchedArea: area.label,
  };
}

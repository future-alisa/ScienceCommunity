type TagOption = { value: string; label?: string };

const searchText = (value: string) => value.trim().normalize("NFC").toLocaleLowerCase();

export function matchesTag(input: string, option?: TagOption) {
  return searchText(option?.label ?? option?.value ?? "").includes(searchText(input));
}

export function sortTagMatches(a: TagOption, b: TagOption, { searchValue }: { searchValue: string }) {
  if (!a.value || !b.value) return Number(Boolean(a.value)) - Number(Boolean(b.value));
  const query = searchText(searchValue);
  const prefixOrder = Number(searchText(b.value).startsWith(query)) - Number(searchText(a.value).startsWith(query));
  return prefixOrder || a.value.localeCompare(b.value, "zh-CN");
}

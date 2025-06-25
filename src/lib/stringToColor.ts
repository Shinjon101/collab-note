function stringToColor(str: string): string {
  let hash = 0;

  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const hex = (hash >>> 0).toString(16).toUpperCase().padStart(6, "0");

  return `#${hex}`;
}

export default stringToColor;

/**
 * Chunks a given text into an array of strings, where each string
 * is no longer than the given maximum number of characters.
 * The text is split into paragraphs, and each paragraph is added to
 * the current chunk. If a paragraph is too long to fit in the
 * current chunk, it is added to the array of chunks and a new
 * chunk is started.
 * @param {string} text - The text to be chunked.
 * @param {number} maxChars - The maximum number of characters per chunk.
 * @returns {string[]} An array of strings, where each string is a chunk of
 * the original text, no longer than the given maximum number of
 * characters.
 */
function chunkText(text: string, maxChars: number): string[] {
  const chunks: string[] = [];

  const paragraphs = text.split(/\n{2,}/);
  let current = "";

  for (const para of paragraphs) {
    // if paragraph is too long, add it to chunks
    if ((current + para).length > maxChars) {
      if (current) chunks.push(current.trim());
      current = para;
    } else {
      // if paragraph is not too long, add it to current
      current += (current ? "\n\n" : "") + para;
    }
  }

  if (current.trim()) chunks.push(current.trim());
  return chunks;
}

export default chunkText;

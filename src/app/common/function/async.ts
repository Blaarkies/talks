export async function wait(durationMs = 0) {
  return new Promise(r => setTimeout(r, durationMs));
}
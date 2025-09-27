import "server-only";
let logger: ReturnType<Awaited<typeof import("pino")>>;

export async function getLogger() {
  if (!logger) {
    const pino = (await import("pino")).default;
    logger = pino();
  }
  return logger;
}

export async function register() {
  if (
    process.env.NEXT_RUNTIME === 'nodejs' &&
    process.env.OTEL_EXPORTER_ENDPOINT
  ) {
    await import('./instrumentation.node.ts');
  }
}

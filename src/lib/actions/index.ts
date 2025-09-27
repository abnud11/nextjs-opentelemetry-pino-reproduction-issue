"use server";

import { getLogger } from "../logger";
import { logs } from "@opentelemetry/api-logs";

export async function action(name: string) {
  const logger = await getLogger();
  logger.info(`Action called: ${name}`);
  logs.getLogger("default").emit({
    body: `this will show on otel collector ${name}`,
  });
  return `Action ${name} completed`;
}

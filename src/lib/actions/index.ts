"use server";

import { getLogger } from "../logger";

export async function action(name: string) {
  const logger = await getLogger();
  logger.info(`Action called: ${name}`);
  return `Action ${name} completed`;
}

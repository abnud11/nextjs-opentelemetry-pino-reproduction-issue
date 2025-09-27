"use client";

import { action } from "../actions";

export function TestComponent() {
  return <button onClick={() => action("Hello World")}>Test Logging</button>;
}

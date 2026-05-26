import { NextResponse } from "next/server";
import type { ZodError } from "zod";

export function jsonData<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export function validationError(error: ZodError) {
  return NextResponse.json(
    {
      error: "Validation failed",
      issues: error.flatten(),
    },
    { status: 400 },
  );
}

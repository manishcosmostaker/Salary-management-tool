import { employeeService } from "@/lib/services/employee.service";
import { jsonData, jsonError, validationError } from "@/lib/api/response";
import {
  createEmployeeSchema,
  listEmployeesQuerySchema,
} from "@/lib/validations/employee";

function queryParamsToObject(request: Request) {
  const params: Record<string, string> = {};
  const url = new URL(request.url);
  url.searchParams.forEach((value, key) => {
    params[key] = value;
  });
  return params;
}

export async function GET(request: Request) {
  const parsed = listEmployeesQuerySchema.safeParse(
    queryParamsToObject(request),
  );

  if (!parsed.success) {
    return validationError(parsed.error);
  }

  const result = await employeeService.list(parsed.data);
  return jsonData(result);
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body", 400);
  }

  const parsed = createEmployeeSchema.safeParse(body);
  if (!parsed.success) {
    return validationError(parsed.error);
  }

  const employee = await employeeService.create(parsed.data);
  return jsonData(employee, 201);
}

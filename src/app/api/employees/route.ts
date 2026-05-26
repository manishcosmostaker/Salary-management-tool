import { employeeService } from "@/lib/services/employee.service";
import { jsonData, jsonError, validationError } from "@/lib/api/response";
import { createEmployeeSchema } from "@/lib/validations/employee";

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

import { employeeService } from "@/lib/services/employee.service";
import { isPrismaNotFoundError } from "@/lib/api/prisma-errors";
import { jsonData, jsonError, validationError } from "@/lib/api/response";
import { updateEmployeeSchema } from "@/lib/validations/employee";

type RouteContext = {
  params: Promise<{ id: string }>;
};

async function getId(context: RouteContext) {
  const { id } = await context.params;
  return id;
}

export async function GET(_request: Request, context: RouteContext) {
  const employee = await employeeService.getById(await getId(context));

  if (!employee) {
    return jsonError("Employee not found", 404);
  }

  return jsonData(employee);
}

export async function PATCH(request: Request, context: RouteContext) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body", 400);
  }

  const parsed = updateEmployeeSchema.safeParse(body);
  if (!parsed.success) {
    return validationError(parsed.error);
  }

  try {
    const employee = await employeeService.update(await getId(context), parsed.data);
    return jsonData(employee);
  } catch (error) {
    if (isPrismaNotFoundError(error)) {
      return jsonError("Employee not found", 404);
    }
    throw error;
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    await employeeService.delete(await getId(context));
    return new Response(null, { status: 204 });
  } catch (error) {
    if (isPrismaNotFoundError(error)) {
      return jsonError("Employee not found", 404);
    }
    throw error;
  }
}

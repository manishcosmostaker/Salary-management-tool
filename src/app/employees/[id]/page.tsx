import { EmployeeDetail } from "@/components/employees/employee-detail";

type EmployeePageProps = {
  params: Promise<{ id: string }>;
};

export default async function EmployeePage({ params }: EmployeePageProps) {
  const { id } = await params;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <EmployeeDetail employeeId={id} />
    </div>
  );
}

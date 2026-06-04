/** Initial demo data — persisted to localStorage after first load */

export const seedProjectId = "p-seed-1";
export const seedEmployeeId = "emp-seed-1";

export function getDefaultProjects() {
  return [
    {
      id: seedProjectId,
      name: "Project Alpha",
      companyName: "Sruthika Constructions Pvt Ltd",
      location: "Hyderabad",
      startDate: "2026-01-15",
      managerId: seedEmployeeId,
    },
  ];
}

export function getDefaultEmployees() {
  return [
    {
      id: "emp-seed-1",
      name: "Ravi Kumar",
      employeeId: "EMP001",
      mobile: "9876543210",
      aadhar: "123456789012",
      monthlySalary: "25000",
      trainingDurationStart: "",
      trainingDurationEnd: "",
    },
  ];
}

export function getDefaultAttendance() {
  return [];
}

export function getDefaultWorkDetails() {
  return [
    {
      id: "wd-seed-1",
      date: "2026-01-20",
      name: "Foundation work",
      reason: "Scheduled foundation pour for block A",
      status: "In Progress",
    },
  ];
}

export function emptyReports() {
  return {
    labour: [],
    machinery: [],
    materials: [],
    stock: [],
    details: [],
    accounts: [],
  };
}

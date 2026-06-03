/** HR helpers: calendar, attendance keys, salary from presence */

export function getDaysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

export function formatMonthKey(year, month) {
  return `${year}-${String(month).padStart(2, "0")}`;
}

export function parseMonthKey(key) {
  const [y, m] = key.split("-").map(Number);
  return { year: y, month: m };
}

export function getMonthDates(year, month) {
  const days = getDaysInMonth(year, month);
  return Array.from({ length: days }, (_, i) => {
    const d = i + 1;
    return `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  });
}

export function isPresent(records, employeeId, date) {
  return records.some(
    (r) =>
      r.employeeId === employeeId &&
      r.date === date &&
      r.status === "present"
  );
}

export function summarizeAttendance(records, employeeId, year, month) {
  const monthStr = formatMonthKey(year, month);
  const daysInMonth = getDaysInMonth(year, month);
  const dates = getMonthDates(year, month);

  const presentDates = records
    .filter(
      (r) =>
        r.employeeId === employeeId &&
        r.date.startsWith(monthStr) &&
        r.status === "present"
    )
    .map((r) => r.date)
    .sort();

  const present = presentDates.length;
  const absent = daysInMonth - present;

  return { present, absent, daysInMonth, presentDates, dates };
}

export function calculateSalary(employee, records, year, month) {
  const monthlySalary = Number(employee.monthlySalary) || 0;
  const { present, absent, daysInMonth, presentDates } = summarizeAttendance(
    records,
    employee.employeeId,
    year,
    month
  );

  const dailyRate = daysInMonth > 0 ? monthlySalary / daysInMonth : 0;
  const netSalary = Math.max(0, Math.round(present * dailyRate * 100) / 100);
  const deduction = Math.round(absent * dailyRate * 100) / 100;

  return {
    monthlySalary,
    daysInMonth,
    present,
    absent,
    presentDates,
    dailyRate: Math.round(dailyRate * 100) / 100,
    deduction,
    netSalary,
  };
}

export function maskAadhar(aadhar) {
  const s = String(aadhar || "").replace(/\s/g, "");
  if (s.length < 4) return "—";
  return `XXXX XXXX ${s.slice(-4)}`;
}

export const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

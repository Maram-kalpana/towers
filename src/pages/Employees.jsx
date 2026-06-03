import { useEffect, useMemo, useState } from "react";
import { Search, Plus, Pencil, Trash2, X, CreditCard } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import { useApp } from "../context/AppContext";
import EmployeeIdCardView from "../components/EmployeeIdCardView";

function SlidePanel({ open, onClose, children }) {
  if (!open) return null;
  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/20" onClick={onClose} />
      <div className="fixed top-0 right-0 z-50 h-full w-full max-w-[420px] bg-card border-l border-border shadow-2xl overflow-y-auto">
        {children}
      </div>
    </>
  );
}

function LabeledInput({ label, type = "text", value, onChange, placeholder }) {
  return (
    <div className="relative">
      {label && (
        <label className="absolute left-4 -top-2.5 bg-card px-1 text-xs text-muted-foreground z-10">
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full h-11 rounded-2xl border border-border bg-background px-4 text-foreground outline-none focus:ring-2 focus:ring-primary/30"
      />
    </div>
  );
}

const emptyForm = {
  name: "",
  employeeId: "",
  mobile: "",
  aadhar: "",
  monthlySalary: "",
  trainingDurationStart: "",
  trainingDurationEnd: "",
};

export default function Employees() {
  const { employees, setEmployees } = useApp();
  const [search, setSearch] = useState("");
  const [openPanel, setOpenPanel] = useState(false);
  const [openCard, setOpenCard] = useState(false);
  const [cardEmployee, setCardEmployee] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [form, setForm] = useState(emptyForm);
  const itemsPerPage = 5;

  useEffect(() => setCurrentPage(1), [search]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return employees.filter(
      (e) =>
        (e.name || "").toLowerCase().includes(q) ||
        (e.employeeId || "").toLowerCase().includes(q) ||
        (e.mobile || "").includes(q)
    );
  }, [employees, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage]);

  const resetForm = () => setForm(emptyForm);

  const handleSave = () => {
    if (!form.name.trim()) return alert("Please enter name");
    if (!form.employeeId.trim()) return alert("Please enter Employee ID");
    if (!form.mobile.trim()) return alert("Please enter mobile number");
    if (!form.aadhar.trim()) return alert("Please enter Aadhar number");
    if (!form.monthlySalary.toString().trim()) return alert("Please enter monthly salary");

    const empIdUpper = form.employeeId.trim().toUpperCase();
    const duplicate = employees.find(
      (e) =>
        e.employeeId.toUpperCase() === empIdUpper &&
        e.id !== editingId
    );
    if (duplicate) return alert("Employee ID already exists");

    if (
      form.trainingDurationStart &&
      form.trainingDurationEnd &&
      form.trainingDurationStart > form.trainingDurationEnd
    ) {
      return alert("Training end date must be on or after start date");
    }

    const payload = {
      name: form.name.trim(),
      employeeId: empIdUpper,
      mobile: form.mobile.trim(),
      aadhar: form.aadhar.trim().replace(/\s/g, ""),
      monthlySalary: form.monthlySalary.toString().trim(),
      trainingDurationStart: form.trainingDurationStart || "",
      trainingDurationEnd: form.trainingDurationEnd || "",
    };

    if (editingId) {
      setEmployees((prev) =>
        prev.map((e) => (e.id === editingId ? { ...e, ...payload } : e))
      );
    } else {
      setEmployees((prev) => [...prev, { id: `emp-${Date.now()}`, ...payload }]);
    }

    setOpenPanel(false);
    setEditingId(null);
    resetForm();
  };

  const handleEdit = (emp) => {
    setEditingId(emp.id);
    setForm({
      name: emp.name || "",
      employeeId: emp.employeeId || "",
      mobile: emp.mobile || "",
      aadhar: emp.aadhar || "",
      monthlySalary: emp.monthlySalary ?? "",
      trainingDurationStart: emp.trainingDurationStart || "",
      trainingDurationEnd: emp.trainingDurationEnd || "",
    });
    setOpenPanel(true);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this employee?")) return;
    setEmployees((prev) => prev.filter((e) => e.id !== id));
  };

  const showCard = (emp) => {
    setCardEmployee(emp);
    setOpenCard(true);
  };

  return (
    <>
      <AdminLayout>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              Add employees and generate downloadable ID cards from Employee ID.
            </p>
            <button
              type="button"
              onClick={() => {
                resetForm();
                setEditingId(null);
                setOpenPanel(true);
              }}
              className="h-11 px-5 rounded-2xl bg-primary text-white text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition shadow-md shadow-primary/25"
            >
              <Plus className="w-4 h-4" />
              Add Employee
            </button>
          </div>

          <div className="relative w-full max-w-[430px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or employee ID..."
              className="w-full h-11 pl-10 pr-4 rounded-xl bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div className="bg-card rounded-xl border border-border overflow-x-auto">
            <table className="w-full text-sm border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-secondary/50">
                  {[
                    "Name",
                    "Employee ID",
                    "Mobile",
                    "Aadhar",
                    "Salary",
                    "Training Period",
                    "Actions",
                  ].map((h, i) => (
                      <th
                        key={h}
                        className={`py-3 px-4 border-b border-r border-border font-semibold ${
                          i === 6 ? "text-right" : "text-left"
                        }`}
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {paginated.map((emp) => (
                  <tr key={emp.id} className="hover:bg-secondary/30">
                    <td className="py-3 px-4 border-b border-r border-border">{emp.name}</td>
                    <td className="py-3 px-4 border-b border-r border-border font-medium text-primary">
                      {emp.employeeId}
                    </td>
                    <td className="py-3 px-4 border-b border-r border-border">{emp.mobile}</td>
                    <td className="py-3 px-4 border-b border-r border-border">
                      {emp.aadhar ? `•••• ${String(emp.aadhar).slice(-4)}` : "—"}
                    </td>
                    <td className="py-3 px-4 border-b border-r border-border">
                      ₹{Number(emp.monthlySalary).toLocaleString("en-IN")}
                    </td>
                    <td className="py-3 px-4 border-b border-r border-border text-xs">
                      {emp.trainingDurationStart && emp.trainingDurationEnd
                        ? `${emp.trainingDurationStart} — ${emp.trainingDurationEnd}`
                        : emp.trainingDurationStart || emp.trainingDurationEnd || "—"}
                    </td>
                    <td className="py-3 px-4 border-b border-border text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          title="ID Card"
                          onClick={() => showCard(emp)}
                          className="p-1.5 rounded-lg hover:bg-secondary"
                        >
                          <CreditCard className="w-4 h-4 text-primary" />
                        </button>
                        <button type="button" onClick={() => handleEdit(emp)}>
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button type="button" onClick={() => handleDelete(emp.id)}>
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {paginated.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-muted-foreground">
                      No employees found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center px-4">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-4 py-2 rounded-lg border border-border text-sm disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-4 py-2 rounded-lg border border-border text-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>

          <p className="text-xs text-muted-foreground px-1">
            Employees can download their ID card on mobile at{" "}
            <span className="text-primary font-medium">#/employee</span>
          </p>
        </div>
      </AdminLayout>

      <SlidePanel open={openPanel} onClose={() => setOpenPanel(false)}>
        <div className="p-7 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">{editingId ? "Edit Employee" : "Add Employee"}</h2>
            <button type="button" onClick={() => setOpenPanel(false)}>
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
          <LabeledInput
            label="Name"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            placeholder="Full name"
          />
          <LabeledInput
            label="Employee ID"
            value={form.employeeId}
            onChange={(e) => setForm((p) => ({ ...p, employeeId: e.target.value }))}
            placeholder="e.g. EMP001"
          />
          <LabeledInput
            label="Mobile Number"
            value={form.mobile}
            onChange={(e) => setForm((p) => ({ ...p, mobile: e.target.value }))}
            placeholder="10-digit mobile"
          />
          <LabeledInput
            label="Aadhar Number"
            value={form.aadhar}
            onChange={(e) => setForm((p) => ({ ...p, aadhar: e.target.value }))}
            placeholder="12-digit Aadhar"
          />
          <LabeledInput
            label="Monthly Salary"
            type="number"
            value={form.monthlySalary}
            onChange={(e) => setForm((p) => ({ ...p, monthlySalary: e.target.value }))}
            placeholder="Amount in ₹"
          />
          <div>
            <p className="text-sm font-medium text-foreground mb-2">Training duration period</p>
            <div className="grid grid-cols-1 gap-3">
              <LabeledInput
                label="Start date"
                type="date"
                value={form.trainingDurationStart}
                onChange={(e) =>
                  setForm((p) => ({ ...p, trainingDurationStart: e.target.value }))
                }
              />
              <LabeledInput
                label="End date"
                type="date"
                value={form.trainingDurationEnd}
                onChange={(e) =>
                  setForm((p) => ({ ...p, trainingDurationEnd: e.target.value }))
                }
              />
            </div>
          </div>
          <button
            type="button"
            onClick={handleSave}
            className="w-full h-12 rounded-2xl bg-primary text-white font-semibold"
          >
            Save Employee
          </button>
        </div>
      </SlidePanel>

      {openCard && cardEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-card rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto border border-border shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Employee ID Card</h3>
              <button type="button" onClick={() => setOpenCard(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <EmployeeIdCardView employee={cardEmployee} />
          </div>
        </div>
      )}
    </>
  );
}

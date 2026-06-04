import { useRef } from "react";
import html2canvas from "html2canvas";
import { Download } from "lucide-react";
import AppLogo from "./AppLogo";
import { maskAadhar } from "../utils/hrUtils";

export default function EmployeeIdCardView({ employee, showDownload = true, compact = false }) {
  const cardRef = useRef(null);

  if (!employee) return null;

  const handleDownload = async () => {
    if (!cardRef.current) return;
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
      });
      const link = document.createElement("a");
      link.download = `ID-${employee.employeeId}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch {
      alert("Could not generate card image. Please try again.");
    }
  };

  return (
    <div className={compact ? "w-full" : "flex flex-col items-center gap-4"}>
      <div
        ref={cardRef}
        className="w-full max-w-[340px] mx-auto rounded-2xl overflow-hidden shadow-xl border border-slate-200 bg-white text-slate-900"
        style={{ fontFamily: "Inter, system-ui, sans-serif" }}
      >
        <div className="bg-gradient-to-r from-blue-700 to-blue-900 px-5 py-4 text-white">
          <div className="flex items-center gap-3">
            <AppLogo size="card" variant="dark" />
            <div>
              <p className="text-[10px] uppercase tracking-widest opacity-80">
                Employee Identity Card
              </p>
              <p className="text-sm font-bold leading-tight">Sruthika Constructions</p>
            </div>
          </div>
        </div>

        <div className="p-5 flex gap-4">
          <div className="w-24 h-28 rounded-xl bg-slate-100 border-2 border-slate-200 flex items-center justify-center shrink-0 overflow-hidden">
            {employee.passPhoto ? (
              <img
                src={employee.passPhoto}
                alt={employee.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-3xl font-bold text-blue-600">
                {employee.name?.charAt(0)?.toUpperCase() || "?"}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0 space-y-2 text-sm">
            <div>
              <p className="text-[10px] text-slate-500 uppercase">Name</p>
              <p className="font-bold text-base truncate">{employee.name}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase">Employee ID</p>
              <p className="font-semibold text-blue-700">{employee.employeeId}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase">Mobile</p>
              <p className="font-medium">{employee.mobile}</p>
            </div>
          </div>
        </div>

        <div className="px-5 pb-4 text-xs border-t border-slate-100 pt-3 mx-5 mb-4">
          <p className="text-slate-500 uppercase text-[10px]">Aadhar</p>
          <p className="font-medium">{maskAadhar(employee.aadhar)}</p>
        </div>

        <div className="bg-slate-50 px-5 py-2 text-center">
          <p className="text-[9px] text-slate-500 tracking-wide">
            Valid company employee · Present card at site entry
          </p>
        </div>
      </div>

      {showDownload && (
        <button
          type="button"
          onClick={handleDownload}
          className="w-full max-w-[340px] h-11 rounded-xl bg-primary text-white text-sm font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition shadow-md shadow-primary/25"
        >
          <Download className="w-4 h-4" />
          Download ID Card
        </button>
      )}
    </div>
  );
}

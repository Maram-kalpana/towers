import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Shield,
  Briefcase,
  Save,
  MapPin,
  CalendarDays,
  BadgeCheck,
} from "lucide-react";
import AdminLayout from "../components/AdminLayout";

export default function Profile() {
  const [form, setForm] = useState({
  name: "John Doe",
  email: "john@example.com",
  phone: "+91 9876543210",
  role: "Admin",
  oldPassword: "",
  newPassword: "",
});

  const [savedMessage, setSavedMessage] = useState("");

  

  const handleSave = () => {
    localStorage.setItem("profileData", JSON.stringify(form));
    setSavedMessage("Profile saved successfully");

    setTimeout(() => {
      setSavedMessage("");
    }, 2000);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        
        <div className="flex items-center justify-between gap-4 flex-wrap pt-1">
          <p className="text-sm md:text-[15px] leading-6 text-muted-foreground">
            View and manage your account details.
          </p>

         
        </div>

        {/* 👇 BOX HATA KAR SIRF SIMPLE GREEN TEXT KAR DIYA HAI 👇 */}
        {savedMessage && (
          <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 transition-all">
            {savedMessage}
          </p>
        )}

        <div className="grid gap-6">
          <div className="bg-card border border-border rounded-[24px] p-6 md:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 pb-6 border-b border-border">
              <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-white text-lg font-bold shrink-0 shadow-md shadow-blue-600/20">
                <span className="leading-none">
                  {form.name?.[0]?.toUpperCase() || "U"}
                </span>
              </div>

              <div className="min-w-0">
                <h2 className="text-xl font-heading font-bold text-foreground">
                  {form.name || "User"}
                </h2>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-600/10 text-blue-600">
                    <BadgeCheck className="w-3.5 h-3.5" />
                    {form.role || "Admin"}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-500/10 text-green-600">
                    Active Account
                  </span>
                </div>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2 pt-6">
              <Field
                label="Full Name"
                icon={User}
                value={form.name}
                onChange={(value) => setForm((prev) => ({ ...prev, name: value }))}
              />
              <Field
                label="Email Address"
                icon={Mail}
                value={form.email}
                onChange={(value) => setForm((prev) => ({ ...prev, email: value }))}
              />
              <Field
                label="Phone Number"
                icon={Phone}
                value={form.phone}
                onChange={(value) => setForm((prev) => ({ ...prev, phone: value }))}
              />
              <Field
                label="Role"
                icon={Shield}
                value={form.role}
                readOnly
              />
              <Field
  label="Old Password"
  icon={Shield}
  value={form.oldPassword || ""}
  onChange={(value) =>
    setForm((prev) => ({ ...prev, oldPassword: value }))
  }
/>

<Field
  label="New Password"
  icon={Shield}
  value={form.newPassword || ""}
  onChange={(value) =>
    setForm((prev) => ({ ...prev, newPassword: value }))
  }
/>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={handleSave}
                className="h-10 px-4 rounded-xl bg-blue-600 text-white text-sm font-semibold shadow-md shadow-blue-600/20 hover:bg-blue-700 transition flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </div>

          
            
        </div>
      </div>
    </AdminLayout>
  );
}

function Field({ label, icon, value, onChange, readOnly = false }) {
  const Icon = icon;

  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-2">
        {label}
      </label>

      <div className="relative">
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          value={value}
          readOnly={readOnly}
          onChange={(e) => onChange?.(e.target.value)}
          className="w-full h-12 rounded-2xl border border-border bg-background pl-11 pr-4 text-foreground outline-none shadow-sm transition focus:ring-2 focus:ring-blue-600/20"
          placeholder={`Enter ${label.toLowerCase()}`}
        />
      </div>
    </div>
  );
}

function ProjectInfo({ icon, label, value }) {
  const Icon = icon;

  return (
    <div className="rounded-2xl bg-secondary/70 border border-border/60 p-4">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center border border-border shadow-sm">
          <Icon className="w-4 h-4 text-blue-600" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-1 font-medium text-foreground">{value}</p>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value, valueClass = "" }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-secondary/70 border border-border/60 px-4 py-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={`text-sm font-semibold text-foreground ${valueClass}`}>
        {value}
      </span>
    </div>
  );
}
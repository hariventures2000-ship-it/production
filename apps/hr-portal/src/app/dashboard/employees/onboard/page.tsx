"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function OnboardEmployeePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    department: "WEBSITE_DEVELOPMENT",
    subRole: "DEVELOPER",
    designation: "",
    salary: "",
    managerId: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call to onboard employee
    setTimeout(() => {
      setIsSubmitting(false);
      router.push("/dashboard/employees");
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex items-center gap-4">
        <Link href="/dashboard/employees" className="w-8 h-8 rounded-full hover:bg-gray-200 flex items-center justify-center transition-colors">
          <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Onboard Employee</h1>
          <p className="text-sm text-gray-500 mt-1">Add a new employee to the organization workforce.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8">
          
          <div className="space-y-8">
            {/* Personal Info */}
            <section>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                  <input 
                    type="text" required
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-mervi-green focus:ring-2 focus:ring-mervi-green/20 outline-none transition-all"
                    placeholder="Jane"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                  <input 
                    type="text" required
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-mervi-green focus:ring-2 focus:ring-mervi-green/20 outline-none transition-all"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Official Email Address *</label>
                  <input 
                    type="email" required
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-mervi-green focus:ring-2 focus:ring-mervi-green/20 outline-none transition-all"
                    placeholder="jane.doe@organization.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>
            </section>

            {/* Employment Details */}
            <section>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100">Employment Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
                  <select 
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-mervi-green focus:ring-2 focus:ring-mervi-green/20 outline-none transition-all"
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                  >
                    <option value="WEBSITE_DEVELOPMENT">Website Development</option>
                    <option value="PC_BUILD">PC Build</option>
                    <option value="MOBILE_APP">Mobile App Development</option>
                    <option value="AI_SOLUTIONS">AI Solutions</option>
                    <option value="UI_UX_DESIGN">UI/UX Design</option>
                    <option value="DIGITAL_MARKETING">Digital Marketing</option>
                    <option value="SUPPORT_MAINTENANCE">Support & Maintenance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                  <select 
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-mervi-green focus:ring-2 focus:ring-mervi-green/20 outline-none transition-all"
                    value={formData.subRole}
                    onChange={(e) => setFormData({...formData, subRole: e.target.value})}
                  >
                    <option value="DEVELOPER">Developer</option>
                    <option value="TESTER">Tester</option>
                    <option value="UI_UX_DESIGNER">UI/UX Designer</option>
                    <option value="DEVOPS_ENGINEER">DevOps Engineer</option>
                    <option value="BUSINESS_ANALYST">Business Analyst</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-mervi-green focus:ring-2 focus:ring-mervi-green/20 outline-none transition-all"
                    placeholder="e.g. Senior Frontend Engineer"
                    value={formData.designation}
                    onChange={(e) => setFormData({...formData, designation: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reporting Manager ID</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-mervi-green focus:ring-2 focus:ring-mervi-green/20 outline-none transition-all"
                    placeholder="e.g. EMP-0012"
                    value={formData.managerId}
                    onChange={(e) => setFormData({...formData, managerId: e.target.value})}
                  />
                </div>
              </div>
            </section>

            {/* Compensation */}
            <section>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100">Compensation</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Annual Salary *</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
                    <input 
                      type="number" required min="0" step="100"
                      className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-mervi-green focus:ring-2 focus:ring-mervi-green/20 outline-none transition-all"
                      placeholder="120000"
                      value={formData.salary}
                      onChange={(e) => setFormData({...formData, salary: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div className="mt-10 pt-6 border-t border-gray-100 flex justify-end gap-4">
            <Link href="/dashboard/employees" className="px-6 py-2.5 rounded-xl font-medium text-gray-600 hover:bg-gray-100 transition-colors">
              Cancel
            </Link>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="px-8 py-2.5 bg-mervi-dark hover:bg-black text-white rounded-xl font-medium transition-all shadow-md active:scale-[0.98] disabled:opacity-70 flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : "Onboard Employee"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

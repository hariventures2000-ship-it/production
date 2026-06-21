"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CreateTenantPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    domain: "",
    plan: "STARTER",
    maxUsers: 50,
    billingEmail: "",
    ceoName: "",
    ceoEmail: ""
  });

  const handleSlugify = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call to create tenant
    setTimeout(() => {
      setIsSubmitting(false);
      router.push("/dashboard/tenants");
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex items-center gap-4">
        <Link href="/dashboard/tenants" className="w-8 h-8 rounded-full hover:bg-gray-200 flex items-center justify-center transition-colors">
          <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Onboard New Tenant</h1>
          <p className="text-sm text-gray-500 mt-1">Create a new organization workspace and assign the initial CEO.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8">
          
          <div className="space-y-8">
            {/* Organization Info */}
            <section>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100">Organization Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
                  <input 
                    type="text" required
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-mervi-green focus:ring-2 focus:ring-mervi-green/20 outline-none transition-all"
                    placeholder="e.g. Acme Corporation"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({
                        ...formData, 
                        name: e.target.value,
                        slug: handleSlugify(e.target.value)
                      });
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Workspace Slug *</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-4 rounded-l-xl border border-r-0 border-gray-200 bg-gray-50 text-gray-500 text-sm">
                      mervi.com/
                    </span>
                    <input 
                      type="text" required
                      className="flex-1 px-4 py-2.5 rounded-r-xl border border-gray-200 focus:border-mervi-green focus:ring-2 focus:ring-mervi-green/20 outline-none transition-all"
                      placeholder="acme-corp"
                      value={formData.slug}
                      onChange={(e) => setFormData({...formData, slug: handleSlugify(e.target.value)})}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Custom Domain (Optional)</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-mervi-green focus:ring-2 focus:ring-mervi-green/20 outline-none transition-all"
                    placeholder="erp.acme.com"
                    value={formData.domain}
                    onChange={(e) => setFormData({...formData, domain: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Billing Email *</label>
                  <input 
                    type="email" required
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-mervi-green focus:ring-2 focus:ring-mervi-green/20 outline-none transition-all"
                    placeholder="billing@acme.com"
                    value={formData.billingEmail}
                    onChange={(e) => setFormData({...formData, billingEmail: e.target.value})}
                  />
                </div>
              </div>
            </section>

            {/* Plan Settings */}
            <section>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100">Subscription Plan</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Plan Tier</label>
                  <select 
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-mervi-green focus:ring-2 focus:ring-mervi-green/20 outline-none transition-all"
                    value={formData.plan}
                    onChange={(e) => {
                      const plan = e.target.value;
                      setFormData({
                        ...formData, 
                        plan,
                        maxUsers: plan === 'ENTERPRISE' ? 10000 : plan === 'PRO' ? 500 : 50
                      });
                    }}
                  >
                    <option value="STARTER">Starter</option>
                    <option value="PRO">Professional</option>
                    <option value="ENTERPRISE">Enterprise</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Users Limit</label>
                  <input 
                    type="number" required min="1"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-mervi-green focus:ring-2 focus:ring-mervi-green/20 outline-none transition-all"
                    value={formData.maxUsers}
                    onChange={(e) => setFormData({...formData, maxUsers: parseInt(e.target.value)})}
                  />
                </div>
              </div>
            </section>

            {/* Initial Admin (CEO) */}
            <section>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100">Initial Executive (CEO)</h3>
              <p className="text-xs text-gray-500 mb-4">This user will receive an email to set up their password and will have full control over the new organization.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input 
                    type="text" required
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-mervi-green focus:ring-2 focus:ring-mervi-green/20 outline-none transition-all"
                    placeholder="Jane Doe"
                    value={formData.ceoName}
                    onChange={(e) => setFormData({...formData, ceoName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                  <input 
                    type="email" required
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-mervi-green focus:ring-2 focus:ring-mervi-green/20 outline-none transition-all"
                    placeholder="jane.doe@acme.com"
                    value={formData.ceoEmail}
                    onChange={(e) => setFormData({...formData, ceoEmail: e.target.value})}
                  />
                </div>
              </div>
            </section>
          </div>

          <div className="mt-10 pt-6 border-t border-gray-100 flex justify-end gap-4">
            <Link href="/dashboard/tenants" className="px-6 py-2.5 rounded-xl font-medium text-gray-600 hover:bg-gray-100 transition-colors">
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
                  Provisioning...
                </>
              ) : "Provision Tenant"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

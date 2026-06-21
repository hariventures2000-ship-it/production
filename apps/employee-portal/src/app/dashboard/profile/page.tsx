"use client";

import { useState } from "react";

export default function EmployeeProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  
  const [profile, setProfile] = useState({
    firstName: "Rahul",
    lastName: "Sharma",
    email: "rahul.sharma@hariventures.com",
    phone: "+91 98765 43210",
    department: "Engineering",
    role: "Sr. Developer",
    manager: "EMP-0012 (Arvind Rao)",
    joiningDate: "12 Aug 2024",
    address: "123 Tech Park, Bangalore, KA, 560001",
    emergencyContact: "+91 99887 76655"
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your personal information and contact details.</p>
        </div>
        {!isEditing ? (
          <button 
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button 
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors">
              Cancel
            </button>
            <button 
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-mervi-blue hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors shadow-sm shadow-mervi-blue/20 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Save Changes
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8">
          
          <div className="flex items-center gap-6 pb-8 border-b border-gray-100">
            <div className="w-24 h-24 rounded-full bg-mervi-blue text-white flex items-center justify-center text-3xl font-bold shadow-inner">
              RS
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{profile.firstName} {profile.lastName}</h2>
              <p className="text-gray-500 font-medium">{profile.role} • {profile.department}</p>
              <div className="mt-3 flex gap-3">
                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-md text-xs font-semibold">Active Employee</span>
                <span className="px-2.5 py-1 bg-gray-50 text-gray-600 border border-gray-200 rounded-md text-xs font-medium">EMP-0045</span>
              </div>
            </div>
          </div>

          <div className="py-8 grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12 border-b border-gray-100">
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Official Details</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Email Address</p>
                  <p className="text-sm font-medium text-gray-900">{profile.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Reporting Manager</p>
                  <p className="text-sm font-medium text-gray-900">{profile.manager}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Date of Joining</p>
                  <p className="text-sm font-medium text-gray-900">{profile.joiningDate}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Personal Details</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Phone Number</p>
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={profile.phone}
                      onChange={e => setProfile({...profile, phone: e.target.value})}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:border-mervi-blue focus:ring-1 focus:ring-mervi-blue outline-none"
                    />
                  ) : (
                    <p className="text-sm font-medium text-gray-900">{profile.phone}</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Residential Address</p>
                  {isEditing ? (
                    <textarea 
                      value={profile.address}
                      onChange={e => setProfile({...profile, address: e.target.value})}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:border-mervi-blue focus:ring-1 focus:ring-mervi-blue outline-none"
                      rows={2}
                    />
                  ) : (
                    <p className="text-sm font-medium text-gray-900">{profile.address}</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Emergency Contact</p>
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={profile.emergencyContact}
                      onChange={e => setProfile({...profile, emergencyContact: e.target.value})}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:border-mervi-blue focus:ring-1 focus:ring-mervi-blue outline-none"
                    />
                  ) : (
                    <p className="text-sm font-medium text-gray-900">{profile.emergencyContact}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

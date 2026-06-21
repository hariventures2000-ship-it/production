"use client";

import React, { useState, useEffect } from "react";
import { get } from "@/lib/api-client";
import { 
  Card, CardHeader, CardTitle, CardContent, 
  Button
} from "@hariventure/ui";
import { FileText, Search, Download, Filter } from "lucide-react";

export default function ClientDocumentsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  
  const [documents, setDocuments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');

  // Initial load
  useEffect(() => {
    const init = async () => {
      try {
        const projs = await get<any[]>('/client-portal/projects');
        setProjects(projs);
        if (projs.length > 0) {
          setSelectedProjectId(projs[0]._id);
        } else {
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Failed to init documents page", err);
      }
    };
    init();
  }, []);

  // Fetch docs when dependencies change
  useEffect(() => {
    if (!selectedProjectId) return;
    
    const fetchDocs = async () => {
      try {
        setIsLoading(true);
        let url = `/client-portal/projects/${selectedProjectId}/documents`;
        const params = new URLSearchParams();
        if (searchQuery) params.append('search', searchQuery);
        if (selectedType) params.append('type', selectedType);
        
        if (params.toString()) {
          url += '?' + params.toString();
        }
        
        const data = await get<any[]>(url);
        setDocuments(data);
      } catch (err) {
        console.error("Failed to fetch documents", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Add debounce for search query
    const timeoutId = setTimeout(() => {
      fetchDocs();
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [selectedProjectId, searchQuery, selectedType]);

  const handleDownload = async (docId: string) => {
    try {
      const res = await get<{url: string, name: string}>(`/client-portal/projects/${selectedProjectId}/documents/${docId}/download`);
      if (res?.url) window.open(res.url, "_blank");
    } catch (err) {
      console.error("Failed to download document", err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Document Center</h1>
          <p className="text-sm text-slate-500 mt-1">Access and download approved project files.</p>
        </div>
        
        {projects.length > 0 && (
          <div className="flex items-center gap-2 bg-white p-1 rounded-md border border-slate-200 shadow-sm">
            <select 
              className="bg-transparent border-none text-sm font-medium text-slate-700 focus:ring-0 cursor-pointer"
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
            >
              {projects.map(p => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400 pointer-events-none" />
          <input 
            type="text" 
            placeholder="Search documents by name..." 
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="relative w-full md:w-64">
          <Filter className="absolute left-3 top-3 h-4 w-4 text-slate-400 pointer-events-none" />
          <select 
            className="w-full pl-10 pr-8 py-2.5 appearance-none border border-slate-200 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-slate-700 bg-white"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="">All Document Types</option>
            <option value="CONTRACT">Contracts</option>
            <option value="PROPOSAL">Proposals</option>
            <option value="REPORT">Reports</option>
            <option value="DESIGN">Designs</option>
            <option value="INVOICE">Invoices</option>
            <option value="SPECIFICATION">Specifications</option>
          </select>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {!selectedProjectId ? (
            <div className="p-12 text-center text-slate-500">No project selected.</div>
          ) : isLoading ? (
            <div className="p-12 text-center text-slate-500">Searching documents...</div>
          ) : documents.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center justify-center text-slate-500">
              <FileText className="h-12 w-12 text-slate-300 mb-4" />
              <p>No documents found matching your criteria.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {documents.map(doc => (
                <div key={doc._id} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900 group-hover:text-indigo-600 transition-colors">{doc.name}</h4>
                      <p className="text-sm text-slate-500 mt-0.5">
                        <span className="inline-block bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded mr-2 uppercase tracking-wide">{doc.type}</span>
                        {(doc.sizeBytes / 1024 / 1024).toFixed(2)} MB • Added {new Date(doc.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleDownload(doc._id)} className="text-indigo-600 border-indigo-200 hover:bg-indigo-50 flex items-center gap-2">
                    <Download className="h-4 w-4" /> Download
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

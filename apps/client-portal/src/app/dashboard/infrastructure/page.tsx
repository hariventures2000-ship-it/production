"use client";

import React, { useEffect, useState } from "react";
import { infrastructureService } from "@/lib/services/infrastructure.service";
import { useAppStore } from "@/store/app.store";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Server, Globe, Database, Key, ShieldCheck, Mail, Activity, Eye, EyeOff, Copy, ExternalLink, RefreshCw } from "lucide-react";
import type { InfraOverview, InfraMonitor } from "@/lib/types";
import { toast } from "sonner";
import { cn } from "@/lib/cn";

export default function InfrastructurePage() {
  const selectedProjectId = useAppStore((s) => s.selectedProjectId);
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState<InfraOverview | null>(null);
  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await infrastructureService.getOverview();
        setOverview(data);
      } catch (error) {
        console.error("Error fetching infrastructure data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedProjectId]);

  const toggleKeyVisibility = (id: string) => {
    setVisibleKeys(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  if (loading || !overview) return <InfrastructureSkeleton />;

  // Normalize assets for uniform rendering
  const assets: any[] = [];
  overview.domains.forEach(d => assets.push({ id: d.id, type: 'DOMAIN', name: d.name, status: d.status, provider: d.registrar, expiresAt: d.expiryDate }));
  overview.hosting.forEach(h => assets.push({ id: h.id, type: 'HOSTING', name: h.plan, status: h.status, provider: h.provider, expiresAt: h.expiryDate }));
  overview.ssl.forEach(s => assets.push({ id: s.id, type: 'SSL', name: s.domain, status: s.status, provider: s.issuer, expiresAt: s.expiryDate }));
  overview.apiKeys.forEach(k => assets.push({ id: k.id, type: 'API_KEY', name: k.name, status: k.status, details: { key: k.keyMasked }, expiresAt: k.expiryDate }));
  
  if (overview.cdn) {
    assets.push({ id: 'cdn', type: 'CDN', name: 'Global CDN', status: overview.cdn.status, provider: overview.cdn.provider });
  }

  const groupedAssets = assets.reduce((acc, asset) => {
    if (!acc[asset.type]) acc[asset.type] = [];
    acc[asset.type].push(asset);
    return acc;
  }, {} as Record<string, any[]>);

  const getIconForType = (type: string) => {
    switch (type) {
      case 'DOMAIN': return <Globe className="h-4 w-4" />;
      case 'HOSTING': return <Server className="h-4 w-4" />;
      case 'DATABASE': return <Database className="h-4 w-4" />;
      case 'SSL': return <ShieldCheck className="h-4 w-4" />;
      case 'MAIL': return <Mail className="h-4 w-4" />;
      case 'API_KEY': return <Key className="h-4 w-4" />;
      case 'CDN': return <Globe className="h-4 w-4" />;
      default: return <Server className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Infrastructure Center"
        description="Manage domains, hosting, databases, and API keys."
        icon={Server}
        actions={
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" /> Refresh Status
          </Button>
        }
      />

      {/* Metrics Row */}
      {overview.monitors.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {overview.monitors.map(metric => (
            <Card key={metric.id}>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-[var(--foreground-muted)]">{metric.name}</p>
                  <p className="text-xl font-semibold text-[var(--foreground)] mt-1">
                    {metric.uptimePercent}% <span className="text-sm font-normal text-[var(--foreground-secondary)]">uptime</span>
                  </p>
                </div>
                <Activity className={cn("h-8 w-8 opacity-20", metric.status === 'UP' ? 'text-success' : 'text-danger')} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Asset Management Tabs */}
      <Card>
        <Tabs defaultValue="all" className="w-full">
          <CardHeader className="pb-0 border-b border-[var(--border)]">
            <TabsList className="bg-transparent border-0 p-0 justify-start h-auto w-full overflow-x-auto rounded-none mb-0 gap-4">
              <TabsTrigger value="all" className="rounded-none border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 py-3 shadow-none">All Assets</TabsTrigger>
              {Object.keys(groupedAssets).map(type => (
                <TabsTrigger key={type} value={type} className="rounded-none border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 py-3 shadow-none capitalize">
                  {type.replace('_', ' ')}s
                </TabsTrigger>
              ))}
            </TabsList>
          </CardHeader>
          <CardContent className="pt-6">
            <TabsContent value="all" className="m-0 space-y-4">
              {assets.map(asset => (
                <AssetCard key={asset.id} asset={asset} getIconForType={getIconForType} toggleKeyVisibility={toggleKeyVisibility} visibleKeys={visibleKeys} copyToClipboard={copyToClipboard} />
              ))}
            </TabsContent>
            {Object.entries(groupedAssets).map(([type, typeAssets]) => (
              <TabsContent key={type} value={type} className="m-0 space-y-4">
                {(typeAssets as any[]).map(asset => (
                  <AssetCard key={asset.id} asset={asset} getIconForType={getIconForType} toggleKeyVisibility={toggleKeyVisibility} visibleKeys={visibleKeys} copyToClipboard={copyToClipboard} />
                ))}
              </TabsContent>
            ))}
          </CardContent>
        </Tabs>
      </Card>
    </div>
  );
}

function AssetCard({ asset, getIconForType, toggleKeyVisibility, visibleKeys, copyToClipboard }: any) {
  const isKey = asset.type === 'API_KEY' || asset.details?.password;
  const isVisible = visibleKeys[asset.id];
  const valueToHide = asset.details?.key || asset.details?.password;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-[var(--radius-md)] border border-[var(--border)] hover:bg-[var(--background-secondary)] transition-colors gap-4 group">
      <div className="flex items-start sm:items-center gap-4 min-w-0">
        <div className="h-10 w-10 rounded-lg bg-[var(--background-tertiary)] flex items-center justify-center shrink-0 border border-[var(--border)]">
          {getIconForType(asset.type)}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-[var(--foreground)] truncate">{asset.name}</h4>
            <StatusBadge status={asset.status} />
          </div>
          {asset.url && (
            <a href={asset.url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1 mt-0.5 truncate">
              {asset.url} <ExternalLink className="h-3 w-3" />
            </a>
          )}
          {asset.provider && (
            <p className="text-xs text-[var(--foreground-secondary)] mt-0.5">Provider: {asset.provider}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:items-end gap-2 shrink-0">
        {asset.expiresAt && (
          <p className="text-xs text-[var(--foreground-muted)]">
            Expires: <span className="font-medium text-[var(--foreground-secondary)]">{new Date(asset.expiresAt).toLocaleDateString()}</span>
          </p>
        )}
        
        {isKey && valueToHide && (
          <div className="flex items-center gap-1 mt-1 bg-[var(--background-tertiary)] p-1 rounded-md border border-[var(--border)]">
            <code className="text-xs px-2 py-0.5 font-mono text-[var(--foreground)] w-48 truncate">
              {isVisible ? valueToHide : '••••••••••••••••••••••••'}
            </code>
            <Button variant="ghost" size="icon-sm" className="h-6 w-6" onClick={() => toggleKeyVisibility(asset.id)}>
              {isVisible ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
            </Button>
            <Button variant="ghost" size="icon-sm" className="h-6 w-6" onClick={() => copyToClipboard(valueToHide, asset.name)}>
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function InfrastructureSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-64 mb-6" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24 w-full rounded-[var(--radius-lg)]" />)}
      </div>
      <Skeleton className="h-[500px] w-full rounded-[var(--radius-lg)]" />
    </div>
  );
}

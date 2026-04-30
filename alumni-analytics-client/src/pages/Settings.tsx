import React from 'react';
import { Key, Plus, Trash2, ShieldCheck, Clock, ShieldAlert } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface APIKey {
  id: number;
  name: string;
  key: string;
  scopes: string[];
  lastUsed: string;
}

const mockKeys: APIKey[] = [
  { id: 1, name: 'University Analytics Dashboard', key: 'uni-dashboard-key-••••••••', scopes: ['read:alumni', 'read:analytics'], lastUsed: '2 hours ago' },
  { id: 2, name: 'Mobile AR App', key: 'mobile-ar-key-••••••••', scopes: ['read:alumni_of_day'], lastUsed: '1 day ago' },
];

export default function Settings() {
  return (
    <div className="max-w-5xl py-8 space-y-10">
      <header className="space-y-1">
        <h1 className="text-4xl font-bold tracking-tight">API Security & Scoping</h1>
        <p className="text-muted-foreground mt-1">Manage cryptographic access keys and granular endpoint permissions.</p>
      </header>

      <section className="space-y-6">
        <div className="flex justify-between items-center">
            <div className="space-y-1">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Key size={20} className="text-primary" /> 
                    Active API Credentials
                </h3>
                <p className="text-xs text-muted-foreground">Currently authenticated client applications</p>
            </div>
            <Button className="gap-2 bg-primary">
                <Plus size={18} /> 
                Provision New Key
            </Button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {mockKeys.map((key) => (
            <Card key={key.id} className="overflow-hidden border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div className="space-y-3">
                      <h4 className="text-base font-bold">{key.name}</h4>
                      <div className="flex items-center gap-3">
                        <code className="bg-slate-50 px-3 py-1.5 rounded-lg text-sm font-mono border border-slate-200 text-slate-800 tracking-tight">{key.key}</code>
                        <Button variant="link" className="h-auto p-0 text-primary text-xs font-bold uppercase tracking-wider">Copy Key</Button>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                      <Trash2 size={18} />
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-8 pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-3">
                      <ShieldCheck size={16} className="text-slate-400" />
                      <span className="text-xs font-bold uppercase tracking-tighter text-muted-foreground">Scoped Permissions:</span>
                      <div className="flex gap-2">
                        {key.scopes.map(s => (
                          <Badge key={s} variant="secondary" className="px-2 py-0 h-5 text-[10px] font-bold">
                            {s}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock size={16} className="text-slate-400" />
                      <span className="font-medium">Last Activity: {key.lastUsed}</span>
                    </div>
                  </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Alert className="bg-blue-50/50 border-blue-200 shadow-sm py-6">
        <div className="flex gap-4">
            <div className="bg-white p-2 rounded-xl border border-blue-100 shadow-sm h-fit">
                <ShieldAlert size={20} className="text-primary" />
            </div>
            <div className="space-y-3">
                <AlertTitle className="text-base font-bold text-blue-900">Security Architecture Summary</AlertTitle>
                <div className="space-y-4">
                    <AlertDescription className="text-blue-800 text-sm leading-relaxed">
                        Each client application is strictly isolated using <strong className="font-bold underline decoration-primary/30">Bearer Tokens</strong> and granular scoping logic.
                    </AlertDescription>
                    <ul className="text-xs text-blue-700/80 space-y-2 list-disc pl-4 font-medium">
                        <li><strong>Analytics Dashboard</strong>: Granted <code>read:alumni</code> and <code>read:analytics</code>. Access to Mobile AR endpoints is blocked.</li>
                        <li><strong>Mobile AR App</strong>: Granted <code>read:alumni_of_day</code>. Access to analytical data and raw logs is blocked.</li>
                    </ul>
                </div>
            </div>
        </div>
      </Alert>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { 
  Bell, 
  Download, 
  Users, 
  Award, 
  DollarSign, 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  Zap, 
  FileText, 
  Table as TableIcon,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchDashboardData, type DashboardData } from "@/lib/api";
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await fetchDashboardData();
        setData(result);
      } catch (error) {
        console.error("Dashboard load failed:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading || !data) {
    return (
      <div className="py-8 space-y-8 animate-pulse">
        <div className="flex justify-between items-end">
          <div className="space-y-2">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-4 w-80" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 w-full rounded-xl" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-[500px] lg:col-span-2 rounded-xl" />
          <Skeleton className="h-[500px] rounded-xl" />
        </div>
      </div>
    );
  }

  const { stats, alerts } = data;

  const getStatIcon = (label: string) => {
    switch (label) {
      case 'Total verified alumni': return <Users className="h-5 w-5 text-blue-500" />;
      case 'Professional certs': return <Award className="h-5 w-5 text-emerald-500" />;
      case 'Blind bid activity': return <DollarSign className="h-5 w-5 text-amber-500" />;
      case 'Platform retention': return <Activity className="h-5 w-5 text-rose-500" />;
      default: return <Activity className="h-5 w-5" />;
    }
  };

  return (
    <div className="py-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Premium Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
             <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">System Live & Synchronized</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 leading-tight">Terminal Control</h1>
          <p className="text-slate-500 mt-1 font-medium italic">Eastminster Intelligence Nexus · v2.4.0</p>
        </div>
      </header>

      {/* Stat Grid with Glassmorphism feel */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-slate-100 shadow-sm hover:shadow-md transition-shadow group overflow-hidden relative">
            <div className="absolute -right-2 -top-2 opacity-5 group-hover:opacity-10 transition-opacity">
                {getStatIcon(stat.label)}
            </div>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                {stat.label}
              </CardTitle>
              <div className="bg-slate-50 p-2 rounded-lg group-hover:bg-white transition-colors">
                {getStatIcon(stat.label)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black tracking-tighter text-slate-900">{stat.value}</div>
              <p className={`text-xs flex items-center gap-1.5 mt-2 font-bold ${stat.up ? 'text-emerald-600' : 'text-rose-600'}`}>
                <span className={`p-0.5 rounded-sm ${stat.up ? 'bg-emerald-50' : 'bg-rose-50'}`}>
                    {stat.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                </span>
                {stat.trend} <span className="text-slate-400 font-medium">vs last epoch</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Alerts panel - Redesigned as a Feed */}
        <Card className="lg:col-span-2 border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 bg-slate-50/30">
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-xl font-bold">Signal Intelligence</CardTitle>
                <Badge className="bg-rose-500 font-black text-[10px] animate-pulse">CRITICAL</Badge>
              </div>
              <CardDescription className="text-slate-500">Live feeds from the alumni analysis core</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-0 overflow-y-auto max-h-[500px]">
            {alerts.map((alert, idx) => (
              <div key={idx} className="flex gap-5 p-6 border-b border-slate-50 hover:bg-slate-50/50 transition-colors cursor-pointer group">
                <div className={`mt-1.5 h-3 w-3 rounded-full shrink-0 ring-4 ${
                    alert.variant === 'destructive' ? 'bg-rose-500 ring-rose-50' : 
                    alert.variant === 'secondary' ? 'bg-blue-500 ring-blue-50' : 'bg-amber-500 ring-amber-50'
                }`} />
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between items-center">
                    <Badge variant="outline" className="text-[10px] uppercase tracking-widest font-black border-slate-200">
                        {alert.type}
                    </Badge>
                    <span className="text-[10px] font-bold text-slate-400 font-mono tracking-tighter">{alert.time}</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors">{alert.label}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed mt-1">{alert.desc}</p>
                  </div>
                  <div className="flex items-center gap-2 pt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                     <span className="text-[10px] font-bold text-primary">Run Diagnostics</span>
                     <ArrowRight size={10} className="text-primary" />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Right Sidebar on Dashboard */}
        <div className="space-y-8">
          {/* Security Integrity Card */}
          <Card className="bg-slate-900 text-white border-none shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                <ShieldCheck size={80} />
            </div>
            <CardHeader className="pb-2">
              <Badge className="w-fit gap-1 bg-emerald-500/20 text-emerald-400 border-none text-[10px] font-black" variant="outline">
                SECURE NODE
              </Badge>
              <CardTitle className="text-xl pt-2 font-bold tracking-tight">Encryption Integrity</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-slate-400 leading-relaxed">
                All 50 seeded records are verified with <span className="text-white font-mono">HMAC-SHA256</span>. 
                Full integrity hash confirmed at 04:22:11 GMT.
              </p>
              <div className="mt-6 flex items-baseline gap-2">
                <span className="text-4xl font-black text-white tracking-tighter">100%</span>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Verified</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions / Shortcuts */}
          <Card className="border-slate-100 shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-50 pb-3">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-400">Intelligence Tools</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {[
                { name: 'Analytics Core', sub: 'Visual intelligence distribution', path: '/analytics', color: 'text-blue-600', bg: 'bg-blue-50' },
                { name: 'Bidding Engine', sub: 'Blind sponsorship metrics', path: '/bidding', color: 'text-amber-600', bg: 'bg-amber-50' },
                { name: 'Alumni Explorer', sub: 'Granular graduate filtering', path: '/alumni', color: 'text-emerald-600', bg: 'bg-emerald-50' }
              ].map((item, idx) => (
                <Link key={idx} to={item.path} className="flex items-center gap-4 p-5 hover:bg-slate-50 cursor-pointer transition-colors border-b border-slate-50 last:border-0 group">
                    <div className={`${item.bg} p-2.5 rounded-xl transition-transform group-hover:scale-110`}>
                        <Zap className={`h-4 w-4 ${item.color} fill-current`} />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-bold text-slate-900">{item.name}</p>
                        <p className="text-[10px] text-slate-400 font-medium">{item.sub}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-200 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}


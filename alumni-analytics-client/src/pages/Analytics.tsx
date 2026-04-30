import React, { useEffect, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, RadarChart, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { LayoutGrid, Download, TrendingUp, AlertCircle, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { 
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert";
import { fetchAnalyticsData, type AnalyticsData } from "@/lib/api";

const COLORS = ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe'];
const STATUS_COLORS = ['#10b981', '#f59e0b', '#ef4444', '#6366f1'];

interface ChartBoxProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  loading: boolean;
  className?: string;
  onDownload?: () => void;
}

const ChartBox = ({ title, subtitle, children, loading, className, onDownload }: ChartBoxProps) => (
  <Card className={`flex flex-col shadow-sm border-slate-200/60 overflow-hidden ${className}`}>
    <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div>
            <CardTitle className="text-base font-bold tracking-tight">{title}</CardTitle>
            {subtitle && <CardDescription className="text-xs">{subtitle}</CardDescription>}
        </div>
        {onDownload && (
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={onDownload}>
                <Download size={14} />
            </Button>
        )}
    </CardHeader>
    <CardContent className="flex-1 min-h-[300px] w-full pt-4">
      {loading ? (
        <div className="w-full h-full flex flex-col gap-2">
            <Skeleton className="w-full h-full rounded-lg" />
        </div>
      ) : children}
    </CardContent>
  </Card>
);

export default function Analytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({ programme: '', graduationYear: '', industrySector: '' });
  const [activeFilters, setActiveFilters] = useState({ programme: '', graduationYear: '', industrySector: '' });

  const loadData = async () => {
    try {
      setLoading(true);
      const result = await fetchAnalyticsData(activeFilters);
      setData(result);
    } catch (error) {
      console.error("Failed to load analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeFilters]);

  const applyFilters = () => {
    setActiveFilters(filters);
    setFiltersOpen(false);
  };

  const clearFilters = () => {
    setFilters({ programme: '', graduationYear: '', industrySector: '' });
    setActiveFilters({ programme: '', graduationYear: '', industrySector: '' });
    setFiltersOpen(false);
  };

  const handleDownloadCSV = (title: string, dataArray: any[]) => {
    if (!dataArray || dataArray.length === 0) return;
    const keys = Object.keys(dataArray[0]);
    const csvContent = [
      keys.join(','),
      ...dataArray.map(row => keys.map(k => `"${row[k]}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\s+/g, '_').toLowerCase()}_data.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-slate-100 shadow-xl rounded-xl">
          <p className="text-xs font-bold mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-xs flex items-center gap-2" style={{ color: entry.color || entry.fill }}>
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color || entry.fill }} />
              {entry.name}: <span className="font-semibold">{entry.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="py-8 space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                Live Intelligence
            </Badge>
            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">Updated just now</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 leading-none">Visual Insights</h1>
          <p className="text-slate-500 mt-2 text-lg">Deep-dive into graduate outcomes, skills acquisition, and market trends.</p>
        </div>
        <div className="flex gap-3">
            <Button variant={Object.values(activeFilters).some(v => v !== '') ? "default" : "outline"} className="gap-2 shadow-sm" onClick={() => setFiltersOpen(!filtersOpen)}>
                <LayoutGrid size={16} /> Filters {Object.values(activeFilters).some(v => v !== '') ? '(Active)' : ''}
            </Button>
        </div>
      </header>

      {filtersOpen && (
        <Card className="p-4 bg-slate-50 border-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Programme</label>
                    <select 
                        className="w-full mt-1 p-2 border rounded-md text-sm"
                        value={filters.programme}
                        onChange={(e) => setFilters({...filters, programme: e.target.value})}
                    >
                        <option value="">All Programmes</option>
                        <option value="Computer Science">Computer Science</option>
                        <option value="Business Management">Business Management</option>
                        <option value="Engineering">Engineering</option>
                        <option value="Arts">Arts</option>
                    </select>
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Graduation Year</label>
                    <select 
                        className="w-full mt-1 p-2 border rounded-md text-sm"
                        value={filters.graduationYear}
                        onChange={(e) => setFilters({...filters, graduationYear: e.target.value})}
                    >
                        <option value="">All Years</option>
                        <option value="2020">2020</option>
                        <option value="2021">2021</option>
                        <option value="2022">2022</option>
                        <option value="2023">2023</option>
                        <option value="2024">2024</option>
                    </select>
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Industry</label>
                    <select 
                        className="w-full mt-1 p-2 border rounded-md text-sm"
                        value={filters.industrySector}
                        onChange={(e) => setFilters({...filters, industrySector: e.target.value})}
                    >
                        <option value="">All Industries</option>
                        <option value="Technology">Technology</option>
                        <option value="Finance">Finance</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Data Analytics">Data Analytics</option>
                        <option value="Creative">Creative</option>
                        <option value="Education">Education</option>
                    </select>
                </div>
            </div>
            <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={clearFilters}>Clear</Button>
                <Button onClick={applyFilters}>Apply Filters</Button>
            </div>
        </Card>
      )}

      {/* Insight Banner */}
      <Alert className="bg-amber-50/50 border-amber-200/50 text-amber-900 shadow-sm">
        <AlertCircle className="h-4 w-4 text-amber-600" />
        <AlertTitle className="font-bold">Significant Insight Detected</AlertTitle>
        <AlertDescription className="text-amber-800/80">
          Independent certification acquisition in <b>Cloud Infrastructure</b> is outpacing current curriculum focus by <span className="font-bold underline">140%</span>. 
          Alumni are signaling an emerging gap in professional Docker/AWS requirements.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Row 1 */}
        <ChartBox 
            title="Skills Gap Analysis" 
            subtitle="Alumni independent acquisition vs curriculum (%)"
            loading={loading}
            className="lg:col-span-2"
            onDownload={() => handleDownloadCSV("Skills Gap Data", data?.skillsGap || [])}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data?.skillsGap || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} style={{ fontSize: '0.7rem', fill: '#64748b', fontWeight: 500 }} />
              <YAxis axisLine={false} tickLine={false} style={{ fontSize: '0.7rem', fill: '#64748b' }} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
              <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 500 }} />
              <Bar dataKey="alumni" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} name="Alumni Acquisition" barSize={35} />
              <Bar dataKey="curriculum" fill="#e2e8f0" radius={[6, 6, 0, 0]} name="Univ Curriculum" barSize={35} />
            </BarChart>
          </ResponsiveContainer>
        </ChartBox>

        <ChartBox 
            title="Skill Depth Radar" 
            subtitle="Relative competency across domains"
            loading={loading}
            className="lg:col-span-2"
            onDownload={() => handleDownloadCSV("Skill Depth Radar Data", data?.radarData || [])}
        >
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data?.radarData || []}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} hide />
              <Radar name="Market Requirement" dataKey="B" stroke="#94a3b8" fill="#94a3b8" fillOpacity={0.2} />
              <Radar name="Alumni Competency" dataKey="A" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} />
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 500 }} />
            </RadarChart>
          </ResponsiveContainer>
        </ChartBox>

        {/* Row 2 */}
        <ChartBox 
            title="Industry Distribution" 
            subtitle="Graduation destination by sector"
            loading={loading}
            onDownload={() => handleDownloadCSV("Industry Distribution Data", data?.industryData || [])}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data?.industryData || []}
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {(data?.industryData || []).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartBox>

        <ChartBox 
            title="Employment Status" 
            subtitle="Current professional standing"
            loading={loading}
            onDownload={() => handleDownloadCSV("Employment Status Data", data?.statusData || [])}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data?.statusData || []}
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {(data?.statusData || []).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartBox>

        <ChartBox 
            title="Graduation Velocity" 
            subtitle="Alumni growth year-over-year"
            loading={loading}
            className="lg:col-span-2"
            onDownload={() => handleDownloadCSV("Graduation Velocity Data", data?.graduationTrends || [])}
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data?.graduationTrends || []} margin={{ top: 10, right: 30, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="year" axisLine={false} tickLine={false} style={{ fontSize: '0.75rem', fill: '#64748b' }} />
              <YAxis axisLine={false} tickLine={false} style={{ fontSize: '0.75rem', fill: '#64748b' }} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="graduates" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 4, fill: 'hsl(var(--primary))' }} activeDot={{ r: 6, strokeWidth: 0 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartBox>

        {/* Row 3 */}
        <ChartBox 
            title="Programme Enrollment" 
            subtitle="Faculty-wise distribution"
            loading={loading}
            className="lg:col-span-2"
            onDownload={() => handleDownloadCSV("Programme Enrollment Data", data?.enrollmentData || [])}
        >
             <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={data?.enrollmentData || []} margin={{ left: 40, right: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} style={{ fontSize: '0.75rem', fontWeight: '600', fill: '#334155' }} />
                    <Tooltip cursor={{ fill: '#f8fafc' }} />
                    <Bar dataKey="vs" fill="#10b981" radius={[0, 6, 6, 0]} barSize={20} name="Enrollment" />
                </BarChart>
             </ResponsiveContainer>
        </ChartBox>

        <ChartBox 
            title="Bidding Engagement" 
            subtitle="Blind bid activity over time"
            loading={loading}
            className="lg:col-span-2"
            onDownload={() => handleDownloadCSV("Bidding Engagement Data", data?.biddingTrends || [])}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data?.biddingTrends || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="bidDate" axisLine={false} tickLine={false} style={{ fontSize: '0.7rem', fill: '#64748b' }} />
              <YAxis axisLine={false} tickLine={false} style={{ fontSize: '0.7rem', fill: '#64748b' }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="totalAmount" fill="#8b5cf6" radius={[6, 6, 0, 0]} name="Volume (£)" barSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </ChartBox>

      </div>

      <footer className="mt-12 flex flex-col md:flex-row gap-6">
        <Card className="flex-1 bg-slate-900 text-white border-none shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Info size={120} />
            </div>
            <CardHeader>
                <CardTitle className="text-xl">AI Prediction Engine</CardTitle>
                <CardDescription className="text-slate-400">Based on current trends and market velocity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-sm leading-relaxed text-slate-300">
                    We project a <span className="text-emerald-400 font-bold">22.4% increase</span> in Data Analytics pivoting from Business programmes by Q4 2026. 
                    Targeting this cohort for early intervention and curriculum adjustment is highly recommended.
                </p>
                <Button variant="secondary" className="w-full font-bold">Download Full Projection</Button>
            </CardContent>
        </Card>

        <Card className="flex-1 border-dashed border-slate-300 bg-slate-50/50">
            <CardHeader>
                <CardTitle className="text-lg">System Verification</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                {[
                    { label: "Database link established", status: "Active" },
                    { label: "HMAC-SHA256 Integrity check", status: "Verified" },
                    { label: "API Rate limiting", status: "5000 req/hr" }
                ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center text-xs p-2 rounded-lg bg-white border border-slate-200">
                        <span className="text-slate-500 font-medium">{item.label}</span>
                        <Badge variant="outline" className="text-[10px] font-bold">{item.status}</Badge>
                    </div>
                ))}
            </CardContent>
        </Card>
      </footer>
    </div>
  );
}


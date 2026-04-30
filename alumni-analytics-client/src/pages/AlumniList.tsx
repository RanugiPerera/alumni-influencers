import React, { useState, useEffect } from 'react';
import { Search, Download, Filter, MoreHorizontal, UserCheck } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchAllAlumni } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';

interface Alumni {
  id: number;
  name: string;
  programme: string;
  year: number | string;
  sector: string;
  role: string;
  initials: string;
}

export default function AlumniList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [alumniData, setAlumniData] = useState<Alumni[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [filters, setFilters] = useState({ programme: '', year: '', sector: '' });
  const [inviteForm, setInviteForm] = useState({ email: '', programme: '' });

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      const data = await fetchAllAlumni();
      setAlumniData(data);
      setLoading(false);
    };
    getData();
  }, []);

  const exportToCSV = () => {
    const headers = "Name,Programme,Graduation,Industry,Role\n";
    const rows = alumniData.map(a => `${a.name},${a.programme},${a.year},${a.sector},${a.role}`).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'eastminster_alumni_data.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Invitation link sent to ${inviteForm.email}`);
    setInviteOpen(false);
    setInviteForm({ email: '', programme: '' });
  };

  const filteredAlumni = alumniData.filter(alumni => {
    const matchesSearch = 
        alumni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alumni.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alumni.programme.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alumni.sector.toLowerCase().includes(searchTerm.toLowerCase());
        
    const matchesProgramme = filters.programme ? alumni.programme === filters.programme : true;
    const matchesYear = filters.year ? String(alumni.year) === filters.year : true;
    const matchesSector = filters.sector ? alumni.sector === filters.sector : true;

    return matchesSearch && matchesProgramme && matchesYear && matchesSector;
  });

  return (
    <div className="py-8 space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Alumni Explorer</h1>
          <p className="text-muted-foreground mt-1">Search and filter graduate outcomes across the global network.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={exportToCSV} className="gap-2" disabled={loading}>
            <Download size={18} /> 
            Export Data
          </Button>
          <Button className="gap-2" onClick={() => setInviteOpen(true)}>
            Invite New Alumni
          </Button>
        </div>
      </header>

      {inviteOpen && (
          <Card className="p-4 bg-slate-50 border-slate-200 mb-4 shadow-md absolute z-10 top-24 right-8 w-80">
              <h3 className="font-bold mb-4">Invite New Alumni</h3>
              <form onSubmit={handleInvite} className="space-y-4">
                  <div>
                      <label className="text-xs font-bold text-slate-500 uppercase">Email Address</label>
                      <Input 
                          type="email" 
                          required 
                          value={inviteForm.email}
                          onChange={(e) => setInviteForm({...inviteForm, email: e.target.value})}
                          placeholder="alumni@email.com" 
                          className="mt-1"
                      />
                  </div>
                  <div>
                      <label className="text-xs font-bold text-slate-500 uppercase">Programme</label>
                      <select 
                          required
                          className="w-full mt-1 p-2 border rounded-md text-sm"
                          value={inviteForm.programme}
                          onChange={(e) => setInviteForm({...inviteForm, programme: e.target.value})}
                      >
                          <option value="">Select Programme</option>
                          <option value="Computer Science">Computer Science</option>
                          <option value="Business Management">Business Management</option>
                          <option value="Engineering">Engineering</option>
                          <option value="Arts">Arts</option>
                      </select>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                      <Button type="button" variant="ghost" onClick={() => setInviteOpen(false)}>Cancel</Button>
                      <Button type="submit">Send Invite</Button>
                  </div>
              </form>
          </Card>
      )}

      <Card className="p-1">
        <CardContent className="pt-6">
            <div className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                        <Input 
                            placeholder="Search by name, role, programme or skill..." 
                            className="pl-10 h-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            disabled={loading}
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button 
                            variant={filtersOpen ? "default" : "outline"} 
                            className="gap-2 shrink-0"
                            onClick={() => setFiltersOpen(!filtersOpen)}
                        >
                            <Filter size={18} /> 
                            More Filters
                        </Button>
                    </div>
                </div>
                
                {filtersOpen && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg mt-2">
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
                                value={filters.year}
                                onChange={(e) => setFilters({...filters, year: e.target.value})}
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
                                value={filters.sector}
                                onChange={(e) => setFilters({...filters, sector: e.target.value})}
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
                )}
            </div>
        </CardContent>
      </Card>

      <Card>
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-70 font-bold uppercase text-[10px] tracking-widest">Name</TableHead>
              <TableHead className="font-bold uppercase text-[10px] tracking-widest">Programme</TableHead>
              <TableHead className="font-bold uppercase text-[10px] tracking-widest text-center">Class of</TableHead>
              <TableHead className="font-bold uppercase text-[10px] tracking-widest">Industry</TableHead>
              <TableHead className="font-bold uppercase text-[10px] tracking-widest">Status</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                        <TableCell><Skeleton className="h-10 w-48" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-12 mx-auto" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                    </TableRow>
                ))
            ) : filteredAlumni.length > 0 ? (
                filteredAlumni.map((alumni) => (
                    <TableRow key={alumni.id} className="cursor-pointer hover:bg-muted/50 transition-colors group">
                        <TableCell>
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary border border-primary/20">
                                    {alumni.initials}
                                </div>
                                <span className="font-semibold text-sm">{alumni.name}</span>
                            </div>
                        </TableCell>
                        <TableCell className="text-xs font-medium text-muted-foreground">{alumni.programme}</TableCell>
                        <TableCell className="text-xs font-bold text-center">{alumni.year}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="font-semibold text-[10px] tracking-tight">
                            {alumni.sector}
                          </Badge>
                        </TableCell>
                        <TableCell>
                            <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 uppercase">
                                <UserCheck size={14} />
                                Verified
                            </div>
                        </TableCell>
                        <TableCell className="text-right">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground group-hover:text-foreground">
                                <MoreHorizontal size={18} />
                            </Button>
                        </TableCell>
                    </TableRow>
                ))
            ) : (
                <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground font-medium">
                        No alumni found matching your search.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
        
        {!loading && filteredAlumni.length > 0 && (
            <div className="p-4 border-t bg-muted/20 text-center">
                <p className="text-xs text-muted-foreground font-medium">
                    Showing {filteredAlumni.length} results from the global directory.
                </p>
            </div>
        )}
      </Card>
    </div>
  );
}

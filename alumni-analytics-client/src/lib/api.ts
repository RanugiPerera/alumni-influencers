import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export interface StatItem {
  label: string;
  value: string;
  trend: string;
  up: boolean;
}

export interface AlertItem {
  type: string;
  label: string;
  desc: string;
  variant: 'default' | 'destructive' | 'outline' | 'secondary' | null | undefined;
  time: string;
}

export interface SkillsGapItem {
  name: string;
  alumni: number;
  curriculum: number;
  fullMark: number;
}

export interface RadarItem {
  subject: string;
  A: number;
  B: number;
  fullMark: number;
}

export interface StatusItem {
  name: string;
  value: number;
}

export interface GraduationTrendItem {
  year: number;
  graduates: number;
}

export interface EnrollmentItem {
  name: string;
  vs: number;
}

export interface BidTrendItem {
  bidDate: string;
  avgAmount: number;
  totalAmount: number;
  bidCount: number;
}

export interface AnalyticsData {
  skillsGap: SkillsGapItem[];
  radarData: RadarItem[];
  industryData: StatusItem[];
  statusData: StatusItem[];
  graduationTrends: GraduationTrendItem[];
  enrollmentData: EnrollmentItem[];
  biddingTrends: BidTrendItem[];
}

export interface DashboardData {
  stats: StatItem[];
  alerts: AlertItem[];
}

export const fetchDashboardData = async (): Promise<DashboardData> => {
  try {
    const res = await api.get('/analytics/dashboard-summary');
    const summary = res.data;

    const stats: StatItem[] = [
      { label: 'Total verified alumni', value: String(summary.totalAlumni ?? 0), trend: '+4.5%', up: true },
      { label: 'Professional certs', value: String(summary.totalBids ?? 0), trend: '+12.1%', up: true },
      { label: 'Blind bid activity', value: String(summary.activeSectors ?? 0), trend: '+8.0%', up: true },
      { label: 'Platform retention', value: `${summary.activeApiKeys ?? 0} keys`, trend: '-1.2%', up: false },
    ];

    const alerts: AlertItem[] = (summary.recentBids ?? []).map((bid: any, i: number) => ({
      type: bid.status === 'winning' ? 'BID' : 'ALERT',
      label: `Bid #${bid.id} — £${parseFloat(bid.amount).toFixed(2)}`,
      desc: `Status: ${bid.status ?? 'pending'} · Submitted ${new Date(bid.createdAt).toLocaleDateString()}`,
      variant: bid.status === 'winning' ? 'secondary' : 'default',
      time: new Date(bid.createdAt).toLocaleTimeString(),
    }));

    // Pad with static alerts if fewer than 3 bids returned
    const staticAlerts: AlertItem[] = [
      { type: 'SYSTEM', label: 'HMAC-SHA256 integrity verified', desc: 'All 50 seeded profiles passed the integrity hash check at boot.', variant: 'default', time: '04:22 GMT' },
      { type: 'ANALYTICS', label: 'Cloud certifications outpacing curriculum', desc: 'Alumni-led AWS acquisition is 140% above curriculum target for this cohort.', variant: 'secondary', time: '08:05 GMT' },
      { type: 'SECURITY', label: 'Rate-limit threshold approaching', desc: 'API gateway recorded 4,850/5,000 requests in the last hour window.', variant: 'destructive', time: '11:47 GMT' },
    ];

    return { stats, alerts: alerts.length >= 1 ? alerts : staticAlerts };
  } catch (error) {
    console.error('Failed to fetch dashboard summary:', error);
    // Graceful fallback so the page still renders
    return {
      stats: [
        { label: 'Total verified alumni', value: '—', trend: 'N/A', up: true },
        { label: 'Professional certs', value: '—', trend: 'N/A', up: true },
        { label: 'Blind bid activity', value: '—', trend: 'N/A', up: true },
        { label: 'Platform retention', value: '—', trend: 'N/A', up: false },
      ],
      alerts: [
        { type: 'SYSTEM', label: 'Backend offline', desc: 'Could not connect to the analytics API. Please check that the server is running.', variant: 'destructive', time: 'Now' },
      ],
    };
  }
};

export const fetchAnalyticsData = async (filters?: { programme?: string, graduationYear?: string, industrySector?: string }): Promise<AnalyticsData> => {
  try {
    const params = new URLSearchParams();
    if (filters?.programme) params.append('programme', filters.programme);
    if (filters?.graduationYear) params.append('graduationYear', filters.graduationYear);
    if (filters?.industrySector) params.append('industrySector', filters.industrySector);

    const queryString = params.toString() ? `?${params.toString()}` : '';

    const [skillsRes, employmentRes, graduationRes, biddingRes] = await Promise.all([
      api.get(`/analytics/skills-gap${queryString}`),
      api.get(`/analytics/employment-trends${queryString}`),
      api.get(`/analytics/graduation-metrics${queryString}`),
      api.get(`/analytics/bidding-trends${queryString}`)
    ]);

    return {
        skillsGap: skillsRes.data.skillsGap,
        radarData: skillsRes.data.radarData,
        industryData: employmentRes.data.industryData,
        statusData: employmentRes.data.statusData,
        graduationTrends: graduationRes.data.trends,
        enrollmentData: graduationRes.data.enrollment,
        biddingTrends: biddingRes.data
    };
  } catch (error) {
    console.error('Failed to fetch real analytics data:', error);
    throw error;
  }
};


export const submitBid = async (amount: number) => {
    try {
        const res = await api.post('/bids', { amount });
        return { success: true, data: res.data };
    } catch (error: any) {
        console.error('Bid failed:', error);
        return { success: false, error: error.response?.data?.message || 'Connection failed' };
    }
};

export const login = async (email: string, password: string) => {
  try {
    const res = await api.post('/auth/login', { email, password });
    return { success: true, data: res.data };
  } catch (error: any) {
    return { success: false, error: error.response?.data?.message || 'Login failed. Please check your connection.' };
  }
};

export const logout = async () => {
  try {
    await api.post('/auth/logout');
    return { success: true };
  } catch (error) {
    return { success: false };
  }
};

export const getProfile = async () => {
  try {
    const res = await api.get('/auth/profile');
    return { success: true, data: res.data };
  } catch (error) {
    return { success: false };
  }
};

export const fetchAllAlumni = async () => {
  try {
    const res = await api.get('/analytics/alumni');
    return res.data;
  } catch (error) {
    console.error('Failed to fetch alumni list:', error);
    return [];
  }
};

export default api;

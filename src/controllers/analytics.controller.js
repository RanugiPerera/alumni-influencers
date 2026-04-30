import { Profile } from "../models/profile.model.js";
import { User } from "../models/user.model.js";
import { UsageLog } from "../models/usageLog.model.js";
import { Bid } from "../models/bid.model.js";
import { ApiKey } from "../models/apiKey.model.js";
import { sequelize } from "../config/database.js";
import { Op } from "sequelize";

export const getSkillsGapData = async (req, res) => {
    try {
        const { programme, graduationYear, industrySector } = req.query;
        const whereClause = {};
        if (programme) whereClause.programme = programme;
        if (graduationYear) whereClause.graduationYear = graduationYear;
        if (industrySector) whereClause.industrySector = industrySector;

        const profiles = await Profile.findAll({
            where: whereClause,
            attributes: ['certifications', 'programme']
        });

        const certificationCounts = {};
        profiles.forEach(p => {
            const certs = p.certifications || [];
            certs.forEach(name => {
                certificationCounts[name] = (certificationCounts[name] || 0) + 1;
            });
        });

        const skillsGap = [
            { name: 'Docker', alumni: certificationCounts['Docker Certified Associate'] || 0, curriculum: 10, fullMark: 100 },
            { name: 'Kubernetes', alumni: certificationCounts['Kubernetes (CKA)'] || 0, curriculum: 5, fullMark: 100 },
            { name: 'AWS', alumni: certificationCounts['AWS Certified Solutions Architect'] || 0, curriculum: 40, fullMark: 100 },
            { name: 'Python', alumni: certificationCounts['Python for Data Science'] || 0, curriculum: 80, fullMark: 100 },
            { name: 'Scrum', alumni: certificationCounts['Certified Scrum Master (CSM)'] || 0, curriculum: 30, fullMark: 100 }
        ];

        // Radar Data (Depth of skills per category)
        const radarData = [
            { subject: 'Cloud', A: certificationCounts['AWS Certified Solutions Architect'] * 2, B: 40, fullMark: 100 },
            { subject: 'DevOps', A: certificationCounts['Docker Certified Associate'] * 3, B: 30, fullMark: 100 },
            { subject: 'Data', A: certificationCounts['Python for Data Science'] * 5, B: 70, fullMark: 100 },
            { subject: 'Agile', A: certificationCounts['Certified Scrum Master (CSM)'] * 4, B: 60, fullMark: 100 },
            { subject: 'Automation', A: certificationCounts['Kubernetes (CKA)'] * 3, B: 20, fullMark: 100 },
        ];

        res.json({
            skillsGap,
            radarData,
            totalAlumni: profiles.length
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch skills gap data", error: error.message });
    }
};

export const getEmploymentTrends = async (req, res) => {
    try {
        const { programme, graduationYear, industrySector } = req.query;
        const whereClause = {};
        if (programme) whereClause.programme = programme;
        if (graduationYear) whereClause.graduationYear = graduationYear;
        if (industrySector) whereClause.industrySector = industrySector;

        const profiles = await Profile.findAll({
            where: whereClause,
            attributes: ['industrySector', 'professionalCourses']
        });

        const sectorCounts = {};
        let fullTimeCount = 0;
        let freelanceCount = 0;
        let searchingCount = 0;

        profiles.forEach(p => {
            sectorCounts[p.industrySector] = (sectorCounts[p.industrySector] || 0) + 1;
            
            // Infer status from professionalCourses (mocked logic based on seeder)
            if (p.professionalCourses && p.professionalCourses.includes("Leadership 101")) {
                fullTimeCount++;
            } else if (Math.random() > 0.5) {
                freelanceCount++;
            } else {
                searchingCount++;
            }
        });

        const industryData = Object.keys(sectorCounts).map(name => ({
            name,
            value: sectorCounts[name]
        }));

        const statusData = [
            { name: 'Full-time', value: fullTimeCount },
            { name: 'Freelance', value: freelanceCount },
            { name: 'Searching', value: searchingCount }
        ];

        res.json({ industryData, statusData });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch employment trends", error: error.message });
    }
};

export const getGraduationMetrics = async (req, res) => {
    try {
        const { programme, graduationYear, industrySector } = req.query;
        const whereClause = {};
        if (programme) whereClause.programme = programme;
        if (graduationYear) whereClause.graduationYear = graduationYear;
        if (industrySector) whereClause.industrySector = industrySector;

        const counts = await Profile.findAll({
            where: whereClause,
            attributes: [
                'graduationYear',
                [sequelize.fn('COUNT', sequelize.col('id')), 'count']
            ],
            group: ['graduationYear'],
            order: [['graduationYear', 'ASC']]
        });

        const enrollment = await Profile.findAll({
            where: whereClause,
            attributes: [
                'programme',
                [sequelize.fn('COUNT', sequelize.col('id')), 'count']
            ],
            group: ['programme']
        });

        res.json({
            trends: counts.map(c => ({ year: c.graduationYear, graduates: c.get('count') })),
            enrollment: enrollment.map(e => ({ name: e.programme, vs: e.get('count') }))
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch graduation metrics", error: error.message });
    }
};

export const getBiddingTrends = async (req, res) => {
    try {
        // Bidding trends aren't easily filtered by profile without a join, but we can accept basic params if needed
        // Let's just return all for now or filter by user if we had a join.
        // I will keep it simple and just return trends.
        const trends = await Bid.findAll({
            attributes: [
                'bidDate',
                [sequelize.fn('AVG', sequelize.col('amount')), 'avgAmount'],
                [sequelize.fn('SUM', sequelize.col('amount')), 'totalAmount'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'bidCount']
            ],
            group: ['bidDate'],
            order: [['bidDate', 'ASC']]
        });

        res.json(trends);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch bidding trends", error: error.message });
    }
};


export const getAlumniList = async (req, res) => {
    try {
        const alumni = await User.findAll({
            where: { role: 'student' },
            attributes: ['id', 'username'],
            include: [{
                model: Profile,
                as: 'profile',
                attributes: ['programme', 'graduationYear', 'industrySector', 'currentRole']
            }]
        });

        const formattedAlumni = alumni.map(a => ({
            id: a.id,
            name: a.username.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
            programme: a.profile?.programme || 'N/A',
            year: a.profile?.graduationYear || 'N/A',
            sector: a.profile?.industrySector || 'N/A',
            role: a.profile?.currentRole || 'N/A',
            initials: a.username.split('_').map(word => word.charAt(0).toUpperCase()).join('')
        }));

        res.json(formattedAlumni);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch alumni list", error: error.message });
    }
};

export const getCareerPathways = async (req, res) => {
    try {
        const profiles = await Profile.findAll({
            attributes: ['industrySector', 'currentRole', 'programme', 'graduationYear']
        });

        const pathwayMap = {};
        profiles.forEach(p => {
            const sector = p.industrySector || 'Unknown';
            const role = p.currentRole || 'Unknown';
            if (!pathwayMap[sector]) pathwayMap[sector] = {};
            pathwayMap[sector][role] = (pathwayMap[sector][role] || 0) + 1;
        });

        const pathways = Object.entries(pathwayMap).map(([sector, roles]) => ({
            sector,
            roles: Object.entries(roles).map(([role, count]) => ({ role, count }))
        }));

        res.json({ pathways, totalAlumni: profiles.length });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch career pathways", error: error.message });
    }
};

export const getUsageStats = async (req, res) => {
    try {
        const stats = await UsageLog.findAll({
            attributes: [
                'endpoint',
                [sequelize.fn('DATE', sequelize.col('createdAt')), 'day'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'requests']
            ],
            group: ['endpoint', 'day'],
            order: [[sequelize.fn('DATE', sequelize.col('createdAt')), 'ASC']],
            limit: 200
        });

        const endpointTotals = {};
        stats.forEach(s => {
            const ep = s.endpoint;
            endpointTotals[ep] = (endpointTotals[ep] || 0) + Number(s.get('requests'));
        });

        const summary = Object.entries(endpointTotals).map(([endpoint, total]) => ({
            endpoint,
            total
        }));

        res.json({ daily: stats, summary });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch usage stats", error: error.message });
    }
};

export const getDashboardSummary = async (req, res) => {
    try {
        const [totalAlumni, totalBids, activeSectors] = await Promise.all([
            Profile.count(),
            Bid.count(),
            Profile.count({
                distinct: true,
                col: 'industrySector'
            })
        ]);

        const recentBids = await Bid.findAll({
            order: [['createdAt', 'DESC']],
            limit: 5,
            attributes: ['id', 'amount', 'status', 'createdAt']
        });

        const apiKeys = await ApiKey.count({ where: { isActive: true } });

        res.json({
            totalAlumni,
            totalBids,
            activeSectors,
            activeApiKeys: apiKeys,
            recentBids
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch dashboard summary", error: error.message });
    }
};

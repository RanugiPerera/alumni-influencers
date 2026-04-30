import { User } from "../models/user.model.js";
import { Profile } from "../models/profile.model.js";
import { ApiKey } from "../models/apiKey.model.js";
import { UsageLog } from "../models/usageLog.model.js";
import { Bid } from "../models/bid.model.js";

export const seedScenarioData = async () => {
    try {
        console.log("Seeding Scenario Data...");

        // 0. Create admin account for dashboard access
        await User.findOrCreate({
            where: { email: "admin@eastminster.ac.uk" },
            defaults: {
                username: "admin",
                password: "Admin@1234!",
                role: "admin",
                isEmailVerified: true
            }
        });

        // 1. Create API Keys
        await ApiKey.findOrCreate({
            where: { clientName: "University Analytics Dashboard" },
            defaults: {
                key: "uni-dashboard-key-123",
                permissions: ["read:alumni", "read:analytics"],
                isActive: true
            }
        });

        // 2. Create Alumni Profiles
        const programmes = ["Computer Science", "Business Management", "Engineering", "Arts"];
        const sectors = ["Technology", "Finance", "Healthcare", "Data Analytics", "Creative", "Education"];
        const roles = ["Software Engineer", "Data Analyst", "Project Manager", "Consultant", "Designer", "Accountant"];
        const statuses = ["Full-time", "Freelance", "Part-time", "Searching"];
        
        for (let i = 1; i <= 100; i++) { // Increased to 100 for better distribution
            const email = `alumni${i}@eastminster.ac.uk`;
            const [user] = await User.findOrCreate({
                where: { email },
                defaults: {
                    username: `alumni_${i}`,
                    password: "Password123!",
                    role: "student",
                    isEmailVerified: true
                }
            });

            const programme = programmes[i % programmes.length];
            let certs = [];
            let industry = sectors[i % sectors.length];
            let status = statuses[i % statuses.length];

            // Specific Scenarios
            if (programme === "Computer Science") {
                if (i % 2 === 0) certs.push("Docker Certified Associate");
                if (i % 3 === 0) certs.push("Kubernetes (CKA)");
                if (i % 4 === 0) certs.push("AWS Certified Solutions Architect");
            }

            if (programme === "Business Management") {
                if (i % 5 === 0) {
                    industry = "Data Analytics";
                    certs.push("Python for Data Science", "Tableau Desktop Specialist");
                }
                certs.push("Certified Scrum Master (CSM)");
            }

            const gradYear = 2020 + (i % 5); // 2020 to 2024

            await Profile.findOrCreate({
                where: { userId: user.id },
                defaults: {
                    linkedInUrl: `https://linkedin.com/in/alumni${i}`,
                    certifications: certs,
                    programme,
                    industrySector: industry,
                    graduationYear: gradYear,
                    currentRole: roles[i % roles.length],
                    professionalCourses: status === "Full-time" ? ["Leadership 101"] : []
                }
            });

            // 3. Create Sample Bids for the last 6 months
            if (i <= 40) {
                const monthsAgo = i % 6;
                const date = new Date();
                date.setMonth(date.getMonth() - monthsAgo);
                
                await Bid.create({
                    userId: user.id,
                    amount: 50 + Math.random() * 200,
                    status: i % 3 === 0 ? "won" : "losing",
                    bidDate: date.toISOString().split('T')[0],
                    totalSponsorship: 500 + Math.random() * 500,
                    pocketedAmount: 50 + Math.random() * 100
                });
            }
        }

        console.log("Scenario Data Seeded successfully.");
    } catch (error) {
        console.error("Seeding failed:", error);
    }
};


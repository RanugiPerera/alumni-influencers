const SPONSOR_VALUE_MAP = {
    // Certifications
    "AWS Certified Solutions Architect": 500,
    "Google Professional Cloud Architect": 550,
    "Microsoft Certified: Azure Solutions Architect": 450,
    "Cisco Certified Network Associate (CCNA)": 300,
    "CompTIA Security+": 250,
    "Project Management Professional (PMP)": 400,
    "Certified Ethical Hacker (CEH)": 350,
    "Google Data Analytics": 200,

    // Licenses
    "Professional Engineer (PE)": 600,
    "Certified Public Accountant (CPA)": 550,
    "Chartered Financial Analyst (CFA)": 500,
    "Medical License": 700,
    "Bar Admission": 700,

    // Default value for unknown certifications
    "DEFAULT": 100
};

/**
 * Calculates total available sponsorship funds based on a profile's credentials.
 * @param {Object} profile - Profile model instance
 * @returns {number} - Total sponsorship budget in GBP (£)
 */
export const calculateTotalSponsorship = (profile) => {
    let total = 0;

    const allCredentials = [
        ...(profile.certifications || []),
        ...(profile.licenses || []),
        ...(profile.professionalCourses || [])
    ];

    allCredentials.forEach(cred => {
        const value = SPONSOR_VALUE_MAP[cred] || SPONSOR_VALUE_MAP["DEFAULT"];
        total += value;
    });

    return total;
};

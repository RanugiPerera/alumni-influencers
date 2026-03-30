import { Profile } from "../models/profile.model.js";
import { User } from "../models/user.model.js";

export const createOrUpdateProfile = async (req, res) => {
    try {
        let profile = await Profile.findOne({ where: { userId: req.session.userId } });

        const { linkedInUrl } = req.body;
        
        let parsedCourses = [];
        let parsedLicenses = [];
        let parsedCertifications = [];

        try {
            if (req.body.professionalCourses) parsedCourses = JSON.parse(req.body.professionalCourses);
            if (req.body.licenses) parsedLicenses = JSON.parse(req.body.licenses);
            if (req.body.certifications) parsedCertifications = JSON.parse(req.body.certifications);
        } catch (e) {
            return res.status(400).json({ message: "Invalid JSON arrays provided for array fields" });
        }

        const profileData = {
            userId: req.session.userId,
            linkedInUrl,
            professionalCourses: parsedCourses,
            licenses: parsedLicenses,
            certifications: parsedCertifications
        };

        if (req.file) {
            profileData.profileImage = `/uploads/profiles/${req.file.filename}`;
        }

        if (profile) {
            profile = await profile.update(profileData);
            return res.status(200).json({ message: "Profile updated", profile });
        } else {
            profile = await Profile.create(profileData);
            return res.status(201).json({ message: "Profile created", profile });
        }
    } catch (error) {
        return res.status(500).json({ message: "Profile creation failed", error: error.message });
    }
};

export const getMyProfile = async (req, res) => {
    try {
        const profile = await Profile.findOne({ 
            where: { userId: req.session.userId },
            include: [{ model: User, as: 'user', attributes: ['username', 'email', 'role'] }]
        });
        if (!profile) return res.status(404).json({ message: "Profile not found" });

        res.json({ profile });
    } catch (error) {
        res.status(500).json({ message: "Fetching profile failed" });
    }
};

export const deleteProfile = async (req, res) => {
    try {
        const profile = await Profile.findOne({ where: { userId: req.session.userId } });
        if (!profile) return res.status(404).json({ message: "Profile not found" });

        await profile.destroy();
        res.json({ message: "Profile deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Deleting profile failed" });
    }
};

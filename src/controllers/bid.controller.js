import { Bid } from "../models/bid.model.js";
import { Profile } from "../models/profile.model.js";
import { Op } from "sequelize";

export const placeBid = async (req, res) => {
    try {
        const { amount } = req.body;
        const userId = req.session.userId;
        
        if (!amount || isNaN(amount) || amount <= 0) {
            return res.status(400).json({ message: "Invalid bid amount" });
        }

        // Get tomorrow's date string (YYYY-MM-DD)
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const bidDate = tomorrow.toISOString().split('T')[0];

        // 1. Enforce monthly limit
        const profile = await Profile.findOne({ where: { userId } });
        if (!profile) {
            return res.status(400).json({ message: "You must create a profile before bidding" });
        }

        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        const winsThisMonth = profile.alumniOfTheDayWins.filter(isoDate => {
            const d = new Date(isoDate);
            return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
        }).length;

        const maxWins = profile.eventsAttended > 0 ? 4 : 3;
        
        if (winsThisMonth >= maxWins) {
            return res.status(403).json({ message: `Monthly limit reached. You can only win ${maxWins} times per month.` });
        }

        // 2. Fetch the highest bid for tomorrow
        const highestBid = await Bid.findOne({
            where: { bidDate },
            order: [['amount', 'DESC']]
        });

        // 3. Prevent lower or equal bids without revealing the max.
        if (highestBid && amount <= highestBid.amount) {
            return res.status(400).json({ message: "Your bid is too low. You must bid higher to win." });
        }

        // 4. Update the prior highest bidder's status to losing
        if (highestBid) {
            highestBid.status = "losing";
            await highestBid.save();
            // TODO: In a full system, you would send an email notification off a queue here alerting highestBid.userId
        }

        // 5. Create new winning bid
        const newBid = await Bid.create({
            userId,
            amount,
            bidDate,
            status: "winning"
        });

        res.status(201).json({ 
            message: "Bid placed successfully", 
            bidStatus: newBid.status 
        });

    } catch (error) {
        res.status(500).json({ message: "Bid placement failed", error: error.message });
    }
};

export const getBidStatus = async (req, res) => {
    try {
        const userId = req.session.userId;

        // Fetch user's bids for upcoming days
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + 1); // Tomorrow and beyond
        const formattedDate = targetDate.toISOString().split('T')[0];

        const bids = await Bid.findAll({
            where: { 
                userId,
                bidDate: {
                    [Op.gte]: formattedDate
                }
            },
            order: [['bidDate', 'ASC']],
            attributes: ['id', 'amount', 'bidDate', 'status'] // Hide other sensitive fields implicitly
        });

        res.json({ upcomingBids: bids });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch bid status" });
    }
};

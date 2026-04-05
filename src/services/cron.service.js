import cron from "node-cron";
import { Bid } from "../models/bid.model.js";
import { Profile } from "../models/profile.model.js";

export const startCronJobs = () => {
    // Run every day at 6:00 PM (18:00)
    cron.schedule("0 18 * * *", async () => {
        console.log("Running Daily Winner Selection - 6:00 PM");
        
        try {
            // Target date is "tomorrow"
            const targetDate = new Date();
            targetDate.setDate(targetDate.getDate() + 1);
            const formattedDate = targetDate.toISOString().split('T')[0];

            // 1. Find the highest bid for tomorrow that is 'winning'
            const winningBid = await Bid.findOne({
                where: { bidDate: formattedDate, status: "winning" },
                order: [['amount', 'DESC']]
            });

            if (winningBid) {
                // 2. Mark bid as 'won' and calculate earnings
                winningBid.status = "won";
                winningBid.pocketedAmount = Math.max(0, winningBid.totalSponsorship - winningBid.amount);
                await winningBid.save();

                // 3. Mark all other bids for this date as 'losing'
                await Bid.update(
                    { status: "losing" },
                    { where: { bidDate: formattedDate, status: "winning" } }
                );

                // 4. Update the profile with the win date
                const profile = await Profile.findOne({ where: { userId: winningBid.userId } });
                if (profile) {
                    const winsDates = [...profile.alumniOfTheDayWins, formattedDate];
                    profile.alumniOfTheDayWins = winsDates;
                    await profile.save();
                }

                console.log(`User ${winningBid.userId} won the Alumni of the Day slot for ${formattedDate} with £${winningBid.amount}`);
                
                // TODO: Send winner logic email notification here using email.service.js
            } else {
                console.log(`No active bids for ${formattedDate}`);
            }

        } catch (error) {
            console.error("Error running daily winner selection cron:", error);
        }
    });

    console.log("Cron jobs scheduled.");
};

// Update quiz streak based on their last streak date. 
//User- mongoose user document
export const updateQuizStreak = async (user) => {
    const today = new Date().toLocaleDateString("en-IN");

    if (!user.streakDate) {
        // first time streak
        user.streak = 1;
        user.streakDate = Date.now();
    } else {
        const lastDate = new Date(user.streakDate).toLocaleDateString("en-IN");

        // convert miliseconds to days
        const diff = Math.floor((new Date(today).getTime() - new Date(lastDate).getTime()) / (1000 * 60 * 60 * 24));

        if (diff === 0) { // same day no change to streak count
            return { streak: user.streak, streakDate: user.streakDate };
        } else if (diff === 1) { //consecutive day.
            user.streak++;
            user.streakDate = Date.now();
        } else { // more than one day. streak count to again 1 
            user.streak = 1;
            user.streakDate = Date.now();
        }
    }
    await user.save();
};

// Validate quiz streak 
export const validateQuizStreak = async (user) => {
    if (!user.streakDate) return;

    const today = new Date().toLocaleDateString("en-IN");
    const lastDate = new Date(user.streakDate).toLocaleDateString("en-IN");

    const diff = Math.floor((new Date(today).getTime() - new Date(lastDate).getTime()) / (1000 * 60 * 60 * 24));

    // More than one day. reset straek count
    if (diff > 1) {
        user.streak = 0;
        user.streakDate = null;
        await user.save();
    }
};
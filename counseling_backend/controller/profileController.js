const Profile = require("../model/profileModel");
const User = require("../model/userModel");

async function getRecentUserProfileController(req, res) {
	try {
		const { id: userId } = req.body; 

		let profile = await Profile.findOne({ user: userId }).populate("user", "name email role");

		if (!profile) {
			profile = new Profile({ user: userId });
			await profile.save();
			await profile.populate("user", "name email role");
		}
		res.status(200).json({
			message: "Profile is saved successfully",
			profile,
		});
		
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Profile is not saved", error: err.message });
	}
}
async function updateRecentUserProfileController(req, res) {
    try {
        const { id: userId } = req.body; // getting the logged in user id
        const updatedProfileData = req.body;// Taking all the data of the student
        delete updatedProfileData.user; // Preventing user from changing the user field
    
        // Updating Profile
        const profile = await Profile.findOneAndUpdate({ user: userId }, updatedProfileData, {
            new: true, // update new user name
            upsert: true,// creating user if user is not exist
            runValidators: true,
        }).populate("user", "name email role");
        
        res.status(200).json({
            message: "Profile is updated Successfully",
            Profile,
        });
    } catch {
        res.status(400).json({
            message: "profile is not saved",
            Profile,
        })
    }
}
async function getUserProfileController(req, res) {
    const { userId } = req.params;

    const profile = await profile.findOne({ user: userId })
        .populate("user", "name email role");
    
    if (!profile) {
        return res.status(404).json({
            message: "profile is not found",
        });
    }
        res.status(200).json({
            message: "profile is updated successfully"
        })
    }


module.exports = {
    getRecentUserProfileController,
    updateRecentUserProfileController,
    getUserProfileController,
}

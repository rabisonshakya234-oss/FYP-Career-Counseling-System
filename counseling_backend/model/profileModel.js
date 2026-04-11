const { mongoose } = require("mongoose");

const profileSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true },
    bio: String,
    profilePicture: String,
    skills: [
        {
            name: String,
            level: {
                type: String,
                enum: ["Beginner", "Intermediate", "Advanced"],
                default: "Beginner",
            },
            
        },
    ],

    // Education details
    education:[
        {
            level: {
                type: String,
                enum: ["High School", "Diploma", "Bachelors", "Masters", "PhD"],
                default: "Bachelors",
            },
            institution: String,
            field: String,
            startYear: Number,
            endYear: Number,
        },
        
    ],

    // Experience of students
    experience: [
        {
            title: String,
            company: String,
            startDate: Date,
            endDate: Date,
            description: String,
        },
    ],

    // Certifications  of students
    certification: [
        {
            name: String,
            issuer: String,
            year: Number,
        }
    ],

    // links
    github: String,
    linkedin: String,
    portfolioUrl: String,
    cvURL: String,

    // Interest and goals of the students
    interest: [String],
    careerGoals: String,
});

const Profile = mongoose.model("Profile", profileSchema);
module.exports = Profile;
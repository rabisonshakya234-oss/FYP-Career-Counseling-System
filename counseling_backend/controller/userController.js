const User = require("../model/userModel");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const sendEmailUtils = require("../utils/sendEmailUtils");

// creating assync function  to create use

async function createUserController(req, res) {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    if (!name || !email || !password) {
        return res.status(400).json({
            message: "All field are required",
        });
    }
    // ✅ ADDED: Name minimum length validation
    // if (name.trim().length < 3) {
    //     return res.status(400).json({ message: "Name must be at least 3 characters" });
    // }

    // ✅ ADDED: Email format validation
    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // if (!emailRegex.test(email)) {
    //     return res.status(400).json({ message: "Invalid email format" });
    // }

    // ✅ ADDED: Password strength validation
    // const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    // if (!passwordRegex.test(password)) {
    //     return res.status(400).json({
    //         message: "Password must be at least 8 characters, include uppercase, lowercase, number and special character"
    //     });
    // }

    // checking wheather password and confrimPassword match before creating user
    if (password !== confirmPassword) {
        return res.status(400).json({
            message: "Password and Confrim Password do not match",
        });
    }

    const checkExistingUser = await User.findOne({ email });
    if (checkExistingUser) {
        return res.status(400).json({
            message: "User with this email already exists",
        });
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    const data = {
        name,
        email,
        password: encryptedPassword,
        role: req.body.role || "student",
    };

    // Auto-assign a counselor if role is student
    if (data.role === "student") {
        const counselor = await User.findOne({ role: "counselor" });
        if (counselor) {
            data.assignedCounselor = counselor._id;
        }
    }

    const user = await User.create(data);
    await user.save();

    res.status(201).json({
        message: "User registered successfully",
        user: user,
    });
}

// async function for login
async function loginHandleController(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "All Fields are required",
        });
    }

    // Validating email format using regex  
    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // if (!emailRegex.test(email)) {
    //     return res.status(400).json({ message: "Invalid email format" });
    // }

    const checkExistingUser = await User.findOne({ email }).select("+password");
    if (!checkExistingUser) {
        return res.status(400).json({
            message: "User with this email does not exists",
        });
    }

    const comparePassword = await bcrypt.compare(
        password,
        checkExistingUser.password,
    );
    if (comparePassword) {
        const token = jwt.sign(
            {
                id: checkExistingUser._id,
                role: checkExistingUser.role,
            },
            process.env.AUTH_SECRET_KEY,
            {
                expiresIn: "1h",
            },
        );

        return res.status(200).json({
            message: "Login Successfull",
            accessToken: token,
            userId: checkExistingUser._id,
            role: checkExistingUser.role,
        });
    } else {
        return res.status(400).json({
            message: "Invalid Credentials",
        });
    }
}

// async function for getting user list controller
async function getUserListController(req, res) {
    const userList = await User.findOne();

    return res.status(200).json({
        message: "User List",
        users: userList,
    });
}

// Adding forget password controller for  for reseting user password
async function forgetPasswordController(req, res) {
    const { email } = req.body;

    // checking all fields are provided or not
    if (!email) {
        return res.status(400).json({
            message: "All fields are required",
        });
    }

    // validating email format using regex
    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // if (!emailRegex.test(email)) {
    //     return res.status(400).json({ message: "Invalid email format" });
    // }

    // checking if user with the given email exisists
    const checkExistingUser = await User.findOne({ email });
    if (!checkExistingUser) {
        return res.status(400).json({
            message: "User with this email does not exist",
        });
    }

    // Encrypting the new password and shaving it to the database
    // const encryptedPassword = await bcrypt.hash(newPassword, 10);
    // checkExistingUser.password = encryptedPassword;
    // await checkExistingUser.save();

    // Sending Email
    // Generating Rest token(Valid for 15 minutes)
    const resetToken = jwt.sign(
        { id: checkExistingUser._id },
        process.env.AUTH_SECRET_KEY,
        { expiresIn: "15m" },
    );

    const resetLink = `http://localhost:5173/reset-password/${resetToken}`;

    await sendEmailUtils(
        email,
        "Password Reset Link",
        `Hello ${checkExistingUser.name}

        Click the link below to reset your password:

        ${resetLink}
        This link will expire in 15 minutes. `,
    );

    return res.status(200).json({
        message: "Password is reset successfully",
    });
}

// Adding reset password controller

async function resetPasswordController(req, res) {
    const { token } = req.params;
    const { newPassword, confirmPassword } = req.body;

    if (!newPassword || !confirmPassword)
        return res.status(400).json({ message: "All fields are required" });
    if (newPassword !== confirmPassword)
        return res.status(400).json({ message: "Passwords do not match" });

    // Password length validation   
    // const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    // if (!passwordRegex.test(newPassword)) {
    //     return res.status(400).json({
    //         message: "Password must be at least 8 characters, include uppercase, lowercase, number and special character"
    //     });
    // }

    try {
        const decoded = jwt.verify(token, process.env.AUTH_SECRET_KEY);
        const user = await User.findById(decoded.id);
        if (!user) return res.status(400).json({ message: "Invalid token" });

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.status(200).json({ message: "Password has been reset successfully" });
    } catch (err) {
        res.status(400).json({ message: "Invalid or expired token" });
    }
}

module.exports = {
    createUserController,
    loginHandleController,
    getUserListController,
    forgetPasswordController,
    resetPasswordController,
};
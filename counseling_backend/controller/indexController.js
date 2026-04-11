function verifyUserController(req, res) {
    const user = req.user;
    if (user) {
        
        res.status(201).json({
            message: "User is Authenticatied",
        });
    } else {
        res.status(401).json({
            message: "User is not Authenticated",
        })
    }
}

module.exports = { verifyUserController };
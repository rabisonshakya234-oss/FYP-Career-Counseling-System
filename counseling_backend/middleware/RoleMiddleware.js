function validateRoleMiddleware(currentRole) { 
    return function (req, res, next) { 
        const { role } = req.user;

        if (currentRole !== role) {
            return res.status(403).json({ message: "Forbbiden user request" });
        }
        next();
    }
}

const studentOnlyMiddleware = validateRoleMiddleware("");
const counselorOnlyMiddleware = validateRoleMiddleware("counselor");
const adminOnlyMiddleware = validateRoleMiddleware("admin");

module.exports = {
    studentOnlyMiddleware,
    counselorOnlyMiddleware,
    adminOnlyMiddleware,    
}
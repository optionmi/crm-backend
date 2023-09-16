const jwt = require("jsonwebtoken");
require("dotenv").config();

function authenticateUser(allowedUserTypes = []) {
    return function (req, res, next) {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res
                .status(401)
                .json({ message: "No token, authorization denied" });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded.user;

            const userIsAdmin = req.user.user_type === "admin";
            const userIsAllowed =
                allowedUserTypes.length === 0 ||
                allowedUserTypes.includes(req.user.userType);

            if (userIsAdmin || userIsAllowed) {
                // User is one of the allowed user types, allow access to the route
                return next();
            }

            // User is not one of the allowed user types, deny access with a 403 Forbidden status
            return res.status(403).json({ message: "Access Denied" });
        } catch (error) {
            return res.status(401).json({ message: "Token is not valid" });
        }
    };
}

module.exports = authenticateUser;

// Usage — attach directly to the route
// app.post(
//    "/endpoint", 
//    rquireAuth(req), 
//    handler
// );

const requireAuth = (req, res, next) => {    
    if (req.isAuthenticated()) return next();

    return res.status(401).json({
        error: `user not authenticated`
    });
};

export default requireAuth

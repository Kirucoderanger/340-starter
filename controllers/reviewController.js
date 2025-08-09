const reviewModel = require("../models/reviewModel");
const jwt = require("jsonwebtoken")

async function postReview(req, res) {
    try {
        const { vehicle_id, review_text, rating } = req.body;
        //const account_id = req.session.account_id; // adjust to your session logic
        const token = req.cookies.jwt || req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(403).send("You must be logged in to review.");
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const account_id = decoded.account_id;

        await reviewModel.addReview(vehicle_id, account_id, review_text, parseInt(rating));
        res.redirect(`/inv/detail/${vehicle_id}`);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error while posting review.");
    }
}

module.exports = { postReview };

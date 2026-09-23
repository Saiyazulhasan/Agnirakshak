const express = require("express");
const Telemetry = require("../models/Telemetry");

const router = express.Router();

router.get("/latest", async (req, res) => {
    try {
        const nodes =["node01","node02","node03"];
        const readings = await Promise.all(
            nodes.map((nodeId) =>
            Telemetry.findOne({ nodeId})
            .sort({ ts: -1 })
            .lean()
        )
    );
    res.json(readings.filter(Boolean));
    } catch (error) {
        console.error("Failed to fetch telemetry:", error.message);
        res.status(500).json({
            error:"failed to fetch telemetry"
        });
    }
});

module.exports = router;

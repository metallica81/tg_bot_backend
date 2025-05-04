const express = require("express");
const router = express.Router();
const { poolPromise } = require("../db");

router.get("/orders", async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query("SELECT * FROM [Order]");
        res.json(result.recordset);
    } catch (err) {
        console.error("Ошибка получения заказов:", err);
        res.status(500).send("Ошибка сервера");
    }
});

router.get("/staff", async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query("SELECT * FROM Staff");
        res.json(result.recordset);
    } catch (err) {
        console.error("Ошибка получения заказов:", err);
        res.status(500).send("Ошибка сервера");
    }
});

module.exports = router;

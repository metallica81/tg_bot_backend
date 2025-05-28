const express = require("express");
const router = express.Router();

router.get("/queue", async (req, res) => {
    try {
        const queue = await req.Queue.findAll({
            include: [
                {
                    model: req.Staff,
                    as: "Staff",
                    attributes: ["alias"],
                },
            ],
            order: [["position", "ASC"]],
        });

        if (!queue || queue.length === 0) {
            return res.status(404).json({ error: "Сотрудники не найдены" });
        }

        const result = {
            instructorStack: queue.map((item) => item.Staff?.alias || null),
        };

        res.json(result);
    } catch (error) {
        console.error("Ошибка получения очереди:", error);
        res.status(500).json({
            error: "Ошибка сервера",
            details: error.message,
        });
    }
});

module.exports = router;

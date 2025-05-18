const express = require("express");
const router = express.Router();

router.get("/staff/:chatId", async (req, res) => {
    const { chatId } = req.params;

    try {
        const staff = await req.Staff.findOne({
            where: { chat_id: chatId },
        });
        if (!staff) {
            return res.status(404).json({ error: "Сотрудник не найден" });
        }
        res.json(staff);
    } catch (error) {
        console.error("Ошибка получения сотрудника:", error);
        res.status(500).json({
            error: "Ошибка сервера",
            details: error.message,
        });
    }
});

router.patch("/staff/:chatId", async (req, res) => {
    const { chatId } = req.params;
    const updatedData = req.body;

    try {
        const [updatedRows] = await req.Staff.update(updatedData, {
            where: { chat_id: chatId },
        });
        if (updatedRows === 0) {
            return res.status(404).json({ error: "Сотрудник не найден" });
        }
        const updatedStaff = await req.Staff.findOne({
            where: { chat_id: chatId },
        }); // Получаем обновлённые данные
        res.json(updatedStaff);
    } catch (error) {
        res.status(500).json({ error: "Ошибка сервера" });
    }
});

module.exports = router;

const express = require("express");
const router = express.Router();

router.get('/staff/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const staff = await req.Staff.findByPk(id);
        if (!staff) {
            return res.status(404).json({ error: 'Сотрудник не найден' });
        }
        res.json(staff);
    } catch (error) {
        console.error('Ошибка получения сотрудника:', error);
        res.status(500).json({ error: 'Ошибка сервера', details: error.message });
    }
});

router.patch('/staff/:id', async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;

    try {
        const [updatedRows] = await req.Staff.update(updatedData, {
            where: { staff_id: id }
        });
        if (updatedRows === 0) {
            return res.status(404).json({ error: 'Сотрудник не найден' });
        }
        const updatedStaff = await req.Staff.findByPk(id); // Получаем обновлённые данные
        res.json(updatedStaff);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

module.exports = router;

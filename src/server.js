const express = require("express");
const app = express();
const ordersRoutes = require("./routes/orders");
const scheduleRoutes = require("./routes/schedule");
const { sequelize, Staff } = require('./db/index');

app.use(express.json());

app.use((req, res, next) => {
    req.Staff = Staff;
    next();
});

app.use("/api", ordersRoutes);
app.use("/api", scheduleRoutes);

const PORT = 3000;
app.listen(PORT, async () => {
    console.log(`API сервер запущен на http://localhost:${PORT}`);
    try {
        console.log('Подключение к базе данных успешно');
    } catch (error) {
        console.error('Ошибка подключения к базе:', error.message);
    }
});

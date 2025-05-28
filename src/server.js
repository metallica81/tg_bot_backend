const express = require("express");
const app = express();
const ordersRoutes = require("./routes/orders");
const scheduleRoutes = require("./routes/schedule");
const queueRoute = require ("./routes/queue");

const {
    sequelize,
    Staff,
    Schedule,
    ScheduleDay,
    ScheduleLesson,
    Queue
} = require("./db/index");

app.use(express.json());

app.use((req, res, next) => {
    req.Staff = Staff;
    req.Schedule = Schedule;
    req.ScheduleDay = ScheduleDay;
    req.ScheduleLesson = ScheduleLesson;
    req.Queue = Queue;
    next();
});

app.use("/api", ordersRoutes);
app.use("/api", scheduleRoutes);
app.use("/api", queueRoute);

const PORT = 3000;
app.listen(PORT, async () => {
    console.log(`API сервер запущен на http://localhost:${PORT}`);
    try {
        console.log("Подключение к базе данных успешно");
    } catch (error) {
        console.error("Ошибка подключения к базе:", error.message);
    }
});

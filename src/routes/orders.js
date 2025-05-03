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

router.post("/schedule", async (req, res) => {
    const data = req.body;
    const pool = await poolPromise;

    try {
        await pool.request().query(`
            DELETE FROM ScheduleLesson;
            DELETE FROM ScheduleDay;
            DELETE FROM Schedule;

            DBCC CHECKIDENT ('Schedule', RESEED, 0);
            DBCC CHECKIDENT ('ScheduleDay', RESEED, 0);
            DBCC CHECKIDENT ('ScheduleLesson', RESEED, 0);
        `);

        for (const key of data.instructorStack) {
            const instructorData = data[key];
            const tgId = instructorData.tg_id;

            for (const weekNumber of [1, 2]) {
                const weekKey =
                    weekNumber === 1
                        ? "schedule_1th_week"
                        : "schedule_2nd_week";
                if (instructorData[weekKey]) {
                    // Вставка без явного указания schedule_id
                    const scheduleInsert = await pool
                        .request()
                        .input("week_number", weekNumber)
                        .query(
                            "INSERT INTO Schedule (week_number) OUTPUT INSERTED.schedule_id VALUES (@week_number)"
                        );

                    const scheduleId = scheduleInsert.recordset[0].schedule_id;

                    for (const day of instructorData[weekKey]) {
                        const dayName = Object.keys(day)[0];
                        const [dateStr, ...lessons] = day[dayName];

                        // дату оставляем как есть (например "28 апреля")
                        const dayInsert = await pool
                            .request()
                            .input("schedule_id", scheduleId)
                            .input("day_of_week", dayName)
                            .input("lesson_date", dateStr) // сохраняем в raw-строке
                            .query(`
                            INSERT INTO ScheduleDay (schedule_id, day_of_week, lesson_date)
                            OUTPUT INSERTED.day_id
                            VALUES (@schedule_id, @day_of_week, @lesson_date)
                        `);

                        const dayId = dayInsert.recordset[0].day_id;

                        for (const lesson of lessons) {
                            const start = String(lesson.lessonTime[0]);
                            const end = String(lesson.lessonTime[1]);

                            await pool
                                .request()
                                .input("day_id", dayId)
                                .input("lesson_number", lesson.lessonNumber)
                                .input("start_time", start)
                                .input("end_time", end)
                                .input("classroom", lesson.classroom).query(`
                                INSERT INTO ScheduleLesson (day_id, lesson_number, start_time, end_time, classroom)
                                VALUES (@day_id, @lesson_number, @start_time, @end_time, @classroom)
                            `);
                        }
                    }
                }
            }
        }

        res.json({ message: "Расписание успешно сохранено" });
    } catch (err) {
        console.error("Ошибка при сохранении:", err);
        res.status(500).send("Ошибка при сохранении расписания");
    }
});

module.exports = router;

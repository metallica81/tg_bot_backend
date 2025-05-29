const express = require("express");
const router = express.Router();
const { poolPromise } = require("../db/dbConfig");

router.post("/schedule", async (req, res) => {
    const data = req.body;
    const pool = await poolPromise;

    const aliasToStaffId = {
        shatsionokSchedule: 885326961,
        egorovSchedule: 885326962,
        osipovSchedule: 885326963,
        homutovSchelule: 885326964,
        titovSchelule: 885326965,
        vrublevskiySchedule: 885326966,
    };

    try {
        // Очистка таблиц и сброс IDENTITY
        await pool.request().batch(`
            DELETE FROM ScheduleLesson;
            DELETE FROM ScheduleDay;
            DELETE FROM Schedule;
            DELETE FROM InstructorQueue;

            DBCC CHECKIDENT ('Schedule', RESEED, 0);
            DBCC CHECKIDENT ('ScheduleDay', RESEED, 0);
            DBCC CHECKIDENT ('ScheduleLesson', RESEED, 0);
            DBCC CHECKIDENT ('InstructorQueue', RESEED, 0);
        `);

        // Вставка расписаний
        for (const key of data.instructorStack) {
            const instructorData = data[key];
            const staffId = aliasToStaffId[key];
            if (!staffId) continue;

            for (const weekNumber of [1, 2]) {
                const weekKey =
                    weekNumber === 1
                        ? "schedule_1th_week"
                        : "schedule_2nd_week";

                if (instructorData[weekKey]) {
                    const scheduleInsert = await pool
                        .request()
                        .input("week_number", weekNumber)
                        .input("staff_id", staffId).query(`
                            INSERT INTO Schedule (week_number, staff_id)
                            OUTPUT INSERTED.schedule_id
                            VALUES (@week_number, @staff_id)
                        `);

                    const scheduleId = scheduleInsert.recordset[0].schedule_id;

                    for (const day of instructorData[weekKey]) {
                        const dayName = Object.keys(day)[0];
                        const [dateStr, ...lessons] = day[dayName];

                        const dayInsert = await pool
                            .request()
                            .input("schedule_id", scheduleId)
                            .input("day_of_week", dayName)
                            .input("lesson_date", dateStr).query(`
                                INSERT INTO ScheduleDay (schedule_id, day_of_week, lesson_date)
                                OUTPUT INSERTED.day_id
                                VALUES (@schedule_id, @day_of_week, @lesson_date)
                            `);

                        const dayId = dayInsert.recordset[0].day_id;

                        for (const lesson of lessons) {
                            const start = `${lesson.lessonTime[0][0]}:${lesson.lessonTime[0][1]}`;
                            const end = `${lesson.lessonTime[1][0]}:${lesson.lessonTime[1][1]}`;

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

        // Вставка очереди инструкторов
        for (let i = 0; i < data.instructorStack.length; i++) {
            const alias = data.instructorStack[i];
            const staffId = aliasToStaffId[alias];
            if (!staffId) continue;

            await pool
                .request()
                .input("staff_id", staffId)
                .input("position", i + 1).query(`
                    INSERT INTO InstructorQueue (staff_id, position)
                    VALUES (@staff_id, @position)
                `);
        }

        res.json({ message: "Расписание и очередь успешно сохранены" });
    } catch (err) {
        console.error("Ошибка при сохранении:", err);
        res.status(500).send("Ошибка при сохранении расписания");
    }
});

router.get("/schedule", async (req, res) => {
    try {
        const pool = await poolPromise;

        // Получение расписаний
        const result = await pool.request().query(`
            SELECT 
                st.staff_id,
                st.alias,
                st.chat_id,
                st.name,
                st.surname,
                st.order_amount,
                s.schedule_id,
                s.week_number,
                sd.day_of_week,
                sd.lesson_date,
                sl.lesson_number,
                sl.start_time,
                sl.end_time,
                sl.classroom
            FROM Staff st
            LEFT JOIN Schedule s ON st.staff_id = s.staff_id
            LEFT JOIN ScheduleDay sd ON s.schedule_id = sd.schedule_id
            LEFT JOIN ScheduleLesson sl ON sd.day_id = sl.day_id
            ORDER BY s.schedule_id, s.week_number, sd.day_of_week, sl.lesson_number
        `);

        const schedules = result.recordset;
        const structured = {};

        // Формирование расписания
        for (const row of schedules) {
            const alias = row.alias;
            const weekKey =
                row.week_number === 1
                    ? "schedule_1th_week"
                    : "schedule_2nd_week";

            if (!structured[alias]) {
                structured[alias] = {
                    name: `${row.surname} ${row.name}`,
                    tg_id: Number(row.chat_id),
                    order_count: row.order_amount,
                    [weekKey]: [],
                };
            } else if (!structured[alias][weekKey]) {
                structured[alias][weekKey] = [];
            }

            const dayArray = structured[alias][weekKey];

            let dayEntry = dayArray.find(
                (entry) => Object.keys(entry)[0] === row.day_of_week
            );

            if (!dayEntry) {
                dayEntry = {
                    [row.day_of_week]: [row.lesson_date],
                };
                dayArray.push(dayEntry);
            }

            if (row.start_time | row.end_time) {
                dayEntry[row.day_of_week].push({
                    lessonNumber: row.lesson_number,
                    lessonTime: [
                        [
                            parseInt(row.start_time.split(":")[0]),
                            parseInt(row.start_time.split(":")[1]),
                        ],
                        [
                            parseInt(row.end_time.split(":")[0]),
                            parseInt(row.end_time.split(":")[1]),
                        ],
                    ],
                    classroom: row.classroom,
                });
            }
        }

        res.json(structured);
    } catch (err) {
        console.error("Ошибка при получении расписания:", err);
        res.status(500).send("Ошибка при получении расписания");
    }
});

module.exports = router;

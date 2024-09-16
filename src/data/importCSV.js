import fs from "fs";
import csv from "csv-parser";
import SIZItem from "../models/SIZItem.js"; // Импорт модели

const isValidDate = (date) => !isNaN(Date.parse(date));

const importCSV = () => {
  const results = [];
  fs.createReadStream("./SIZinventory.csv")
    .pipe(csv())
    .on("data", (data) => {
      results.push(data);
    })
    .on("end", async () => {
      const promises = results.map((row) => {
        return SIZItem.create({
          location: row["Местонахождение"],
          type: row["Вид СЗ"],
          voltageClass: row["Класс напряжения СЗ, кВ"],
          szType: row["Тип СЗ"],
          number: row["№ СЗ"],
          testDate: isValidDate(row["Дата испытания"])
            ? new Date(row["Дата испытания"])
            : null,
          nextTestDate: isValidDate(row["Дата следующего испытания"])
            ? new Date(row["Дата следующего испытания"])
            : null,
          lastInspectDate: isValidDate(row["Дата последнего осмотра"])
            ? new Date(row["Дата последнего осмотра"])
            : null,
          quantity: parseInt(row["Количество"], 10),
          classQuantity: null, // Этот параметр будет рассчитан позже
          note: row["Примечание"],
        }).catch((err) => {
          console.error(
            `Ошибка при создании записи для СИЗ ${row["№ СЗ"]}:`,
            err
          );
        });
      });

      await Promise.all(promises);
      console.log("Импорт данных завершен.");
    });
};

importCSV();

import fs from "fs";
import csv from "csv-parser";
import SIZItem from "../models/SIZItem.js";
import { isValidDate } from "./dateUtils.js"; // Импорт функции валидации даты

const importCSV = async () => {
  const results = [];

  fs.createReadStream("./SIZinventory.csv")
    .pipe(csv())
    .on("data", (data) => {
      results.push(data);
    })
    .on("end", async () => {
      for (const row of results) {
        const testDate = isValidDate(row["Дата испытания"])
          ? new Date(row["Дата испытания"])
          : null;
        const nextTestDate = isValidDate(row["Дата следующего испытания"])
          ? new Date(row["Дата следующего испытания"])
          : null;
        const lastInspectDate = isValidDate(row["Дата последнего осмотра"])
          ? new Date(row["Дата последнего осмотра"])
          : null;

        if (!testDate || !nextTestDate) {
          console.log(
            `Ошибка в строке с номером СЗ ${row["№ СЗ"]}: некорректные даты испытания или следующего испытания.`
          );
          continue;
        }

        await SIZItem.create({
          location: row["Местонахождение"],
          type: row["Вид СЗ"],
          voltageClass: row["Класс напряжения СЗ, кВ"],
          szType: row["Тип СЗ"],
          number: row["№ СЗ"],
          testDate: testDate,
          nextTestDate: nextTestDate,
          lastInspectDate: lastInspectDate,
          quantity: parseInt(row["Количество"], 10),
          note: row["Примечание"],
        });
      }

      console.log("Импорт данных завершен.");
    });
};

importCSV();

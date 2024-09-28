import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import csv from "csv-parser";
import SIZItem from "../models/SIZItem.js";
import { isValidDate } from "../utils/dateUtils.js"; // Импорт функции валидации даты

// Определяем __dirname в стиле ES-модулей
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function importCSV() {
  console.log("Запуск функции импорта CSV данных");

  const filePath = path.join(__dirname, "../data/SIZinventory.csv");

  const results = [];

  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (data) => {
      console.log("Прочитана строка:", data); // Логирование данных строки
      results.push(data);
    })
    .on("end", async () => {
      console.log("Всего строк загружено:", results.length); // Логирование общего количества строк
      for (const row of results) {
        console.log("Обработка строки:", row); // Логирование перед обработкой строки
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

        try {
          await SIZItem.create({
            location: row["Местонахождение"],
            type: row["Вид СЗ"],
            voltageClass: row["Класс напряжения СЗ"],
            szType: row["Тип СЗ"],
            number: row["№ СЗ"],
            testDate: testDate,
            nextTestDate: nextTestDate,
            lastInspectDate: lastInspectDate,
            quantity: parseInt(row["Количество"], 10),
            note: row["Примечание"],
          });
          console.log("Данные успешно сохранены:", row);
        } catch (error) {
          console.error("Ошибка при сохранении данных:", error.message, row);
        }
      }

      console.log("Импорт данных завершен.");
    });
}

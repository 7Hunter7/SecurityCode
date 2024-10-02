import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import csv from "csv-parser";
import SIZItem from "../models/SIZItem.js";
import {
  isValidDate,
  formatDate,
  getAutomaticNote,
} from "../utils/dateUtils.js"; // Импорт функций для работы с данными

// Определяем __dirname в стиле ES-модулей
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function importCSV() {
  console.log("Запуск функции импорта CSV данных");

  const filePath = path.join(__dirname, "../data/SIZinventory.csv");

  // Проверка наличия файла
  if (!fs.existsSync(filePath)) {
    console.error(`Файл не найден: ${filePath}`);
    return;
  }

  // Получаем максимальный updatedAt из базы данных
  const latestRecord = await SIZItem.findOne({
    order: [["updatedAt", "DESC"]],
  });
  const latestUpdatedAt = latestRecord ? latestRecord.updatedAt : null;
  const results = [];

  // Определяем типы СИЗ, для которых не нужно генерировать примечание
  const PZ_TYPES = ["ПЗ для РУ", "ПЗ для ВЛ", "ПЗ для ИВЛ", "ЗПЛ"];

  fs.createReadStream(filePath)
    .pipe(csv({ separator: ";" }))
    .on("data", (data) => {
      const cleanedRow = {};
      for (const key in data) {
        const cleanedKey = key.trim(); // Удаляем пробелы в начале и конце ключа
        cleanedRow[cleanedKey] = data[key].trim(); // Удаляем пробелы в значениях
      }
      results.push(cleanedRow);
    })
    .on("end", async () => {
      console.log("Всего строк загружено:", results.length);
      for (const row of results) {
        console.log("Обработка строки:", row);

        // Проверка и преобразование дат
        const testDate = row["Дата испытания"]
          ? isValidDate(row["Дата испытания"])
            ? new Date(row["Дата испытания"])
            : formatDate(row["Дата испытания"])
          : null;
        const nextTestDate = row["Дата следующего испытания"]
          ? isValidDate(row["Дата следующего испытания"])
            ? new Date(row["Дата следующего испытания"])
            : formatDate(row["Дата следующего испытания"])
          : null;
        const lastInspectDate = row["Дата последнего осмотра"]
          ? isValidDate(row["Дата последнего осмотра"])
            ? new Date(row["Дата последнего осмотра"])
            : formatDate(row["Дата последнего осмотра"])
          : null;

        // Вычисляем разницу во времени для генерации примечания
        const differenceInMs = nextTestDate - new Date();

        let note = row["Примечание"] || ""; // Если уже есть примечание, используем его

        // Если тип СИЗ не относится к "ПЗ", генерируем автоматическое примечание
        if (!PZ_TYPES.includes(row["Вид СЗ"]) && !note) {
          note = getAutomaticNote(differenceInMs);
        }

        try {
          const existingSIZ = await SIZItem.findOne({
            where: {
              number: row["№ СЗ"],
              type: row["Вид СЗ"],
              location: row["Местонахождение"],
            },
          });

          if (!existingSIZ) {
            // Если записи нет, создаем новую
            await SIZItem.create({
              location: row["Местонахождение"],
              type: row["Вид СЗ"],
              voltageClass: row["Класс напряжения СЗ"],
              szType: row["Тип СЗ"] || "—", // Если тип СЗ отсутствует, использовать символ "-"
              number: row["№ СЗ"],
              testDate: testDate,
              nextTestDate: nextTestDate,
              lastInspectDate: lastInspectDate,
              quantity: parseInt(row["Количество"], 10),
              note: note, // Примечание генерируется автоматически или загружается из CSV
            });
            console.log("Данные успешно сохранены:", row);
          } else {
            // Если запись уже существует, сравниваем даты обновления
            if (
              latestUpdatedAt &&
              new Date(existingSIZ.updatedAt) < new Date(latestUpdatedAt)
            ) {
              console.log(`Запись с номером СЗ ${row["№ СЗ"]} обновлена.`);
            } else {
              console.log(
                `Запись с номером СЗ ${row["№ СЗ"]} уже существует, пропуск сохранения.`
              );
            }
          }
        } catch (error) {
          console.error("Ошибка при сохранении данных:", error.message, row);
        }
      }

      console.log("Импорт данных завершен.");
    });
}

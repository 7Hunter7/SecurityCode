import fs from "fs";
import csv from "csv-parser";
import SIZItem from "../models/SIZItem.js"; // Импорт модели

const isValidDate = (date) => {
  return !isNaN(Date.parse(date));
};

const importCSV = async () => {
  const results = [];
  const quantityByClass = {};

  // Чтение и обработка данных из CSV
  fs.createReadStream("./SIZinventory.csv")
    .pipe(csv())
    .on("data", (data) => {
      results.push(data);
    })
    .on("end", async () => {
      for (const row of results) {
        // Создаем уникальный ключ для подсчета количества по классам
        const key = `${row["Вид СЗ"]}_${row["Класс напряжения СЗ, кВ"]}_${row["Местонахождение"]}`;

        // Инициализируем количество для данного класса, если его еще нет
        if (!quantityByClass[key]) {
          quantityByClass[key] = 0;
        }

        // Добавляем количество из текущей строки
        quantityByClass[key] += parseInt(row["Количество"], 10);

        // Проверка дат
        const testDate = isValidDate(row["Дата испытания"])
          ? new Date(row["Дата испытания"])
          : null;
        const nextTestDate = isValidDate(row["Дата следующего испытания"])
          ? new Date(row["Дата следующего испытания"])
          : null;
        const lastInspectDate = isValidDate(row["Дата последнего осмотра"])
          ? new Date(row["Дата последнего осмотра"])
          : null;

        // Если тестовая дата или дата следующего испытания некорректны, пропускаем запись
        if (!testDate || !nextTestDate) {
          console.log(
            `Ошибка в строке с номером СЗ ${row["№ СЗ"]}: некорректные даты испытания или следующего испытания.`
          );
          continue; // Пропускаем некорректные записи
        }

        // Сохраняем каждую запись в базу данных
        await SIZItem.create({
          location: row["Местонахождение"],
          type: row["Вид СЗ"],
          voltageClass: row["Класс напряжения СЗ, кВ"],
          szType: row["Тип СЗ"],
          number: row["№ СЗ"],
          testDate: testDate,
          nextTestDate: nextTestDate,
          lastInspectDate: lastInspectDate, // Если дата осмотра не указана, она останется null
          quantity: parseInt(row["Количество"], 10),
          classQuantity: quantityByClass[key], // Количество по классу напряжения
          note: row["Примечание"],
        });
      }

      console.log("Импорт данных завершен.");
    });
};

importCSV();

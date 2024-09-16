import fs from "fs";
import csv from "csv-parser";
import SIZItem from "../models/SIZItem.js"; // Импорт модели

const importCSV = () => {
  const results = [];
  fs.createReadStream("./SIZinventory.csv")
    .pipe(csv())
    .on("data", (data) => {
      results.push(data);
    })
    .on("end", async () => {
      for (const row of results) {
        await SIZItem.create({
          location: row["Местонахождение"],
          type: row["Вид СЗ"],
          voltageClass: row["Класс напряжения СЗ, кВ"],
          szType: row["Тип СЗ"],
          number: row["№ СЗ"],
          testDate: new Date(row["Дата испытания"]),
          nextTestDate: new Date(row["Дата следующего испытания"]),
          lastInspectDate: row["Дата последнего осмотра"]
            ? new Date(row["Дата последнего осмотра"])
            : null,
          quantity: parseInt(row["Количество"], 10),
          classQuantity: null, // Этот параметр будет рассчитан позже
          note: row["Примечание"],
        });
      }
      console.log("Импорт данных завершен.");
    });
};

importCSV();

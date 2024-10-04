// Функция для расчета следующей даты испытания
export function calculateNextTestDate(sizType, testDate) {
  let monthsToAdd = 0;

  switch (sizType) {
    case "Диэлектрические перчатки":
      monthsToAdd = 6;
      break;
    case "Указатель напряжения":
      monthsToAdd = 12;
      break;
    case "Изолирующая штанга":
      monthsToAdd = 24;
      break;
    case "Диэлектрические боты":
      monthsToAdd = 36;
      break;
    default:
      return null;
  }
  const nextTestDate = new Date(
    testDate.setMonth(testDate.getMonth() + monthsToAdd)
  );
  return nextTestDate.toISOString().substr(0, 10);
}

// Функция для получения текущей даты последнего осмотра
export function getLastInspectDate() {
  return new Date().toISOString().split("T")[0];
}

// Функция для автоматического выставления примечания в зависимости от разницы дат
export function getAutomaticInspectionResult(
  differenceInMs,
  lastInspectDate = null,
  existingInspectionResult = ""
) {
  const oneMonthInMs = 30 * 24 * 60 * 60 * 1000;
  let inspectionNote = "";
  let testNote = "";

  // Проверка даты последнего осмотра
  if (lastInspectDate) {
    const inspectDiff = new Date() - new Date(lastInspectDate);
    if (inspectDiff <= oneMonthInMs) {
      inspectionNote = "Осмотрено";
    } else {
      inspectionNote = "Необходимо выполнить осмотр!";
    }
  }

  // Проверка даты следующего испытания
  if (differenceInMs !== null) {
    if (differenceInMs > oneMonthInMs) {
      testNote = "Испытано";
    } else if (differenceInMs <= oneMonthInMs && differenceInMs >= 0) {
      testNote = "Необходимо отправить на испытания!";
    } else if (differenceInMs < 0) {
      testNote = "Испытание просрочено!";
    }
  }

  // Объединение результатов проверок в одну строку
  const combinedNote =
    `${existingInspectionResult} ${inspectionNote} ${testNote}`.trim();
  return combinedNote.replace(/\s+/g, " ").trim(); // Удаление лишних пробелов
}

// Функция для проверки валидности даты
export function isValidDate(date) {
  return !isNaN(Date.parse(date));
}

// функция для преобразования даты
export function formatDate(dateStr) {
  // Разделяем строку даты по точке
  const [day, month, year] = dateStr.split(".");

  // Формируем дату в формате YYYY-MM-DD
  return `${year}-${month}-${day}`;
}

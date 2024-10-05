// Функция для расчета следующей даты испытания
export function calculateNextTestDate(sizType, testDate) {
  let monthsToAdd = 0;

  const sixMonthsItems = [
    "Диэлектрические перчатки",
    "Перчатки диэлектрические",
    "Лестница изолирующая",
    "Стремянка изолирующая",
    "Изолирующая лестница",
    "Изолирующая стремянка",
    "Приставая изолирующая лестница",
    "Приставая изолирующая стремянка",
    "Приставая изолирующая лестница (стремянка)",
  ];

  const twelveMonthsItems = [
    "Диэлектрические галоши",
    "Галоши диэлектрические",
    "Указатель напряжения",
    "Указатель напряжения для фазировки",
    "Указатели напряжения для проверки фаз",
    "Указатели напряжения для проверки совпадения фаз",
    "Штанга измерительная",
    "Измерительная штанга",
    "Изолирующий инструмент",
    "Изолирующий инструмент, комплект",
  ];

  const twentyFourMonthsItems = [
    "Электроизмерительные клещи",
    "Клещи электроизмерительные",
    "Клещи изолирующие",
    "Изолирующие клещи",
    "Изолирующая штанга",
    "Изолирующая часть штанги переносного заземления",
    "Штанга изолирующая",
    "Штанга оперативная",
    "Штанга универсальная",
    "Штанга оперативная (универсальная)",
    "Комплект штанг для установки ПЗ",
    "Изолирующая штанга КШЗ",
    "КШЗ (с изолирующей штангой)",
  ];

  const thirtySixMonthsItems = ["Диэлектрические боты", "Боты диэлектрические"];

  if (sixMonthsItems.includes(sizType)) {
    monthsToAdd = 6;
  } else if (twelveMonthsItems.includes(sizType)) {
    monthsToAdd = 12;
  } else if (twentyFourMonthsItems.includes(sizType)) {
    monthsToAdd = 24;
  } else if (thirtySixMonthsItems.includes(sizType)) {
    monthsToAdd = 36;
  } else {
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
  lastInspectDate,
  existingInspectionResult = ""
) {
  const oneMonthInMs = 30 * 24 * 60 * 60 * 1000;

  // Константы сообщений
  const INSPECTED = "Осмотрено.";
  const INSPECTION_REQUIRED = "Необходимо выполнить осмотр!";
  const TESTED = "Испытано.";
  const TEST_REQUIRED = "Необходимо отправить на испытания!";
  const TEST_OVERDUE = "Испытание просрочено!";

  let inspectionNote = "";
  let testNote = "";

  // Проверка даты последнего осмотра
  if (lastInspectDate) {
    const inspectDiff = new Date() - new Date(lastInspectDate);
    inspectionNote =
      inspectDiff >= oneMonthInMs ? INSPECTED : INSPECTION_REQUIRED;
  }

  // Проверка даты следующего испытания
  if (differenceInMs !== undefined && differenceInMs !== null) {
    if (differenceInMs > oneMonthInMs) {
      testNote = TESTED;
    } else if (differenceInMs >= 0) {
      testNote = TEST_REQUIRED;
    } else {
      testNote = TEST_OVERDUE;
    }
  }

  // Объединение результатов
  const combinedNote = [existingInspectionResult, inspectionNote, testNote]
    .filter(Boolean) // Убираем пустые строки
    .join(" "); // Объединяем с одним пробелом

  return combinedNote.trim(); // Убираем возможные пробелы по краям
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

import { parse, isValid, format } from "date-fns"; // Подключение библиотеки date-fns для работы с датами

// Функция для расчета следующей даты испытания
export function calculateNextTestDate(sizType, testDate) {
  if (isNaN(testDate.getTime())) {
    console.error("Неверный формат даты:", testDate);
    return null;
  }

  let monthsToAdd = 0;

  // СИЗ со сроками испытания - 1 раз в 6 мес.
  const sixMonthsItems = [
    "Диэлектрические перчатки",
    "Перчатки диэлектрические",
    "Лестница изолирующая",
    "Стремянка изолирующая",
    "Подставка изолирующая",
    "Изолирующая лестница",
    "Изолирующая стремянка",
    "Изолирующая подставка",
    "Приставая изолирующая лестница",
    "Приставая изолирующая стремянка",
    "Приставая изолирующая лестница (стремянка)",
  ];
  // СИЗ со сроками испытания - 1 раз в 12 мес.
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
  // СИЗ со сроками испытания - 1 раз в 24 мес.
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
  // СИЗ со сроками испытания - 1 раз в 36 мес.
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

  // Проверяем на валидность итоговой даты
  if (isNaN(nextTestDate.getTime())) {
    console.error("Неверная итоговая дата:", nextTestDate);
    return null;
  }

  return format(nextTestDate, "yyyy-MM-dd"); // Форматируем дату как строку
}

// Функция для получения текущей даты последнего осмотра
export function getLastInspectDate() {
  return format(new Date(), "yyyy-MM-dd"); // Возвращаем текущую дату в нужном формате
}

// Функция для автоматического выставления примечания в зависимости от разницы дат
export function getAutomaticInspectionResult(
  differenceInMs,
  lastInspectDate,
  existingInspectionResult = "",
  isPZ = false // Добавляем флаг для типов ПЗ
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
      inspectDiff <= oneMonthInMs ? INSPECTED : INSPECTION_REQUIRED;
  }

  // Проверка даты следующего испытания (если не ПЗ)
  if (!isPZ && differenceInMs !== null && differenceInMs !== undefined) {
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
  const parsedDate = parse(date, "yyyy-MM-dd", new Date());
  return isValid(parsedDate) && !isNaN(parsedDate.getTime());
}

// Функция для преобразования даты из ДД.ММ.ГГГГ в YYYY-MM-DD
export function formatDate(dateStr) {
  const parsedDate = parse(dateStr, "dd.MM.yyyy", new Date());
  return format(parsedDate, "yyyy-MM-dd");
}

// Функция для преобразования даты из YYYY-MM-DD в ДД.ММ.ГГГГ
export function reverseformatDate(dateStr) {
  // Проверяем, если строка пуста или невалидна, возвращаем дефолтное значение
  if (!dateStr) return "—";
  const parsedDate = parse(dateStr, "yyyy-MM-dd", new Date());

  // Проверяем, является ли дата валидной
  if (!isValid(parsedDate)) {
    return "—"; // Возвращаем дефолтное значение для некорректной даты
  }
  return format(parsedDate, "dd.MM.yyyy");
}

// Функция для преобразования строки в дату и форматирования в YYYY-MM-DD
export function parseAndFormatDate(dateStr) {
  // Преобразуем строку в объект даты
  const parsedDate = parse(dateStr, "yyyy-MM-dd", new Date());

  // Проверяем, валидна ли дата
  if (!isValid(parsedDate) || isNaN(parsedDate.getTime())) {
    console.error("Неверный формат даты:", dateStr);
    return null;
  }

  // Форматируем дату как YYYY-MM-DD
  return format(parsedDate, "yyyy-MM-dd");
}

// Функция обработки изменений типа СЗ
export function handleTypeChange(siz, state) {
  const { type, voltage } = siz;
  const { szTypes } = state;

  // Сброс значения szType при изменении type
  siz.szType = "";

  // Проверка, есть ли szTypes в состоянии
  if (!szTypes || szTypes.length === 0) {
    console.warn("szTypes are undefined or empty");
    return;
  }

  // Сохранение текущего значения szType, если оно "new" или "—"
  const previousSzType = siz.szType;
  if (previousSzType !== "new" && previousSzType !== "—") {
    siz.szType = ""; // Сброс значения szType, если это не "new" или "—"
  }

  // Массив для хранения всех фильтраций
  let filteredSzTypes = szTypes.filter(
    (szType) => szType === "new" || szType === "—"
  );

  // Перчатки диэлектрические, Боты диэлектрические, Клещи изолирующие и Изолирующий инструмент
  if (
    type === "Перчатки диэлектрические" ||
    type === "Боты диэлектрические" ||
    type === "Клещи изолирующие" ||
    type === "Изолирующий инструмент, комплект"
  ) {
    siz.szType = "—";
    siz.voltage = "1";
    return;
  }

  // Всегда есть пункт "new" и "—" для всех СЗ
  filteredSzTypes = szTypes.filter(
    (szType) => szType === "new" || szType === "—"
  );

  // Фильтрация на основе типа:
  // 1. Указатель напряжения
  if (type === "Указатель напряжения") {
    filteredSzTypes = filteredSzTypes.concat(
      szTypes.filter((szType) =>
        ["УН", "УНН", "УВН"].some((prefix) => szType.startsWith(prefix))
      )
    );
  }
  // 2. Указатель напряжения для фазировки
  else if (type === "Указатель напряжения для фазировки") {
    filteredSzTypes = filteredSzTypes.concat(
      szTypes.filter((szType) => szType.includes("Ф"))
    );
  }
  // 3. Штанга оперативная (универсальная)
  else if (
    type === "Штанга оперативная (универсальная)" ||
    type === "Штанга оперативная" ||
    type === "Штанга изолирующая"
  ) {
    filteredSzTypes = filteredSzTypes.concat(
      szTypes.filter((szType) => szType.includes("ШО"))
    );
  }
  // 4. Комплект штанг для установки ПЗ
  else if (type === "Комплект штанг для установки ПЗ") {
    filteredSzTypes = filteredSzTypes.concat(
      szTypes.filter((szType) => szType.includes("ЗПП"))
    );
  }
  // 5. КШЗ
  else if (type === "КШЗ" || type === "КШЗ (с изолирующей штангой)") {
    filteredSzTypes = filteredSzTypes.concat(
      szTypes.filter((szType) => szType.includes("КШЗ"))
    );
  }
  // 6. ПЗ для РУ
  else if (type === "ПЗ для РУ") {
    filteredSzTypes = filteredSzTypes.concat(
      szTypes.filter((szType) => szType.includes("ЗПП"))
    );
  }
  // 7. ПЗ для ВЛ
  else if (type === "ПЗ для ВЛ") {
    filteredSzTypes = filteredSzTypes.concat(
      szTypes.filter((szType) => szType.includes("ЗПЛ"))
    );
  }
  // 8. ПЗ для ИВЛ
  else if (type === "ПЗ для ИВЛ") {
    filteredSzTypes = filteredSzTypes.concat(
      szTypes.filter((szType) => szType.includes("ПЗ СИП"))
    );
  }
  // 9. Наброс для ВЛ
  else if (type === "Наброс для ВЛ" || type === "Наброс") {
    filteredSzTypes = filteredSzTypes.concat(
      szTypes.filter((szType) => szType.includes("ЗНЛ"))
    );
  }
  // 10. Для остальных СЗ
  else {
    filteredSzTypes = filteredSzTypes.concat(
      szTypes.filter((szType) => szType !== "new")
    );
  }
  // Удаление дубликатов
  state.filteredSzTypes = Array.from(new Set(filteredSzTypes));
  console.log("Filtered SzTypes:", state.filteredSzTypes);

  // Если напряжение уже выбрано и не было циклического вызова
  if (voltage) {
    handleVoltageChange(siz, state, true); // Фильтрация напряжения с дополнительным флагом
  }
}

// Функция фильтрации szTypes на основе напряжения ЭУ
export function handleVoltageChange(siz, state, fromTypeChange = false) {
  const { voltage } = siz;

  // Проверка на наличие значения напряжения
  if (!voltage || isNaN(voltage)) {
    console.warn("Invalid voltage or voltage is undefined");
    return;
  }

  // Сброс значения szType при изменении напряжения
  siz.szType = "";

  // Проверка на наличие данных для фильтрации
  if (!state.filteredSzTypes || state.filteredSzTypes.length === 0) {
    console.warn("filteredSzTypes are undefined or empty");
    return;
  }

  // Регулярное выражение для точного соответствия напряжению
  const voltagePattern = new RegExp(`\\b${voltage}\\b`);

  // Фильтрация szTypes на основе точного совпадения напряжения
  state.filteredSzTypes = state.filteredSzTypes.filter((szType) =>
    voltagePattern.test(szType)
  );
  console.log("Current voltage:", voltage);
  console.log("Filtered SzTypes by Voltage:", state.filteredSzTypes);

  // Установка флага, чтобы предотвратить циклические вызовы
  if (!fromTypeChange) {
    // Повторный вызов handleTypeChange
    handleTypeChange(siz, state);
  }
}

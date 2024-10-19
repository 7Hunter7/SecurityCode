// Функция обработки изменений типа СЗ
export function handleTypeChange(siz, state) {
  const { type, voltage } = siz;
  const { szTypes } = state;

  // Сброс значения szType при изменении type
  siz.szType = "";

  // Проверка, есть ли szTypes в состоянии, чтобы избежать ошибок
  if (!szTypes || szTypes.length === 0) return;

  // 1. Перчатки диэлектрические и Боты диэлектрические
  if (type === "Перчатки диэлектрические" || type === "Боты диэлектрические") {
    siz.voltage = "1";
    siz.szType = "—";
  }
  // 2. Указатель напряжения
  else if (type === "Указатель напряжения") {
    state.filteredSzTypes = szTypes.filter((szType) =>
      ["У", "УН", "УВН"].some((prefix) => szType.startsWith(prefix))
    );
    if (voltage) {
      handleVoltageChange(siz, state);
    }
  }
  // 3. Указатель напряжения для фазировки
  else if (type === "Указатель напряжения для фазировки") {
    state.filteredSzTypes = szTypes.filter((szType) => szType.includes("Ф"));
    if (voltage) {
      handleVoltageChange(siz, state);
    }
  }
  // 4. Штанга оперативная (универсальная)
  else if (type === "Штанга оперативная (универсальная)") {
    state.filteredSzTypes = szTypes.filter((szType) => szType.includes("ШО"));
    if (voltage) {
      handleVoltageChange(siz, state);
    }
  }
  // 5. Комплект штанг для установки ПЗ
  else if (type === "Комплект штанг для установки ПЗ") {
    state.filteredSzTypes = szTypes.filter((szType) =>
      ["ЗПП", "ЗПЛ"].some((prefix) => szType.startsWith(prefix))
    );
    if (voltage) {
      handleVoltageChange(siz, state);
    }
  }
  // 6. КШЗ
  else if (type === "КШЗ" || type === "КШЗ (с изолирующей штангой)") {
    state.filteredSzTypes = szTypes.filter((szType) => szType.includes("КШЗ"));
    if (voltage) {
      handleVoltageChange(siz, state);
    }
  }
  // 7. ПЗ для РУ
  else if (type === "ПЗ для РУ") {
    state.filteredSzTypes = szTypes.filter((szType) => szType.includes("ЗПП"));
    if (voltage) {
      handleVoltageChange(siz, state);
    }
  }
  // 8. ПЗ для ВЛ
  else if (type === "ПЗ для ВЛ") {
    state.filteredSzTypes = szTypes.filter((szType) => szType.includes("ЗПЛ"));
    if (voltage) {
      handleVoltageChange(siz, state);
    }
  }
  // 9. ПЗ для ИВЛ
  else if (type === "ПЗ для ИВЛ") {
    state.filteredSzTypes = szTypes.filter((szType) =>
      szType.includes("ПЗ СИП")
    );
  }
  // 10. Наброс для ВЛ
  else if (type === "Наброс для ВЛ") {
    state.filteredSzTypes = szTypes.filter((szType) => szType.includes("ЗНЛ"));
  }
}

// Функция фильтрации szTypes на основе напряжения ЭУ
export function handleVoltageChange(siz, state) {
  const { voltage, type } = siz;

  // Проверка на наличие данных для фильтрации
  if (!state.filteredSzTypes || state.filteredSzTypes.length === 0) return;

  // Фильтрация szTypes на основе напряжения для указанных типов
  if (
    type === "Указатель напряжения" ||
    type === "Указатель напряжения для фазировки" ||
    type === "Штанга оперативная (универсальная)" ||
    type === "Комплект штанг для установки ПЗ" ||
    type === "КШЗ" ||
    type === "КШЗ (с изолирующей штангой)" ||
    type === "ПЗ для РУ" ||
    type === "ПЗ для ВЛ"
  ) {
    state.filteredSzTypes = state.filteredSzTypes.filter((szType) =>
      szType.includes(voltage)
    );
  }
}

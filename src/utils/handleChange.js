// Функция обработки изменений типа СЗ
export function handleTypeChange(siz, state) {
  const { type, voltage } = siz;
  const { szTypes } = state;

  // Сброс значения szType при изменении type
  siz.szType = "";

  // Проверка, есть ли szTypes в состоянии, чтобы избежать ошибок
  if (!szTypes || szTypes.length === 0) return;

  // 0. Перчатки диэлектрические, Боты диэлектрические, Клещи изолирующие и Изолирующий инструмент
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

  //1. Всегда есть пункт "new" для следующих СЗ
  state.filteredSzTypes = szTypes.filter((szType) => szType === "new");

  // 2. Указатель напряжения
  if (type === "Указатель напряжения") {
    state.filteredSzTypes = state.filteredSzTypes.concat(
      szTypes.filter((szType) =>
        ["УН", "УНН", "УВН"].some((prefix) => szType.startsWith(prefix))
      )
    );
  }
  // 3. Указатель напряжения для фазировки
  else if (type === "Указатель напряжения для фазировки") {
    state.filteredSzTypes = state.filteredSzTypes.concat(
      szTypes.filter((szType) => szType.includes("Ф"))
    );
  }
  // 4. Штанга оперативная (универсальная)
  else if (type === "Штанга оперативная (универсальная)") {
    state.filteredSzTypes = state.filteredSzTypes.concat(
      szTypes.filter((szType) => szType.includes("ШО"))
    );
  }
  // 5. Комплект штанг для установки ПЗ
  else if (type === "Комплект штанг для установки ПЗ") {
    state.filteredSzTypes = state.filteredSzTypes.concat(
      szTypes.filter((szType) => szType.includes("ЗПП"))
    );
  }
  // 6. КШЗ
  else if (type === "КШЗ" || type === "КШЗ (с изолирующей штангой)") {
    state.filteredSzTypes = state.filteredSzTypes.concat(
      szTypes.filter((szType) => szType.includes("КШЗ"))
    );
  }
  // 7. ПЗ для РУ
  else if (type === "ПЗ для РУ") {
    state.filteredSzTypes = state.filteredSzTypes.concat(
      szTypes.filter((szType) => szType.includes("ЗПП"))
    );
  }
  // 8. ПЗ для ВЛ
  else if (type === "ПЗ для ВЛ") {
    state.filteredSzTypes = state.filteredSzTypes.concat(
      szTypes.filter((szType) => szType.includes("ЗПЛ"))
    );
  }
  // 9. ПЗ для ИВЛ
  else if (type === "ПЗ для ИВЛ") {
    state.filteredSzTypes = state.filteredSzTypes.concat(
      szTypes.filter((szType) => szType.includes("ПЗ СИП"))
    );
  }
  // 10. Наброс для ВЛ
  else if (type === "Наброс для ВЛ" || type === "Наброс") {
    state.filteredSzTypes = state.filteredSzTypes.concat(
      szTypes.filter((szType) => szType.includes("ЗНЛ"))
    );
  }
  // Если напряжение уже выбрано
  if (voltage) {
    handleVoltageChange(siz, state);
  }
}

// Функция фильтрации szTypes на основе напряжения ЭУ
export function handleVoltageChange(siz, state) {
  const { voltage, type } = siz;

  // Проверка на наличие данных для фильтрации
  if (!state.filteredSzTypes || state.filteredSzTypes.length === 0) return;

  // Фильтрация szTypes на основе напряжения для указанных типов
  state.filteredSzTypes = state.filteredSzTypes.filter((szType) =>
    szType.includes(voltage)
  );
}

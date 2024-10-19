// Функция обработки изменений типа СЗ
export function handleTypeChange(siz, state) {
  const { type, voltage } = siz;
  const { szTypes, voltages } = state;

  // Сбрасываем значение szType при изменении type
  siz.szType = "";

  if (type === "Перчатки диэлектрические" || type === "Боты диэлектрические") {
    siz.voltage = "1";
    siz.szType = "—";
  } else if (type === "Указатель напряжения") {
    state.filteredSzTypes = szTypes.filter((szType) =>
      ["УН", "УВН"].some((prefix) => szType.startsWith(prefix))
    );
    if (voltage) {
      handleVoltageChange(siz, state);
    }
  } else if (type === "Указатель напряжения для фазировки") {
    state.filteredSzTypes = szTypes.filter((szType) => szType.includes("Ф"));
    if (voltage) {
      handleVoltageChange(siz, state);
    }
  } else if (type === "Штанга оперативная (универсальная)") {
    state.filteredSzTypes = szTypes.filter((szType) => szType.includes("Ш"));
    if (voltage) {
      handleVoltageChange(siz, state);
    }
  } else if (type === "Комплект штанг для установки ПЗ") {
    state.filteredSzTypes = szTypes.filter((szType) =>
      ["ЗПП", "ЗПЛ"].some((prefix) => szType.startsWith(prefix))
    );
    if (voltage) {
      handleVoltageChange(siz, state);
    }
  } else if (type === "КШЗ" || type === "КШЗ (с изолирующей штангой)") {
    state.filteredSzTypes = szTypes.filter((szType) => szType.includes("КШЗ"));
    if (voltage) {
      handleVoltageChange(siz, state);
    }
  } else if (type === "ПЗ для РУ") {
    state.filteredSzTypes = szTypes.filter((szType) => szType.includes("ЗПП"));
    if (voltage) {
      handleVoltageChange(siz, state);
    }
  } else if (type === "ПЗ для ВЛ") {
    state.filteredSzTypes = szTypes.filter((szType) => szType.includes("ЗПЛ"));
    if (voltage) {
      handleVoltageChange(siz, state);
    }
  } else if (type === "ПЗ для ИВЛ") {
    state.filteredSzTypes = szTypes.filter((szType) => szType.includes("СИП"));
  } else if (type === "Наброс для ВЛ") {
    state.filteredSzTypes = szTypes.filter((szType) =>
      szType.includes("ЗНЛ-10")
    );
  }
}

// Функция фильтрации szTypes на основе напряжения ЭУ
export function handleVoltageChange(siz, state) {
  const { voltage, type } = siz;

  if (
    type === "Указатель напряжения" ||
    type === "Указатель напряжения для фазировки"
  ) {
    state.filteredSzTypes = state.filteredSzTypes.filter((szType) =>
      szType.includes(voltage)
    );
  } else if (type === "Штанга оперативная (универсальная)") {
    state.filteredSzTypes = state.filteredSzTypes.filter((szType) =>
      szType.includes(voltage)
    );
  } else if (type === "Комплект штанг для установки ПЗ") {
    state.filteredSzTypes = state.filteredSzTypes.filter((szType) =>
      szType.includes(voltage)
    );
  } else if (type === "КШЗ" || type === "КШЗ (с изолирующей штангой)") {
    state.filteredSzTypes = state.filteredSzTypes.filter((szType) =>
      szType.includes(voltage)
    );
  } else if (type === "ПЗ для РУ" || type === "ПЗ для ВЛ") {
    state.filteredSzTypes = state.filteredSzTypes.filter((szType) =>
      szType.includes(voltage)
    );
  }
}

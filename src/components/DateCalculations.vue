<template>
  <div>
    <!-- Этот компонент не содержит шаблона, так как он отвечает только за логику -->
  </div>
</template>

<script>
export default {
  name: "DateCalculations",
  methods: {
    setNextTestDate(siz) {
      if (!siz.testDate) return;

      const testDate = new Date(siz.testDate);
      let monthsToAdd = 0;

      switch (siz.type) {
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
          return;
      }
      // Увеличение месяца
      const nextTestDate = new Date(
        testDate.setMonth(testDate.getMonth() + monthsToAdd)
      );
      siz.nextTestDate = nextTestDate.toISOString().substr(0, 10); // Форматируем дату в формате YYYY-MM-DD для календаря
      this.setLastInspectDate(siz); // Установка текущей даты последнего осмотра
      this.setAutomaticNote(siz); // Автоматическое выставление примечания
    },
    setLastInspectDate(siz) {
      siz.lastInspectDate = new Date().toISOString().split("T")[0]; // Устанавливаем текущую дату в формате YYYY-MM-DD
    },
    setAutomaticNote(siz) {
      if (!siz.nextTestDate) {
        // Если дата следующего испытания не установлена
        siz.note = "Осмотрено";
        return;
      }
      const currentDate = new Date();
      const nextTestDate = new Date(siz.nextTestDate); // Дата в формате YYYY-MM-DD

      const oneMonthInMs = 30 * 24 * 60 * 60 * 1000; // Один месяц в миллисекундах
      const differenceInMs = nextTestDate - currentDate; // Разница в миллисекундах

      if (differenceInMs > oneMonthInMs) {
        siz.note = "Осмотрено, Испытано";
      } else if (differenceInMs <= oneMonthInMs && differenceInMs >= 0) {
        siz.note = "Необходимо отправить на испытания!";
      } else if (differenceInMs < 0) {
        siz.note = "Испытание просрочено!";
      }
    },
  },
};
</script>

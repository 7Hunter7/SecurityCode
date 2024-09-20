<template>
  <div>
    <!-- Компонент не имеет шаблона, так как отвечает за расчеты -->
  </div>
</template>

<script>
export default {
  name: "DateCalculations",
  props: {
    siz: {
      type: Object,
      required: true,
    },
  },
  methods: {
    setNextTestDate() {
      if (!this.siz.testDate) return;

      try {
        const testDate = new Date(this.siz.testDate);
        if (isNaN(testDate)) {
          throw new Error("Некорректная дата испытания");
        }

        let monthsToAdd = 0;

        switch (this.siz.type) {
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
            throw new Error("Неизвестный тип СИЗ");
        }

        testDate.setMonth(testDate.getMonth() + monthsToAdd);

        if (isNaN(testDate)) {
          throw new Error("Ошибка при расчете даты следующего испытания");
        }

        this.$emit("updateNextTestDate", testDate.toISOString().substr(0, 10));
        this.setLastInspectDate(); // Установка текущей даты последнего осмотра
        this.setAutomaticNote(); // Автоматическое выставление примечания
      } catch (error) {
        console.error("Ошибка в setNextTestDate:", error.message);
        alert(`Ошибка: ${error.message}`);
      }
    },

    setLastInspectDate() {
      const currentDate = new Date().toISOString().split("T")[0];
      this.$emit("updateLastInspectDate", currentDate); // Передаем дату последнего осмотра
    },

    setAutomaticNote() {
      if (!this.siz.nextTestDate) {
        this.$emit("updateNote", "Осмотрено");
        return;
      }

      const currentDate = new Date();
      const nextTestDate = new Date(this.siz.nextTestDate);

      if (isNaN(nextTestDate)) {
        console.error("Некорректная дата следующего испытания");
        return;
      }

      const oneMonthInMs = 30 * 24 * 60 * 60 * 1000;
      const differenceInMs = nextTestDate - currentDate;

      let note = "Осмотрено";

      if (differenceInMs > oneMonthInMs) {
        note = "Осмотрено, Испытано";
      } else if (differenceInMs <= oneMonthInMs && differenceInMs >= 0) {
        note = "Необходимо отправить на испытания!";
      } else if (differenceInMs < 0) {
        note = "Испытание просрочено!";
      }

      this.$emit("updateNote", note);
    },
  },
};
</script>

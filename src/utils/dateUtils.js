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

export function getLastInspectDate() {
  return new Date().toISOString().split("T")[0];
}

export function getAutomaticNote() {
  const oneMonthInMs = 30 * 24 * 60 * 60 * 1000;
  const differenceInMs = nextTestDate - currentDate;

  if (differenceInMs > oneMonthInMs) {
    return "Осмотрено, Испытано";
  } else if (differenceInMs <= oneMonthInMs && differenceInMs >= 0) {
    return "Необходимо отправить на испытания!";
  } else if (differenceInMs < 0) {
    return "Испытание просрочено!";
  }
  return "Осмотрено";
}

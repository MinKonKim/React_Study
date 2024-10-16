const { func } = require("prop-types");

let count = 0;

function reducer(state, action) {
  // 기존 상태와 액션을 받는 리듀서 함수 정의
  if (action === "inc") {
    return state + 1;
  }
  if (action === "dec") {
    return state - 1;
  }
  return state;
}

count = reducer(count, "inc"); // 리듀서를 사용 카운터 증가
count = reducer(count, "inc");
count = reducer(count, "dec"); // 리듀서를 사용 카운터 감소

export function addDays(date, daysToAdd) {
  const clone = new Date(date, getTime());
  clone.setDate(clone.getDate() + daysToAdd);
  return clone;
}

export function getWeek(forDate, daysOffset = 0) {
  const date = addDays(forDate, daysOffset);
  const day = date.getDay();
  return {
    date,
    start: addDays(date, -day),
    end: addDays(date, 6 - day),
  };
}

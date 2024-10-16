# 함수를 사용해 초기 상태 생성

useReducer에서도 최기화 인자를 두 번째 인자로 전달하는 것과 더불어 세 번째 인자로 초기화 함수를 전달 할 수 있다.
초기화 함수는 초기화 인자를 사용해 초기 상태를 생성

`const [state, dispatch] = useReducer(reducer, initArg, initFn);`

state(상태): 각 프로퍼티 현재 값 <br/>
dispatch 함수: 액션을 리듀서에게 전달 <br/>
reducer: 액션을 사용해 이전 상태로부터 새 상태를 만듦 <br/>
initAsrg(초기화 인자): 초기화 함수에게 전달될 값 <br/>
initFn(초기화 함수): 초기화 인자를 사용해 리듀서의 초기 상태를 생성 <br/>

useReducer는 2개의 원소가 들어있는 배열을 반환, 두 원소는 상태와 디스패치 함수이다. 

처음 호출한 경우 반환되는 상태는 초기화 함수의 반환값이고, 그 이후의 호출에서는 호출 시점의 상태다.

디스패치 함수를 사용해 리듀서에게 액션을 디스패치한다. 특정 useReducer 호출에 대해 리액트는 항상 같은 디스패치 함수를 반환할 것이다.

## 날짜와 주를 처리하는 유틸리티 함수 만들기

```
week = {
    date, // 특정날짜를 표현하는 자바스크립트 Date객체
    start,// 날짜가 포함된 주의 시작 날짜를 표현
    end // 날짜가 포함된 끝 날짜를 표현
}
```

<br/><br/>

```
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
```

getDate 함수는 자바스크립트 Date 객체의 getDay 메서드를 사용해 지정된 날짜의 요일 인덱스를 가져온다.<br/>
일요일은 0, 월요일은 1, ... ,토요일은 6이다

주의 시작 - 해당 날짜의 요일 인덱스만큼 현재 날짜에서 뺀다.<br/>
주의 끝 - 주의 시작으로부터 6일 후이므로 6에서 해당 날짜의 요일 인덱스를 뺀 만큼을 현재 날짜에 더한다.

![IMG_0326](https://github.com/user-attachments/assets/0ea49cdb-1063-47ae-bd4e-08b8a3019853)

## 요약

서로 연관된 여러 상태가 있다면, 리듀서를 사용해 상태를 변경할 수 있는 액션으 명확히 정의해야 할 지 고려해 봐야한다.<br/>
리듀서는 현재 상태와 액션을 받을 수 있는 함수다.<br/>
리듀서는 액션을 사용해 새로운 상태를 생성, 새 상태를 반환한다.<br/>

```
function reducer (state, action) {
    // action을 사용해 state(이전상태)로부터 새 상태 생성
    // 새 상태 반환
}
```

컴포넌트의 상태와 리듀서를 리액트가 관리하게 하려면 useReducer 훅을 호출
useReducer에게 리듀서와 초기 상태를 전달. <br/>현재 상태와 디스패치 함수를 포함하는 배열을 반환한다

```
const [state, dispatch] = useReducer(reducer, initialState) 
```

useReducer 훅이 최초로 호출될 떄 초기 상태를 생성하고 싶다면, 초기화 인자와 초기화 함수를 사용해 훅을 호출.<br/>
훅은 자동으로 초기화 인자를 초기화 함수에게 전달.<br/>
초기화 함수는 리듀서에게 사용할 초기 상태를 반환.

```
const [state, dispatch] = useReducer(reducer, initArg, initFunc)
```


dispatch 함수를 사용해 액션을 디스패치.
리액트는 현재 상태와 액션을 리듀서에게 전달. 
리액트는 리듀서가 반환하는 상태로 컴포넌트의 상태를 갱신, 상태가 달라지면 리액트가 컴포넌트를 다시 렌더링

`dispatch(action)`

컴포넌트가 useReducer를 호출할 때마다 리액트는 항상 동일한 디스패치 함수를 반환(만약 useReducer 호출 시점마다 반환되는 디스패치 함수가 달라지면, 프롭으로 전달하거나 다른 훅들의 의존성으로 디스패치 함수를 사용할 때 불필요한 재렌더링 발생 할 수 있다.)
# useRef 훅으로 컴포넌트 상태 관리

컴포넌트에서 저장된 값 대부분은 애플리케이션의 사용자 인터페이스에 직접표시

사용자가 사용하기 위한 것이 아닌 앱 메커니즘의 일부분으로만 변수를 사용할 때
제어되지 않는 입력으로 DOM form엘리먼트를 처리하는 경우, 참조 유지

어느 경우든, 사용자에게 이러한 값을 표시할 필요가 없으므로 값이 달라져도 자동으로 재렌더링이 일어나지 말아야 한다.

useState와 useRef를 통한 상태 관리 비교

## 재렌더링을 촉발하지 않고 상태를 갱신하는 방법

Counter 컴포넌트를 사용해 참조객체를 소개, 렌더링과 렌더링 사이에 상태를 유지하는 방법
useState 훅을 사용 시 상태 값 갱신 함수를 호출하면 일반적으로 재렌더링이 발생
useRef 훅을 사용하면 이런 UI 재렌더링 없이 상태 값을 갱신

## 상태 값을 갱신할 때 useState와 useRef 비교

![IMG_0334](https://github.com/user-attachments/assets/5cf226e3-3b50-422d-86cf-05a5a741321d)


```
import React, { useRef, useState } from "react";

function Counter() {
  const [count, setCount] = useState(1);
  const ref = useRef(1);

  const incCount = () => setCount((c) => c + 1);

  const incRef = () => ref.current++;

  return (
    <div className="App">
      <button onClick={incCount}>count: {count}</button>
      <hr />
      <button onClick={incRef}>ref.current: {ref.current}</button>
    </div>
  );
}
```
갱신 함수 호출 -> 상태변경 -> 재렌더링(o)
참조객체 반환 -> 상태값 저장, 
참조객체에 저장된 값을 변경 -> 재렌더링(x)

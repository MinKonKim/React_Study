# useTransition, useDeferredValue, SuspenseList 연습과 실험

## 동시성 렌더링 (Concurrent Rendering)
동시성 렌더링은 React에서 사용자 인터페이스(UI)를 보다 매끄럽게 업데이트하기 위한 기능입니다.
전통적인 렌더링에서는 작업이 한 번에 처리되지만, 동시성 렌더링은 긴 작업을 더 작은 단위로 나누어 처리합니다.
이를 통해 우선순위가 높은 작업(예: 사용자 입력, 애니메이션)을 먼저 처리하고, 우선순위가 낮은 작업(예: 데이터 렌더링)은 뒤로 미룰 수 있습니다.

**장점**:<br/>
느린 네트워크나 계산이 많은 작업에서도 UI가 막히지 않음.
사용자 경험(UX)을 개선하며, 더 빠르고 부드러운 인터페이스 제공.


---
## 동시성 렌더링과 useTransition, useDeferredValue
두 훅은 동시성 렌더링을 효과적으로 활용하기 위해 제공됩니다.

### useTransition
**역할**: <br/>
상태 업데이트를 "긴급한 작업"과 "덜 긴급한 작업"으로 구분할 수 있도록 돕는 훅.
긴급하지 않은 상태 업데이트(예: 리스트 필터링)를 뒤로 미루는 동시에 현재 작업을 우선 처리.
<br/>
**사용 방법:**
```javascript
const [isPending, startTransition] = useTransition();

const handleChange = (newValue) => {
  startTransition(() => {
    setState(newValue); // 긴급하지 않은 상태 업데이트
  });

return (
  <button onClick={handleClick}{...props}>
    {isPending && <Spinner/>
    {children}
  </button>
)
};
```
**사용 이유:**
사용자의 입력과 같은 긴급 작업을 먼저 처리.
부드러운 인터페이스 유지.<br/>

### useDeferredValue
**역할**: <br/>
상태 업데이트를 동기적으로 처리하되, 렌더링 시점만 지연시키는 훅.
긴급하지 않은 값이 업데이트되는 동안 UI를 최신 상태로 유지.<br/>

**사용 방법**:
```javascript

const deferredValue = useDeferredValue(value)||value; // 새 값이 렌더링을 지연시키면 이전 값을 반환
const isPending = deferredValue !== value // 지연된 값이 유효하지 않은 값인 경우 true가 되는 pending 플래그
useEffect(() => {
  console.log(deferredValue); // 값은 늦게 업데이트됨
}, [deferredValue]);

...

return(
  value?(
  <main>
    <ValueList
        value={value}
        isPending={isPending}
     >
     <Suspense fallback={<Spinner/>}>
        <ValuesDetail
           valueID = {deferredValue.id} // 새로운 값의 상세 정보를 기다리는 동안 이전 사용자의 상세 정보를 표시
           isPending = {isPending} // 현재의 정보가 오래된 정보라는 사실을 ValuesDetail에  알림
        >
        
     <Suspense>

  </main>
)
)
```
**사용 이유:**
검색 필터나 데이터 정렬 같은 작업에서 성능 최적화.
긴급하지 않은 값을 지연 처리함으로써 UI가 중단되지 않음.

## SuspenseList와 여러 개의 Fallback 관리
SuspenseList는 여러 Suspense 컴포넌트를 정리된 방식으로 렌더링하도록 관리합니다. 최신 React에서는 SuspenseList로 각 Suspense의 렌더링 순서를 제어할 수 있습니다.

**사용 방법**:
```javascript
import { Suspense, SuspenseList } from 'react';

<SuspenseList revealOrder="forwards" tail="collapsed">
  <Suspense fallback={<LoadingSpinner />}>
    <ComponentA />
  </Suspense>
  <Suspense fallback={<LoadingSpinner />}>
    <ComponentB />
  </Suspense>
  <Suspense fallback={<LoadingSpinner />}>
    <ComponentC />
  </Suspense>
</SuspenseList>
```
**옵션**:
1. **revealOrder**
  - forwards: 위에서 아래 순서대로 컴포넌트 렌더링.
  - backwards: 아래에서 위 순서로 렌더링.
  - together: 모든 Suspense를 동시에 보여줌.
2. **tail**
  - collapsed: 대기 중인 컴포넌트를 숨김.
  - hidden: 대기 중인 컴포넌트를 유지하되, 감춤.

## 동시성 모드 (Concurrent Mode)
**정의**:<br/>
동시성 모드는 React의 렌더링 방식을 향상시키는 기능입니다. React 18부터는 동시성 모드가 기본적으로 적용됩니다.
이를 통해 앱의 성능과 사용자 경험을 대폭 개선할 수 있습니다.

**특징**:<br/>
작업 우선순위를 동적으로 조정.
긴급한 작업(입력, 클릭)에 빠르게 반응.
멈추지 않는 UI를 제공.

**활용**:<br/>
동시성 모드는 자동으로 활성화되지만, useTransition, useDeferredValue, 그리고 Suspense와 같은 동시성 도구를 적절히 활용하여 최적화.

## 정리
React의 동시성 렌더링은 사용자 경험 개선을 목표로 하며, useTransition, useDeferredValue, SuspenseList 등의 도구로 구체적으로 구현됩니다.
React 18 이상에서 기본 제공되는 동시성 모드를 통해 효율적이고 부드러운 UI를 구축할 수 있습니다.
UI의 성능을 높이고 사용자 입력에 빠르게 반응하는 앱을 개발할 때 이 개념과 기능들을 적절히 활용하세요!

## 컴포넌트를 더 작은 조각으로 분리

- 컴포넌트를 더 큰 앱의 일부분으로 바라보기
- 페이지 UI 안에서 여러 컴포넌트를 조직화하기

## useReducer로 상태와 디스패치 공유

optional chanining(옵셔널,선택적 연산자)
:optional chaning연산자 (?.)는 객체 내의 key에 접근할 때 그 참조가 유효한지 아닌지 직접 명시하지 않고도 접근할 수 있는 연산자

?. 앞의 평가대상이 만약 nullish ( undefined 또는 null ) 일 경우 평가를 멈추고 undefined를 반환

장점 
1. if문을 줄여준다 
2. nullish연산자와 함께 쓰면 기본값 주기에 용이
3. 대괄호 표기법에도 옵셔널 체이닝이 가능
4. 존재하지 않을 수 있는 메서드를 호출할 때도 유용
5. 배열에도 사용 가능

주의
1. 존재하지 않아도 괜찮은 대상에만 적용.
 에러를 피하기 위해서 남용하다가 디버깅이 어려워질 수 있다.
 2.  ?.(optional chaining)앞에 오는 변수는 선언이 되어 있어야한다.

 ## 콜백 함수 재정의를 방지하기 위해 useCallback에게 함수  전달

 ### 프롭들을 통해 전달하는 함수에 의존
 ### useCallback 훅을 사용해 함수의 정체성 유지

- 이벤트 핸들러 함수가 자주 재생성되는 경우
useCallback을 사용하지 않으면 이벤트 핸들러 함수는 매번 새로운 인스턴스가 생성된다. 그러나 useCallback을 사용하면 함수가 처음 생성될 때 한 번만 생성되며, 나중에는 동일한 함수 인스턴스를 재사용하게 된다.
- 하위 컴포넌트에 props로 전달되는 함수가 자주 재생성되는 경우
React에서 props로 함수를 전달하는 경우, 해당 함수가 변경되면 하위 컴포넌트가 재렌더링된다. 따라서, useCallback을 사용하여 함수를 재사용하면 하위 컴포넌트의 재렌더링을 방지할 수 있다.
- 렌더링 최적화가 필요한 경우
useCallback을 사용하여 함수를 재사용하면, 렌더링 최적화를 수행할 수 있다. 이는 컴포넌트의 불필요한 재렌더링을 방지하고, 성능을 향상시킬 수 있다.

- 메모이제이션 이란?
이전에 계산한 값을 메모리에 저장해두고, 동일하게 다시 사용할 수 있는 곳에서 재사용하여 반복적으로 발생하는 계산의 리소스를 줄이는 기법
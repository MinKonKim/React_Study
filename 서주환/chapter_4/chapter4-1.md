# 부수효과 활용

### 리액트 
- 데이터를 UI로 변환
- 각 컴포넌트는 전체 사용자 인터페이스에 기여
- 엘리먼트 트리 구성, 이미 렌더링 된 내용과 비교 후 필요한 변경사항을 DOM에 적용
- 상태가 변경되면 과정을 반복 진행
- 갱신 항목을 효율적으로 결정, 스케줄링이 탁월

다른 API와 직접 상호작용 해야할 때, 어떤 방식으로든 외부 세계에 영향을 미치는 동작을 부수효과(side effect)라고 한다.

#### `일반적 부수효과`
1. 페이지 제목 명령형 방식 설정
2. setInterval이나 setTimeout 같은 타이머 작업
3. DOM에서 엘리먼트 너비, 높이, 위치 측정
4. 콘솔이나 다른 서비스 로그 남기기
5. 지역 저장소 값 기록,읽어오기
6. 서비스 데이터 읽어오기, 구독/취소

useEffect 훅을 제공, 부수 효과를 더 잘 제어, 컴포넌트 생명 주기와 부수효과를 더욱 잘 통합

useEffect 훅은 우리가 외부 세계와 안전하게 상호작용하는 관문.

##  useEffect API 탐색

과동하지 않는 방법으로 부수 효과 설정하는 과정

1. 매번 렌더링이 일어난 다음 부수 효과 실행 
2. 컴포넌트가 마운트 될 때만 부수 효과 실행 
3. 함수를 반환해서 부수 효과 정리
4. 의존 관계를 지정, 효과가 언제 실행될 지 제어

### 1. 
문서 제목은 문서 바디 엘리먼트의 일부가 아니기에 리액트에 의한 렌더링 되지 않는다.
그러나 window의 document 프로퍼티를 통해 제목에 접근할 수 있다.

`document.title = 'Hola';`

useEffect 훅으로 부수 효과를 명시적으로 나타낼 수 있다.

```
useEffect(() => {
document.title = 'Hola';
})
```

<br/><br/>

```
import React, { useEffect, useState } from 'react'

export default function SayHello () {
    const greetings = ["Hello", "Ciao", "Hola"]

    const [index, setIndex] = useState(0)
    useEffect(() => {
        document.title = greetings[index]
    })

    function updateGreeting () {
        setIndex(Math.floor(Math.random() * greetings.length))
    }
  return (
    <button onClick={updateGreeting}>Say Hi</button>
  )
}
```
이 컴포넌트는 배열에서 인사말을 선택하기 위해 무작위로 생성한 인덱스를 사용.
updateGreeting 함수가 setIndex를 호출할 때마다 컴포넌트를 재렌더링 한다.(인덱스 값이 변경되지 않을 경우엔 예외)

매번 렌더링을 수행한 다음 브라우저가 페이지를 다시 그린 후, useEffect에 전달된 효과 함수를 실행하고 효과 함수의 요청에 따라 페이지 제목을 갱신.

효과함수가 컴포넌트와 같은 영역 안에 있기에 컴포넌트 내 변수에 접근할 수 있다는 점을 유의.

두번째 인자 없이 useEffect 훅을 호출, 리액트는 매번 끝난 다음에 효과를 실행.

### 2.

```
import React, { useEffect, useState } from 'react'

export default function windowSize () {
    const [size, setSize] = useState(getSize())

    function getSize() {
        return {
            width: window.innerWidth,
            height: window.innerHeight
        }
    }
    
    useEffect(() => {
        function handleResize () {
            setSize(getSize())
        }
    window.addEventListener('resize', handleResize)
    }, [])
}  
  return (
    <p>Width: {size.width}, Height: {size.height}</p>
  )
```
사용자가 브라우저 크기를 변경할 때마다 핸들러 handleResize는 setSize를 호출해서 새로운 크기로 갱신
두번 째 인자는 의존 관계 목록을 위한 것. 
리액트는 컴포넌트가 효과를 호출한 마지막 시간 이후로 이 의존 관계 목록의 값이 변경됐는지 확인해서 효과를 실행할지 여부 결정. 
리스트를 빈 배열로 설정하면 리스트가 결코 변경되지 않고, 컴포넌트가 처음 마운트될 때만 효과가 딱 한 번 실행된다.

useEffect 훅에는 효과를 정리하기 위한 간단한 메커니즘이 포함되어 있다.
리액트는 효과를 정리해야 할 때 효과가 반환된 함수를 실행.

리액트는 컴포넌트를 언마운트할 때 정리 함수를 실행. 이 시점이 유일한 시점은 아니다.
재렌더링될 때마다 효과 함수를 실해아 하기 전 정리 함수를 호출한다.
컴포넌트를 호출할 때마다 useEffect 호출에 전달된 의존 관계 배열의 값에 대한 기록을 유지.
의존 관계 값 배열이 마지막 호출 이후 변경된 경우 -> 해당 효과 실행
값이 변경되지 않은 경우 -> 효과를 건너뛴다
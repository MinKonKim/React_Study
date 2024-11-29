# Context API 상태관리

## 1. Context API
:1) 앱에서 컴포넌트에게 props를 사용하지 않고 필요한 데이터(state)를 쉽게 공유할 수 있게 해주는 기능
앱의 모든 컴포넌트에서 사용할 수 있는 데이터를 전달할 때 유용하다 <br/><br/>
:2) 일반적으로 부모와 자식간 props를 날려 state를 변화시키는 것과는 달리 context api는 컴포넌트 간 간격이 없다. 즉, 컴포넌트를 건너띄고 다른 컴포넌트에서 state, function을 사용할 수 있다. 또한 redux의 많은 어려운 개념보다 Context api는 _Provider_, _Consumer_, _createContext_ 개념만 알면 적용가능하다.

- props가 아닌 Context API를 사용하는 상황

리액트에서 부모 컴포넌트에서 자식 컴포넌트에게 props를 통해 데이터를 전달.<br/>
그러나 중간에 여러 컴포넌트를 거쳐야 하거나 여러 컴포넌트에서 동일한 데이터를 필요로 하는 경우에는 props로만 해결하기 어렵다. 계속해서 propsdriling을 해야만 한다.<br/> (props drilling - 중첩된 여러 계층의 컴포넌트들에게 props를 전달해 주는 기능)
<br/>

Context API를 사용하면 중간에 있는 컴포넌트들에게 데이터를 전달하지 않아도 되므로 코드를 간결하게 만들 수 있다. <br/>
깊이 여부와 무관하게 데이터가 필요한 컴포넌트에서 직접 데이터를 가져올 수 있다.

## 2. Context API 사용하기

#### Context API를 통해 전달하는 데이터의 종류
- 테마 데이터 (라이트/다크모드)
- 사용자 데이터 (현재 인증된 사용자 정보)
- 언어 혹은 지역 데이터

#### Context API는 자주 업데이트할 필요가 없는 데이터에 적합하다.
- Context API에서 state값을 변경하면, Provider 컴포넌트를 사용하는 모든 컴포넌트들이 자동으로 리렌더링되기에 전역 상태 관리를 위한 도구가 아닌, 데이터를 쉽게 전달하고 공유하기 위한 목적으로 사용하는 것이 적합
- Context는 리액트에서 컴포넌트를 위한 전역 변수의 개념으로 인지하면 쉽다.

### 사용 방법

1. createContext 메서드를 사용하여 context 생성한다.
2. 생성한 context를 대상 컴포넌트에 값을 내려주기 위해서 Provider로 대상 컴포넌트를 감싼다.
3. Provider의 프로퍼티인 value에 전달할 데이터를 넣는다.
4. Provider의 value에 담은 데이터를 전달 할 때는, 2가지 방식으로 전달이 가능하다. Consumer 컴포넌트 또는 useContext라는 훅을 이용하는 법이다.

<br/>

- 예시 (Consumer 컴포넌트 사용)

```javascript
import { createContext } from ‘react’;

export const themeContext = createContext(전달할 데이터의 초기값);
export default function App() {
  return (
    <themeContext.Provider value={전달할 데이터}>
      <Theme />
    </themeContext.Provider>
  )
}

function Theme() {
  return (
    <themeContext.Consumer>
      {value => <div>{value}</div>}
    </themeContext.Consumer>
  )	
}
```

<br/>
- 예시 2 (useContext 훅 사용)

```javascript
import { createContext, useContext } from ‘react’;

export const themeContext = createContext(전달할 데이터의 초기값);
export default function App() {
  return (
    <themeContext.Provider value={전달 데이터}>
      <Theme />
    </themeContext.Provider>
  )
}

function Theme() {
  const theme = useContext(themeContext);
  return <div>{theme}</div> // Provider에서 value로 전달한 데이터 출력
}
```

![Screenshot 2024-11-28 at 03 16 47](https://github.com/user-attachments/assets/beb56b02-25ec-40c3-b76e-ec722313d772)

![Screenshot 2024-11-28 at 03 18 11](https://github.com/user-attachments/assets/577ff393-2392-4282-a132-83ce3acfc68f)

![Screenshot 2024-11-28 at 03 18 24](https://github.com/user-attachments/assets/0f41758a-e3b2-4ea9-bf99-d8bc9fcbf15b)

![Screenshot 2024-11-28 at 03 18 39](https://github.com/user-attachments/assets/cac60b87-c77c-43e2-ba65-00585503b76a)

![Screenshot 2024-11-28 at 03 18 52](https://github.com/user-attachments/assets/d794d10c-5eff-45b3-aae7-5bc3703cfd76)

<br/>

## 3. Context API와 Redux의 선택 기준

Context API와 Redux 사이의 선택은 프로젝트의 규모, 복잡성, 그리고 개발 팀의 선호도에 따라 달라질 수 있다. 단순한 상태 관리가 필요한 소규모 프로젝트의 경우 Context API가 더 적합할 수 있다.

왜냐하면 Context API는 리액트 내장 기능이며, 추가적인 라이브러리 없이 사용할 수 있기 때문이다. 반면, 복잡한 상태 관리와 미들웨어를 필요로 하는 대규모 프로젝트에서는 Redux가 더 적합할 수 있다.

Redux는 상태 업데이트의 일관성을 유지하고, 애플리케이션의 상태를 중앙에서 효과적으로 관리할 수 있는 강력한 도구를 제공한다. 하지만, Redux의 학습 곡선과 초기 설정 비용은 고려해야 할 중요한 요소다.

왜냐하면 Redux를 효과적으로 사용하기 위해서는 리덕스의 핵심 개념뿐만 아니라 리덕스 미들웨어, 리액트와의 연동 방법 등을 이해해야 하기 때문이다. 따라서, 프로젝트의 요구 사항과 개발 팀의 기술 스택을 고려하여 적절한 상태 관리 방식을 선택하는 것이 중요하다.


- Context api 예시
```javascript
import React, { createContext, useContext, useState } from 'react';

const MyContext = createContext();

function MyProvider({ children }) {
    const [state, setState] = useState('Hello, World!');
    return (
        <MyContext.Provider value={{ state, setState }}>
            {children}
        </MyContext.Provider>
    );
}

function MyComponent() {
    const { state, setState } = useContext(MyContext);
    return (
        <div>
            <p>{state}</p>
            <button onClick={() => setState('Hello, React!')}>Change</button>
        </div>
    );
}

function App() {
    return (
        <MyProvider>
            <MyComponent />
        </MyProvider>
    );
}
```

- Redux 예시

```javascript
import React from 'react';
import { createStore } from 'redux';
import { Provider, connect } from 'react-redux';

const initialState = { message: 'Hello, World!' };

function reducer(state = initialState, action) {
    switch (action.type) {
        case 'CHANGE_MESSAGE':
            return { ...state, message: 'Hello, Redux!' };
        default:
            return state;
    }
}

const store = createStore(reducer);

function MyComponent({ message, changeMessage }) {
    return (
        <div>
            <p>{message}</p>
            <button onClick={changeMessage}>Change</button>
        </div>
    );
}

const mapStateToProps = (state) => ({ message: state.message });
const mapDispatchToProps = (dispatch) => ({
    changeMessage: () => dispatch({ type: 'CHANGE_MESSAGE' })
});

const ConnectedComponent = connect(mapStateToProps, mapDispatchToProps)(MyComponent);

function App() {
    return (
        <Provider store={store}>
            <ConnectedComponent />
        </Provider>
    );
}
```
### Context API와 Redux의 비교

Context API와 Redux는 각각의 장단점이 있으며, 애플리케이션의 특성에 따라 적절한 상태 관리 도구를 선택하는 것이 중요하다.
<br/>
 Context API는 간단하고 직관적이지만, 상태가 복잡해지거나 여러 컨텍스트를 사용할 때 코드의 가독성과 유지보수성이 떨어질 수 있다. 
<br/>
반면, Redux는 상태 관리의 일관성을 유지하고, 상태 변경을 예측 가능하게 한다. 그러나 설정이 복잡하고, 보일러플레이트 코드가 많아질 수 있다.

|_특징_|_Context API_|_Redux_|
|------|---|---|
|설정|간단|복잡|
|가독성|낮음(상태복잡 시)|높음|
|상태관리|분산|중앙 집중식|
|보일러플레이트|적음|많음|
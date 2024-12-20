# Suspense로 코드 분할하기
## 학습 목표
> - 동적 임포트와 코드 분할의 필요성을 이해하고 적용할 수 있다.
> - React.lazy와 Suspense를 사용하여 효율적으로 컴포넌트를 로드할 수 있다.
> - 비동기 로딩 중 오류를 처리하는 Error Boundary의 역할과 구현 방법을 학습한다.
> - 실제 프로젝트에서 React.lazy와 Suspense를 사용하여 성능 최적화 및 사용자 경험을 개선할 수 있다.
## **import() 함수로 동적 임포트하기**
코드 분할의 핵심은 `import()`를 사용하여 필요한 모듈을 비동기로 가져오는 것입니다. 이를 통해 초기 로딩 시간을 줄이고, 애플리케이션의 성능을 최적화할 수 있습니다.

### 사용 이유:
- **성능 최적화**: 모든 코드를 한 번에 로드하지 않고, 사용자가 필요로 하는 시점에 필요한 코드만 로드하여 초기 로딩 속도를 개선합니다.
- **사용자 경험 향상**: 덜 중요한 코드의 로드를 지연시켜 사용자 인터페이스가 더 빠르게 반응하도록 만듭니다.
- **유지보수성 증가**: 코드가 독립된 청크로 분리되어 관리와 디버깅이 쉬워집니다.

### 예시 코드:
```javascript
// 기존의 정적 import
import MyComponent from './MyComponent';

// 동적 import
const MyComponent = () => import('./MyComponent');

MyComponent().then((module) => {
  const Component = module.default;
  // Component를 이용해 추가 로직 실행
});
```
`import()` 함수는 Promise를 반환하며, 이를 통해 필요한 모듈을 비동기로 가져올 수 있습니다.
코드 분할의 핵심은 `import()`를 사용하여 필요한 모듈을 비동기로 가져오는 것입니다.

### 예시 코드:
```javascript
// 기존의 정적 import
import MyComponent from './MyComponent';

// 동적 import
const MyComponent = () => import('./MyComponent');

MyComponent().then((module) => {
  const Component = module.default;
  // Component를 이용해 추가 로직 실행
});
```
`import()` 함수는 Promise를 반환하며, 이를 통해 필요한 모듈을 비동기로 가져올 수 있습니다.

---

## **React.lazy로 필요할 때 컴포넌트 적재하기**
`React.lazy`는 동적 임포트된 모듈을 React 컴포넌트로 변환해줍니다. 이를 통해 초기 로드 시점에 불필요한 컴포넌트를 제외하고, 실제 사용 시점에만 로드되도록 하여 성능을 최적화할 수 있습니다.

### 사용 이유:
- **성능 최적화**: 필요할 때만 컴포넌트를 로드함으로써 초기 번들 크기를 줄이고, 로드 시간을 단축합니다.
- **리소스 효율성**: 사용되지 않는 컴포넌트가 로드되지 않아 네트워크와 메모리 리소스를 절약할 수 있습니다.
- **사용자 경험 향상**: 중요한 UI를 우선적으로 렌더링하고, 덜 중요한 UI는 로드 중에 폴백 UI를 제공하여 사용자 경험을 유지합니다.

### 예시 코드:
```javascript
import React, { Suspense } from 'react';

const LazyComponent = React.lazy(() => import('./LazyComponent'));

function App() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <LazyComponent />
      </Suspense>
    </div>
  );
}

export default App;
```
위 코드에서 `LazyComponent`는 필요할 때만 적재되며, 로드 중에는 `Suspense`의 `fallback` UI가 렌더링됩니다. 이는 사용자 경험을 유지하면서도 성능을 최적화하는 데 유용합니다.
`React.lazy`는 동적 임포트된 모듈을 React 컴포넌트로 변환해줍니다.

### 예시 코드:
```javascript
import React, { Suspense } from 'react';

const LazyComponent = React.lazy(() => import('./LazyComponent'));

function App() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <LazyComponent />
      </Suspense>
    </div>
  );
}

export default App;
```
위 코드에서 `LazyComponent`는 필요할 때만 적재되며, 로드 중에는 `Suspense`의 `fallback` UI가 렌더링됩니다.

---

## **Suspense로 폴백 UI 지정하기**
`Suspense`는 `React.lazy`와 함께 사용할 수 있으며, 비동기로 로드되는 컴포넌트가 준비되지 않았을 때 보여줄 UI를 선언적으로 지정합니다. 이는 기존의 로딩 처리 방식에 비해 간결하고 선언적인 접근법을 제공합니다.

### 기존 방식과의 비교:
- **기존 방식**: 상태 관리(`useState`)와 `useEffect`를 사용하여 로딩 상태를 수동으로 처리해야 했습니다.
  ```javascript
  const [isLoading, setIsLoading] = useState(true);
  const [Component, setComponent] = useState(null);

  useEffect(() => {
    import('./MyComponent').then((module) => {
      setComponent(module.default);
      setIsLoading(false);
    });
  }, []);

  return isLoading ? <div>Loading...</div> : <Component />;
  ```
- **Suspense 방식**: `Suspense`를 사용하면 별도의 상태 관리 없이 `fallback` 속성으로 로딩 UI를 선언적으로 지정할 수 있습니다.
  ```javascript
  <Suspense fallback={<div>Loading components...</div>}>
    <LazyComponent />
  </Suspense>
  ```

### 주요 장점:
1. **코드 단순화**: 복잡한 상태 관리 없이 로딩 UI를 처리할 수 있습니다.
2. **선언적 UI**: 로딩 중의 상태와 준비된 상태를 더 명확하게 표현할 수 있습니다.
3. **유연성**: 다양한 비동기 로드 시나리오를 처리할 수 있으며, 다른 컴포넌트와 쉽게 결합 가능합니다.

### 주요 속성:
- `fallback`: 로드 중에 보여줄 UI를 지정하는 속성

### 예시 코드:
```javascript
<Suspense fallback={<div>Loading components...</div>}>
  <LazyComponent />
</Suspense>
```
위에서 `fallback`에 전달된 컴포넌트는 데이터나 자원이 준비되지 않았을 때 렌더링됩니다.
`Suspense`는 `React.lazy`와 함께 사용할 수 있으며, 비동기로 로드되는 컴포넌트가 준비되지 않았을 때 보여줄 UI를 선언적으로 지정합니다.

### 주요 속성:
- `fallback`: 로드 중에 보여줄 UI를 지정하는 속성

### 예시 코드:
```javascript
<Suspense fallback={<div>Loading components...</div>}>
  <LazyComponent />
</Suspense>
```
위에서 `fallback`에 전달된 컴포넌트는 데이터나 자원이 준비되지 않았을 때 렌더링됩니다.

---

## **lazy와 Suspense가 함께 작동하는 방식**
`React.lazy`와 `Suspense`는 비동기적으로 로드되는 컴포넌트를 관리하기 위해 함께 사용됩니다. 이를 통해 개발자는 사용자 경험을 유지하면서 코드 분할의 이점을 극대화할 수 있습니다.

### 실제 프로젝트에서 해결할 수 있는 문제:
1. **초기 로딩 성능 문제**:
   애플리케이션이 커질수록 초기 번들 크기가 커지는 문제가 발생합니다. `React.lazy`와 `Suspense`를 사용하면 주요 경로의 컴포넌트를 초기 로딩에서 제외하여 로딩 시간을 단축할 수 있습니다.

2. **지연 로딩으로 사용자 경험 개선**:
   예를 들어, 사용자가 특정 라우트를 방문할 때만 해당 페이지의 컴포넌트를 로드하도록 설정하면, 덜 중요한 컴포넌트 로드를 지연시켜 초기 화면을 빠르게 렌더링할 수 있습니다.

3. **동적 기능 활성화**:
   대규모 애플리케이션에서 특정 기능(예: 관리자 페이지)을 필요로 할 때만 컴포넌트를 로드하여 메모리 사용량과 네트워크 트래픽을 줄일 수 있습니다.

### 작동 원리:
1. `React.lazy`로 동적으로 컴포넌트를 선언
2. 컴포넌트가 로드될 때까지 `Suspense`가 폴백 UI를 표시
3. 컴포넌트 로드가 완료되면 실제 UI로 대체

### 예시 코드:
```javascript
const LazyAbout = React.lazy(() => import('./About'));
const LazyHome = React.lazy(() => import('./Home'));

function App() {
  return (
    <Suspense fallback={<div>Loading application...</div>}>
      <Switch>
        <Route path="/about" component={LazyAbout} />
        <Route path="/" component={LazyHome} />
      </Switch>
    </Suspense>
  );
}
```
위 코드에서는 `Suspense`가 라우트 전환 중에도 비동기 컴포넌트를 관리하여 사용자에게 원활한 전환 경험을 제공합니다.
`React.lazy`와 `Suspense`는 비동기적으로 로드되는 컴포넌트를 관리하기 위해 함께 사용됩니다.

### 작동 원리:
1. `React.lazy`로 동적으로 컴포넌트를 선언
2. 컴포넌트가 로드될 때까지 `Suspense`가 폴백 UI를 표시
3. 컴포넌트 로드가 완료되면 실제 UI로 대체

### 예시 코드:
```javascript
const LazyAbout = React.lazy(() => import('./About'));
const LazyHome = React.lazy(() => import('./Home'));

function App() {
  return (
    <Suspense fallback={<div>Loading application...</div>}>
      <Switch>
        <Route path="/about" component={LazyAbout} />
        <Route path="/" component={LazyHome} />
      </Switch>
    </Suspense>
  );
}
```
위 코드에서는 `Suspense`가 라우트 전환 중에도 비동기 컴포넌트를 관리합니다.

---

## **오류 경계로 선언적인 오류 폴백 UI 지정하기**

비동기 로드 중 오류가 발생했을 때, React의 `Error Boundary`를 사용하면 오류를 잡아내고 폴백 UI를 표시할 수 있습니다. 이는 사용자 경험을 보호하고 애플리케이션의 안정성을 향상시키는 데 매우 유용합니다.

### 사용자 경험 기여:
- **중단 없는 서비스 제공**: 오류 발생 시 전체 애플리케이션이 중단되지 않고 폴백 UI를 통해 사용자에게 문제를 안내할 수 있습니다.
- **명확한 오류 처리**: 사용자는 에러 메시지나 대체 화면을 통해 현재 상태를 인지할 수 있습니다.

### 코드 안정성 기여:
- **에러 격리**: 특정 컴포넌트에서 발생한 오류가 다른 컴포넌트로 전파되지 않도록 격리합니다.
- **디버깅 용이성**: `componentDidCatch`를 사용하여 오류 정보를 로그로 남길 수 있어 디버깅이 쉬워집니다.

### 오류 경계 구현:
```javascript
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

### Suspense와 함께 사용하기:
```javascript
function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<div>Loading...</div>}>
        <LazyComponent />
      </Suspense>
    </ErrorBoundary>
  );
}
```

오류 경계는 Suspense와 결합하여 더욱 견고한 에러 처리 방식을 제공합니다.
비동기 로드 중 오류가 발생했을 때, React의 `Error Boundary`를 사용하면 오류를 잡아내고 폴백 UI를 표시할 수 있습니다.

### 오류 경계 구현:
```javascript
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

### Suspense와 함께 사용하기:
```javascript
function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<div>Loading...</div>}>
        <LazyComponent />
      </Suspense>
    </ErrorBoundary>
  );
}
```
오류 경계는 Suspense와 결합하여 더욱 견고한 에러 처리 방식을 제공합니다.

---

### 핵심 요약
1. `import()`를 사용하여 코드를 동적으로 로드한다.
2. `React.lazy`와 `Suspense`를 조합하여 필요할 때 컴포넌트를 적재하고 폴백 UI를 제공한다.
3. `Error Boundary`를 통해 선언적으로 오류 처리를 구성한다.

위 내용을 기반으로 코드를 작성하고 실습해보세요!


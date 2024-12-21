# Suspense로 코드 분할하기
## 학습 목표

1. 동적 임포트와 코드 분할의 필요성을 이해하고 적용할 수 있다.
2. `React.lazy`와 `Suspense`를 사용하여 효율적으로 컴포넌트를 로드할 수 있다.
3. 비동기 로딩 중 오류를 처리하는 `Error Boundary`의 역할과 구현 방법을 학습한다.
4. 실제 프로젝트에서 `React.lazy`와 `Suspense`를 사용하여 성능 최적화 및 사용자 경험을 개선할 수 있다.



## import 함수를 사용해 코드를 동적으로 임포트하기

> `import()` 함수는 동적으로 자바스크립트 모듈을 불러올 수 있도록 설계된 기능입니다. 이를 통해 초기 번들 크기를 줄이고, 필요한 시점에만 코드를 로드? 할 수 있습니다. 이 방식은 성능 최적화와 사용자 경험 향상에 중요한 역할을 합니다.

### 주요 활용 사례

- **필요한 기능만 로드**: 초기 로딩 속도 개선
- **네트워크 비용 절감**: 자주 사용하지 않는 코드 지연 로드
- **유지보수성 증가**: 코드가 모듈화되고 독립적으로 관리 가능



#### - 버튼 클릭 시 자바스크립트 적재하는 웹 페이지 설정하기

```javascript
const loadScript = () => {
  import('./example.js').then((module) => {
    module.default();
  });
};

<button onClick={loadScript}>Load Script</button>
```

#### - 디폴트와 이름 붙인 익스포트 사용하기

```javascript
// example.js
export const namedExport = () => console.log('Named Export');
export default () => console.log('Default Export');

// main.js
import('./example.js').then((module) => {
  module.default();
  module.namedExport();
});
```
### 추가 개념 정리
- `import()` 함수와 정적 `import`의 차이점:
  `import()`는 동적 임포트를 지원하며 런타임 중 필요한 시점에 모듈을 불러올 수 있는 반면, 정적 `import`는 컴파일 시점에 모든 모듈을 번들에 포함합니다. 동적 임포트는 초기 로딩 속도를 개선하고, 정적 임포트는 타입 안정성과 정적 분석에 유리합니다.
- 동적 임포트의 단점:
  - 네트워크 요청이 많아질 수 있어 성능 최적화가 필요합니다.
  - 코드 스플릿팅이 과도하면 응답성이 떨어질 수 있습니다.
---

##  lazy와 Suspense를 사용해 컴포넌트를 동적으로 임포트하기


> `React.lazy`와 `Suspense`는 비동기 컴포넌트를 로드하는 간결한 방법을 제공합니다. 이 조합은 성능을 최적화하고, 사용자 경험을 개선하는 데 유용합니다.

### 주요 활용 사례

- **폴백 UI 제공**: 로드 중에 사용자에게 로딩 상태를 시각적으로 전달
- **라우팅 최적화**: 페이지 전환 시 필요한 컴포넌트만 로드


### - lazy 함수를 사용해 컴포넌트를 지연 컴포넌트로 변환하기

```javascript
const LazyComponent = React.lazy(() => import('./LazyComponent'));
```

### - Suspense 컴포넌트를 사용해 폴백 콘텐츠 지정하기

```javascript
<Suspense fallback={<div>Loading...</div>}>
  <LazyComponent />
</Suspense>
```
### 추가 개념 정리
- `React.lazy`와 `Suspense`의 역할 차이:
  `React.lazy`는 비동기적으로 컴포넌트를 불러오는 메커니즘을 제공하며, `Suspense`는 로딩 중에 사용자에게 보여줄 폴백 UI를 정의하는 데 사용됩니다. 두 기능은 결합되어 비동기 렌더링 환경을 지원합니다.
- Suspense의 `fallback` 속성:
  컴포넌트 로딩이 지연될 때 사용자 경험을 보호하기 위한 임시 UI를 지정하는 데 사용됩니다. 예를 들어, 로딩 애니메이션이나 메시지를 보여줄 수 있습니다.

---

## 오류 경계를 사용해 오류 잡아내기

> React의 `Error Boundary`는 컴포넌트 렌더링 중 발생하는 오류를 잡아내고, 사용자에게 대체 UI를 제공합니다. 이는 애플리케이션의 안정성과 디버깅 효율성을 크게 향상시킵니다.

### 주요 활용 사례

- **UI 중단 방지**: 특정 컴포넌트 오류가 전체 애플리케이션에 영향을 미치지 않도록 보호
- **오류 로그 기록**: 발생한 오류 정보를 기록하고 분석


### - 리액트 문서가 제공하는 오류 경계 예제

```javascript
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
```

#### - 우리 자신의 오류 경계 만들기

```javascript
function CustomErrorBoundary({ children }) {
  const [hasError, setHasError] = React.useState(false);

  const handleError = () => setHasError(true);

  if (hasError) {
    return <h1>Custom Error Boundary: Something went wrong.</h1>;
  }

  return (
    <ErrorBoundary onError={handleError}>
      {children}
    </ErrorBoundary>
  );
}
```

#### - 오류 복구하기

```javascript
class RecoverableErrorBoundary extends React.Component {
  // 이 클래스는 React의 오류 경계 기능을 확장하여 '복구 가능한 오류 경계'를 제공
  // 오류 발생 시 사용자에게 대체 UI를 제공하고, 복구를 시도할 수 있는 메커니즘을 포함합니다.
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  handleReset = () => {
    // 사용자가 'Try Again' 버튼을 클릭했을 때 오류 상태를 초기화합니다.
    // 이를 통해 UI를 정상적으로 리렌더링할 수 있도록 합니다.
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h1>Something went wrong.</h1>
          <button onClick={this.handleReset}>Try Again</button>
        </div>
      );
    }
    return this.props.children;
  }
}
```
- 이 클래스가 클래스형 컴포넌트로 작성된 이유는 React의 오류 경계(Error Boundary) 기능이 클래스 컴포넌트에서만 지원되기 때문입니다.
- 현재 React에서는 함수형 컴포넌트로 오류 경계를 구현할 수 없습니다.
- 따라서 오류 경계를 사용해야 할 경우, 클래스형 컴포넌트로 작성하는 것이 필수적입니다.

### RecoverableErrorBoundary 클래스 사용법
```javascript
import RecoverableErrorBoundary from './RecoverableErrorBoundary';
import SomeComponent from './SomeComponent';

function App() {
  return (
    <RecoverableErrorBoundary>
      <SomeComponent />
    </RecoverableErrorBoundary>
  );
}
```

### 추가 개념 정리

- `Error Boundary`와 `try-catch`의 차이점:
  `Error Boundary`는 React 컴포넌트 트리에서 발생하는 렌더링 오류를 포착하며, UI가 깨지지 않도록 대체 UI를 제공합니다. 반면, `try-catch`는 자바스크립트 코드 블록 내에서 동작하며, 비동기 작업과 함수 호출에서 발생하는 오류를 처리합니다.
- 비동기 코드에서 오류를 잡아내는 방법:
  - `Promise.catch` 또는 `async/await`와 `try-catch`를 사용하여 오류를 처리합니다.
  - React에서 비동기 코드와 관련된 오류는 `Error Boundary`가 직접 처리하지 못하므로, 로직 상에서 명시적으로 오류를 잡아야 합니다.

---

### 핵심 요약

1. `import()`와 동적 임포트를 활용해 코드 분할을 구현한다.
2. `React.lazy`와 `Suspense`를 결합하여 컴포넌트를 동적으로 적재하고 폴백 UI를 제공한다.
3. `Error Boundary`를 사용해 비동기 로딩 중 발생하는 오류를 처리하고 복구한다.




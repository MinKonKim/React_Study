# Suspense로 코드 분할하기

: 브라우저에서 앱의 모든 코드를 한꺼번에 적재하지 않고 필요할 때, 덩어리(chunk)로 코드를 적재하는 코드분할(code spliting)기술을 사용하면 적재할 코드의 양을 관리할 수 있다.

- tree shaking :
    1) 소스코드에서는 명시되어 있지만 실제로 프로그램 실행에 영향을 주지 않는 코드들을 빌드 단계 때 제거하는 것을 의미한다.
    2) 데드 코드(사용하지 않는 코드)를 제거하는 최적화 기술 나무를 흔들어서 죽은 잎사귀들을 떨어뜨리는 것처럼, 불필요한 코드를 제거한다는 의미한다.

```jsx
// math.js
export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;
export const multiply = (a, b) => a * b;

// main.js
import { add } from './math.js';

console.log(add(1, 2));
```

위 코드에서 tree shaking은 add 함수만 번들에 포함, subtract와 multiply 함수는 제거

성능 향상 효과

- 일반적으로 3~40% 번들 사이즈 감소
- 초기 로딩 시간 개선
- 메모리 사용량 감소

**대규모 애플리케이션에서 큰 효과를 볼 수 있다.**

<br><br>

## 정적 Import vs 동적 Import

````jsx
// 정적 Import - 항상 초기에 로드
import { heavyFeature } from './heavyFeature';

// 동적 Import - 필요할 때만 로드
const loadFeature = async () => {
  const { heavyFeature } = await import('./heavyFeature');
  heavyFeature();
};
````


### 1. 모달 컴포넌트 지연 로딩
````javascript
const Modal = () => {
  const [ModalComponent, setModalComponent] = useState(null);

  const openModal = async () => {
    // 버튼 클릭 시에만 모달 컴포넌트 로드
    const { default: Modal } = await import('./Modal');
    setModalComponent(() => Modal);
  };

  return (
    <>
      <button onClick={openModal}>모달 열기</button>
      {ModalComponent && <ModalComponent />}
    </>
  );
};
````

### 2. 라우트 기반 코드 스플리팅
````javascript
import { lazy, Suspense } from 'react';

// 각 페이지를 개별 청크로 분리
const HomePage = lazy(() => import('./pages/Home'));
const DashboardPage = lazy(() => import('./pages/Dashboard'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </Suspense>
  );
}
````

### 3. 조건부 기능 로딩
````javascript
const FeatureComponent = ({ isAdvanced }) => {
  const [AdvancedFeature, setAdvancedFeature] = useState(null);

  useEffect(() => {
    if (isAdvanced) {
      import('./AdvancedFeature')
        .then(module => setAdvancedFeature(() => module.default))
        .catch(err => console.error('고급 기능 로드 실패:', err));
    }
  }, [isAdvanced]);

  return (
    <div>
      {AdvancedFeature ? <AdvancedFeature /> : <BasicFeature />}
    </div>
  );
};
````

<br><br>

## >최신 트렌드

### 2. React.lazy와 Suspense 조합

````jsx
const LazyComponent = lazy(() => 
  // 로딩 지연 시뮬레이션
  new Promise(resolve => 
    setTimeout(() => resolve(import('./HeavyComponent')), 1000)
  )
);

function App() {
  return (
    <Suspense 
      fallback={<LoadingSpinner />}
      fallbackMinMs={300} // 최소 로딩 시간 설정
    >
      <LazyComponent />
    </Suspense>
  );
}
````
: React.lazy와 Suspense는 코드 스플리팅을 구현하는 React의 공식적인 방법 이 조합은 컴포넌트를 동적으로 로드하면서 로딩 상태를 우아하게 처리할 수 있게 해준다.

### 커스텀 지연 로딩 훅

````jsx
function useLazyComponent(importFunc) {
  const LazyComponent = lazy(() => {
    return new Promise(resolve => {
      // 최소 로딩 시간 설정
      setTimeout(() => {
        resolve(importFunc());
      }, 300);
    });
  });

  return LazyComponent;
}

// 사용 예시
const MyLazyComponent = useLazyComponent(() => import('./MyComponent'));
````


### 로딩 상태 최적화

````jsx
function DelayedSuspense({ children, fallback, delay = 500 }) {
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowFallback(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <Suspense fallback={showFallback ? fallback : null}>
      {children}
    </Suspense>
  );
}

// 사용 예시
function App() {
  return (
    <DelayedSuspense fallback={<LoadingSpinner />}>
      <LazyComponent />
    </DelayedSuspense>
  );
}
````

# 데이터 읽어오기와  Suspense 통합하기

## 데이터 읽어오기와 Suspense

### 프로미스 업그레이드
- 데이터를 가져오는 프로미스를 상태 관리와 통합하기 위해 래퍼 함수를 생성합니다.
```javascript
function wrapPromise(promise) {
  let status = "pending";
  let result;

  const suspender = promise.then(
    (res) => {
      status = "fulfilled";
      result = res;
    },
    (err) => {
      status = "rejected";

      result = err;
    }
  );
  return {
    read() {
      if (status === "pending") throw suspender;
      if (status === "rejected") throw result;
      return result;
    },
  };
}
```
### Suspense를 통한 상태 관리
- `Suspense`를 활용하여 데이터를 가져오는 동안 폴백 UI를 제공합니다.
```javascript
import React, { Suspense } from "react";

function DataDisplay() {
  const data = resource.read();
  return <div>{data}</div>;
}

function App() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <DataDisplay />
    </Suspense>
  );
}

export default App;
```
### 최대한 빨리 데이터 가져오기
-데이터를 미리 가져오려면 프로미스를 생성하는 시점을 가능한 한 앞당깁니다. 초기 렌더링 이전에 데이터 패칭을 시작하여 지연을 최소화합니다.
```javascript
const dataPromise = fetch("https://api.example.com/data").then((res) => res.json());
const resource = wrapPromise(dataPromise);

function DataDisplay() {
  const data = resource.read();
  return <div>{data.message}</div>;
}
```
### 새 데이터 읽어오기
- 새로운 데이터를 읽기 위해 사용자가 요청할 때마다 새로운 프로미스를 생성하고 Suspense를 다시 활용합니다.
```javascript
  let resource = wrapPromise(fetchData());

function refreshResource() {
  resource = wrapPromise(fetchData());
}

function App() {
  return (
    <div>
      <button onClick={refreshResource}>새로고침</button>
      <Suspense fallback={<div>로딩 중...</div>}>
        <DataDisplay />
      </Suspense>
    </div>
  );
}

export default App;
```
### 오류 복구하기
-오류가 발생했을 때 ErrorBoundary를 활용하여 사용자에게 적절한 메시지를 제공하거나 복구 작업을 실행합니다.
```javascript
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <button onClick={() => window.location.reload()}>다시 시도</button>;
    }
    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<div>로딩 중...</div>}>
        <DataDisplay />
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
```
---
## 리액트 쿼리와 Supense, 오류 경계를 함께 사용하는 방법
> React Query와 Suspense, ErrorBoundary를 결합하여 데이터 패칭과 오류 처리를 체계적으로 다룹니다. React Query의 캐싱 기능과 Suspense의 로딩 상태 관리를 함께 활용하여 더 나은 사용자 경험을 제공합니다.
### React Query와 Suspense 결합
- React Query로 데이터를 패칭하면서 Suspense를 사용하여 로딩 상태를 처리합니다.
```javascript
import { Suspense } from "react";
import { useQuery } from "react-query";

function fetchData() {
  return fetch("https://api.example.com/data").then((res) => res.json());
}

function DataDisplay() {
  const { data } = useQuery("data", fetchData);
  return <div>{data.message}</div>;
}

function App() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <DataDisplay />
    </Suspense>
  );
}

export default App;
```
### 오류 경계와 결합
- React Query로 데이터를 패칭할 때 발생하는 오류를 ErrorBoundary로 처리합니다.
```javascript
  function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<div>로딩 중...</div>}>
        <DataDisplay />
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
```
---
## Suspense와 함께 이미지 적재하기
- 이미지 로딩 상태를 Suspense와 React Query로 처리하여 대체 UI를 제공합니다. 이미지를 사전에 적재하여 사용자 경험을 최적화합니다.

### 이미지 로딩 처리 (책에 없는 내용 +)
- wrapPromise를 사용하여 이미지 로딩 상태를 관리합니다. 이 함수는 이미지가 로드되었는지 확인하고, Suspense와 통합하여 폴백 UI를 제공할 수 있도록 합니다.
```javascript
function fetchImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve(src);
  });
}

const imageResource = wrapPromise(fetchImage("/path/to/image.jpg"));

function ImageComponent() {
  const src = imageResource.read();
  return <img src={src} alt="Loaded" />;
}

function App() {
  return (
    <Suspense fallback={<div>이미지 로드 중...</div>}>
      <ImageComponent />
    </Suspense>
  );
}

export default App;
```
## React Query와 결합하여 이미지 사전 로딩
- React Query를 활용하여 이미지 데이터를 미리 패칭하고 Suspense를 활용해 로딩 상태를 처리합니다.
```javascript
function fetchImage(src) {
  return fetch(src).then((res) => res.blob()).then((blob) => URL.createObjectURL(blob));
}

function App() {
  const { data: imageSrc, isLoading } = useQuery("image", () => fetchImage("/path/to/image.jpg"));

  if (isLoading) return <div>이미지 로드 중...</div>;

  return <img src={imageSrc} alt="Loaded" />;
}

export default App;
```

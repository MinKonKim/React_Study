# useTransition, useDeferredValue, SuspenseList 연습과 실험


### useTransition : React 18에서 도입된 훅으로, UI 업데이트의 우선순위를 지정할 수 있게 해주는 기능.

- React 애플리케이션의 성능을 개선하고 사용자 경험을 향상시키는 강력한 도구이다. 특히 무거운 계산이나 큰 데이터셋을 다룰 때 매우 유용

---
<br/>

#### 기본 사용법

```jsx
function SearchComponent() {
  const [isPending, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = (e) => {
    // 즉시 업데이트 되어야 하는 부분
    setSearchQuery(e.target.value);

    // 덜 중요한 업데이트는 transition으로 감싸기
    startTransition(() => {
      // 무거운 검색 작업
      setSearchResults(searchItems(e.target.value));
    });
  };

  return (
    <div>
      <input value={searchQuery} onChange={handleSearch} />
      {isPending ? (
        <div>검색 중...</div>
      ) : (
        <SearchResults results={searchResults} />
      )}
    </div>
  );
}
```


#### useTransition의 주요 특징

1. **두 가지 반환값**
   - `isPending`: 현재 전환이 진행 중인지 여부
   - `startTransition`: 우선순위가 낮은 업데이트를 감싸는 함수

---
<br/><br/>


#### useTransition의 장점

1. **더 나은 사용자 경험**
   - 중요한 UI 업데이트가 차단되지 않음
   - 로딩 상태를 표시할 수 있음
   - 부드러운 전환 효과


<br/>

2. **성능 최적화**

```jsx
function ProductList() {
  const [isPending, startTransition] = useTransition();
  const [filter, setFilter] = useState('all');

  const handleFilterChange = (newFilter) => {
    // 필터 버튼 UI는 즉시 업데이트
    startTransition(() => {
      // 무거운 필터링 작업은 나중에
      setFilter(newFilter);
    });
  };

  return (
    <div>
      <FilterButtons onChange={handleFilterChange} />
      {isPending ? (
        <LoadingIndicator />
      ) : (
        <Products filter={filter} />
      )}
    </div>
  );
}
```




### useDeferredValue

값의 업데이트를 지연시켜 중요한 업데이트가 먼저 처리되도록 하는 React 훅. useTransition과 비슷하지만, 값 자체를 지연시킨다는 점이 다르다.

- 특히 실시간 검색, 데이터 시각화, 자동완성 등 무거운 연산이 필요한 기능을 구현할 때 매우 유용한 도구. useTransition과 함께 사용하면 더욱 세밀한 성능 최적화가 가능하다.

### 기본 사용법

```jsx
function SearchResults({ query }) {
  // 검색어의 지연된 버전 생성
  const deferredQuery = useDeferredValue(query);
  
  // 지연된 값으로 결과 계산
  const searchResults = useMemo(
    () => searchItems(deferredQuery),
    [deferredQuery]
  );

  return (
    <div>
      {/* 현재 검색어와 지연된 검색어가 다르면 로딩 표시 */}
      {query !== deferredQuery && <div>검색 중...</div>}
      <List items={searchResults} />
    </div>
  );
}
```


#### useDeferredValue의 장점

1. **성능 최적화**
   - UI 반응성 향상
   - 중요한 업데이트 우선 처리
   - 불필요한 렌더링 방지



#### 주의사항

1. **적절한 사용 시기**
   - 무거운 계산이 필요한 경우
   - 대량의 데이터 처리가 필요한 경우
   - UI 반응성이 중요한 경우
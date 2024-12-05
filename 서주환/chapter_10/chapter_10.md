# 서드파티 훅 사용하기

## useParams
: 리액트 라우터 라이브러리에서 제공하는 함수.
Route path와 일치하는 현재 URL에서 동적 매개변수의 키와 값을 반환하는 훅.

`예) 
url의 구조에서 ...url/path/1에서 1이 파라미터가 되는 것이다. 예를 들면 쇼핑몰에서 3번 게시글에 들어간다면 url이 www.shopping.com/items/3 이 되고, 7번 게시글에 들어간다면 www.shopping.com/items/7 의 형식이 되는 데이터에 따른 동적인 값이다. 그리고 이후 url에서 3 또는 7이라는 데이터를 뽑아와 api 통신을 하면 된다.`

```jsx
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import UseParams from "./components/useParams";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/useParams/:id" element={<UseParams />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
```
:id는 동적인 파라미터 값을 나타낸다.

<br/><br/>

 ## useSearchParams
: 현재 위치의 쿼리 매개변수(쿼리 문자열)에 대한 데이터를 읽고 수정하는데 사용하는 리액트 라우터 돔 라이브러리에서 제공하는 훅.

리액트 useState 훅과 유사하게 두 개의 변수를  제공하는데, 하나는 쿼리 매개변수의 데이터가 담겨있는 searchParams, 다른 하나는 searchParams를 수정하는 setSearchParams 함수이다.

searchParams 변수에는 현재 쿼리 문자열이 {key: value} 형태로 저장되어 있으며 get 메서드에 '키'를 전달하면 해당 키의 value를 읽어 출력해준다.

<br/><br/>

### *활용 예시*

#### 1. 검색기능 구현
- 서버에 get 요청을 보낼 때 사용자가 검색창에 입력한 데이터를 쿼리 문자열에 포함시켜 내보내면 검색 결과를 렌더링 하는데 활용할 수 있다.

```jsx
import * as React from "react";
import { useSearchParams } from "react-router-dom";

function SearchResults() {
  let [searchParams] = useSearchParams();
  const query = searchParams.get("q");

  // 검색어를 사용하여 검색 결과를 가져오는 로직 작성
  return (
    <div>
      <h1>Search Results</h1>
      <p>Showing results for: {query}</p>
      {/* 검색 결과를 렌더링하는 로직 */}
    </div>
  );
}
```

#### 2. 필터링 및 정렬
- 사용자가 선택한 카테고리에 대한 데이터를 쿼리문자열의 값으로 전달하여 서버에 데이터를 요청하면 해당 기준에 따라 정렬된 데이터를 불어올 수 있도록 로직을 구성할 수 있다.

```jsx
import * as React from "react";
import { useSearchParams } from "react-router-dom";

function ProductList() {
  let [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category");
  const sortBy = searchParams.get("sort");

  // 필터링 및 정렬된 상품 목록을 가져오는 로직 작성

  function handleCategoryChange(event) {
    setSearchParams({ category: event.target.value });
  }

  function handleSortChange(event) {
    setSearchParams({ sort: event.target.value });
  }

  return (
    <div>
      <h1>Product List</h1>
      <div>
        <label>
          Category:
          <select value={category} onChange={handleCategoryChange}>
            <option value="fruits">Fruits</option>
            <option value="vegetables">Vegetables</option>
          </select>
        </label>
      </div>
      <div>
        <label>
          Sort By:
          <select value={sortBy} onChange={handleSortChange}>
            <option value="price">Price</option>
            <option value="name">Name</option>
          </select>
        </label>
      </div>
      {/* 필터링된 및 정렬된 상품 목록을 렌더링하는 로직 */}
    </div>
  );
}
```

#### 3.공유 URL 생성
- searchParams는 현재 위치에 대한 쿼리 문자열 정보를 가지고 있는 변수, 해당 변수의 데이터를 toString() 매서드를 사용하여 문자열로 변환.
window.location.origin은 도메인 주소를 가지고 있으므로 이 둘을 합치면 온전한 URL을 생성할 수 있다.

```jsx
import * as React from "react";
import { useSearchParams } from "react-router-dom";

function ShareablePage() {
  let [searchParams] = useSearchParams();

  // URL 검색 매개변수를 기반으로 특정 상태를 설정하는 로직 작성

  const handleShareButtonClick = () => {
    const url = `${window.location.origin}?${searchParams.toString()}`;
    navigator.clipboard.writeText(url); //-> 클립보드에 url 을 복사한다.
    // URL을 클립보드에 복사하거나 공유하는 로직
  };

  return (
    <div>
      <h1>Shareable Page</h1>
      <p>This is a shareable page with customizable parameters.</p>
      <button onClick={handleShareButtonClick}>Copy URL to Share</button>
    </div>
  );
}
```

## useNavigate
1-현재 위치에서 다른 경로로 이동하는 기능을 제공하는 리액트 라우트 돔 라이브러리에서 제공하는 훅. <br/>
컴포넌트 내부에서 사용할 수 있으며 현재 위치에서 다른 경로로 이동하는 기능을 제공하는 함수를 반환한다. <br/>
2-React Application 에서 서버의 상태를 불러오고, 캐싱하며, 지속적으로 동기화하고 업데이트 하는 작업을 도와주는 라이브러리이며, Hook 을 사용하여 React Component 내부에서 자연스럽게 서버의 데이터를 사용할 수 있는 방법을 제공

- 사용목적: 프로그래매틱 네비게이션
- 사용방식: 훅으로 사용
- 주요 특징:
   1.함수 형태로 호출, 페이지 이동
   1. 조건부 라우팅이나 복잡한 네비게이션 로직에 젃합
   2. 뒤로가기, 리다이렉트 등 추가 기능 제공

```jsx
import { useNavigate } from 'react-router-dom';

function Component() {
  const navigate = useNavigate();
  
  const handleClick = () => {
    // 조건부 네비게이션
    if (someCondition) {
      navigate('/about');
    }
    
    // 뒤로가기
    navigate(-1);
    
    // 리다이렉트 옵션 설정
    navigate('/login', { replace: true });
  };

  return <button onClick={handleClick}>이동하기</button>;
}
```

- 사용시기: 
    1. 특정 조건에 따른 페이지 이동이 필요할 때
    2. 폼 제출 후 리다이렉트
    3. 프로그래밍저긍로 페이지 이동이 필요한 경우
    4. 뒤로가기나 히스토리 조작이 필요한 경우

<br/><br/>

```jsx

// 특정 경로로 이동
navigate('/home');

// 특정 변수에 해당하는 경로로 이동(id 변수를 동적으로 받는 예시)
navigate(`/page/${id}`);

// 현재 페이지를 대체하며 이동 => 뒤로 가기했을 때 이전 페이지로 갈 수 없음(메인인 '/'페이지로 이동)
navigate('/login', { replace: true });

// 상대 경로로 이동
navigate('../sibling');

// 뒤로 가기
navigate(-1);

// 앞으로 가기
navigate(1);
```

<br/><br/>

### Link 태그
: 현재 위치에서 다른 경로로 이동하는 기능을 제공하는 리액트 라우트 돔 라이브러리에서 제공하는 태그. <br/>
클릭 이벤트가 발생했을 때 페이지를 이동시키는 역할을 한다. 

<br/>

- 사용목적: 선언적 네비게이션
- 사용방식: JSX 컴포넌트로 사용
- 주요 특징:
   1. 사용자가 클릭할 수 있는 실제 링크 요소($<a>$ 태그)를 생성
   2. SEO에 더 친화적
   3. 브라우저 기본 네비게이션 기능 지원

```jsx
import { Link } from 'react-router-dom';

function Component() {
  return <Link to="/about">소개 페이지로</Link>;
}
```

- 사용시기:
    1. 단순한 페이지 이동 필요 시
    2. 사용자가 직접 클릭하여 이동하는 경우
    3. SEO가 중요한 페이지에서 사용

## React-Query
: 리액트 쿼리는 서버 상태 관리를 위한 강력한 라이브러리입니다. 기존 상태 관리 도구들(Redux, Recoil, Context API, Zustand 등)이 클라이언트 상태 관리에 중점을 둔 것과 달리, 리액트 쿼리는 서버 데이터 관리에 특화되어 있습니다.

:

#### <주요 특징>

1. 캐싱

```jsx
// 기본적인 쿼리 사용 예시
const { data, isLoading } = useQuery({
  queryKey: ['todos'],
  queryFn: fetchTodoList,
  staleTime: 5000,      // 데이터가 'fresh'상태로 유지되는 시간
  cacheTime: 300000,    // 캐시가 유지되는 시간
});
```

2. 자동 백그라운드 데이터 갱신

```jsx
// 자동 갱신 설정
const { data } = useQuery({
  queryKey: ['todos'],
  queryFn: fetchTodoList,
  refetchInterval: 1000, // 1초마다 자동 갱신
});
```

3. 데이터 변이(Mutation)처리

```jsx
const mutation = useMutation({
  mutationFn: (newTodo) => {
    return axios.post('/todos', newTodo);
  },
  onSuccess: () => {
    // 캐시 무효화 및 쿼리 재실행
    queryClient.invalidateQueries({ queryKey: ['todos'] });
  },
});
```

<br/>

- ### 장점
  
  #### 1. 서버 상태 관리 최적화
   - 캐싱
   - 중복 요청제거
   - 백그라운드 데이터 업데이트

  #### 2. 개발자 경험 향상
   - 직관적인 API
   - typescript 지원
   - devtools 지원
  
  #### 3. 성능 최적화
   - 자동 garbage 컬렉션
   - 메모리 관리
   - 네트워크 요청 최적화

### 활용 예시

#### 1. 데이터 페칭 with 로딩/에러 처리

```typescript
function TodoList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['todos'],
    queryFn: async () => {
      const response = await axios.get('/api/todos');
      return response.data;
    },
  });

  if (isLoading) return <div>로딩중...</div>;
  if (error) return <div>에러가 발생했습니다</div>;

  return (
    <ul>
      {data.map((todo) => (
        <li key={todo.id}>{todo.title}</li>
      ))}
    </ul>
  );
}
```

#### 2. 무한 스크롤 구현

```typescript
function InfiniteScrollList() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['projects'],
    queryFn: ({ pageParam = 1 }) => 
      fetchProjects(pageParam),
    getNextPageParam: (lastPage) => 
      lastPage.nextPage ?? undefined,
  });

  return (
    <div>
      {data.pages.map((group, i) => (
        <React.Fragment key={i}>
          {group.projects.map((project) => (
            <div key={project.id}>{project.name}</div>
          ))}
        </React.Fragment>
      ))}
      <button
        onClick={() => fetchNextPage()}
        disabled={!hasNextPage || isFetchingNextPage}
      >
        {isFetchingNextPage
          ? '로딩중...'
          : hasNextPage
          ? '더 보기'
          : '더 이상 데이터가 없습니다'}
      </button>
    </div>
  );
}
```

1. **쿼리 키 구조화**

```typescript
// 좋은 예시
const { data: user } = useQuery({
  queryKey: ['user', userId],
  queryFn: () => fetchUser(userId),
});

// 필터링이 있는 경우
const { data: todos } = useQuery({
  queryKey: ['todos', { status, priority }],
  queryFn: () => fetchTodos({ status, priority }),
});
```

2. **에러 바운더리와 함께 사용**

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      suspense: true,
    },
  },
});
```

>참고 블로그 : 1) https://tech.kakaopay.com/post/react-query-1/
2)https://maintainhoon.vercel.app/blog/post/react_query

<br/><br/>

## useMutation
: React Query 에서 제공하는 훅으로, 데이터 변이(Mutation) 작업을 처리하는 데 사용된다. 데이터 변이는 주로 서버에 데이터를 생성, 업데이트, 삭제하는 작업을 의미한다. <br/>
: 서버 상태 변경 작업을 매우 효율적으로 관리할 수 있게 해주며, 복잡한 비동기 로직을 단순화하고 안정적으로 처리할 수 있게 해줍니다.

<br/>

#### <주요 특징>

1. 비동기 상태 관리
  - 로딩, 에러, 성공 상태를 자동으로 관리
  - Mutation 진행 상태를 실시간으로 추적
2. 자동 에러 처리
  - 네트워크 오류나 서버 에러를 자동으로 처리
  - 재시도 로직 내장
3. 낙관적 업데이트(Optimistic Update)지원
  - 서버 응답 전에 UI를 먼저 업데이트
  - 실패시 자동 롤백

<br/>

```jsx
function TodoApp() {
  const mutation = useMutation({
    mutationFn: (newTodo) => {
      return axios.post('/api/todos', newTodo);
    },
    onSuccess: (data) => {
      console.log('할일이 성공적으로 추가되었습니다:', data);
      // 캐시 무효화 및 쿼리 재실행
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
    onError: (error) => {
      console.error('에러 발생:', error);
    }
  });

  const handleSubmit = (todo) => {
    mutation.mutate(todo);
  };

  return (
    <div>
      {mutation.isLoading ? (
        '추가 중...'
      ) : (
        <>
          {mutation.isError ? (
            <div>에러 발생: {mutation.error.message}</div>
          ) : null}

          {mutation.isSuccess ? <div>할일이 추가되었습니다!</div> : null}
        </>
      )}
    </div>
  );
}
```


<br/>

### *활용 예시*

### 1. 낙관적 업데이트 구현

```typescript
const mutation = useMutation({
  mutationFn: updateTodo,
  onMutate: async (newTodo) => {
    // 진행 중인 refetch 취소
    await queryClient.cancelQueries({ queryKey: ['todos'] });

    // 이전 값 저장
    const previousTodos = queryClient.getQueryData(['todos']);

    // 낙관적으로 캐시 업데이트
    queryClient.setQueryData(['todos'], (old) => [...old, newTodo]);

    // context 객체 반환
    return { previousTodos };
  },
  onError: (err, newTodo, context) => {
    // 에러 발생 시 이전 상태로 롤백
    queryClient.setQueryData(['todos'], context.previousTodos);
  },
  onSettled: () => {
    // 완료 후 데이터 리프레시
    queryClient.invalidateQueries({ queryKey: ['todos'] });
  },
});
```

<br/>

### 2. 여러 뮤테이션 연계 처리

```typescript
const mutation = useMutation({
  mutationFn: async (data) => {
    // 순차적 처리
    const result1 = await firstMutation(data);
    const result2 = await secondMutation(result1);
    return result2;
  },
  onSuccess: (data, variables, context) => {
    // 연관된 쿼리들 무효화
    queryClient.invalidateQueries({ queryKey: ['todos'] });
    queryClient.invalidateQueries({ queryKey: ['user-stats'] });
  }
});
```

<br/>

1. **타입스크립트와 함께 사용**

```typescript
type Todo = {
  id: number;
  title: string;
  completed: boolean;
};

const mutation = useMutation<Todo, Error, { title: string }>({
  mutationFn: (newTodo) => {
    return axios.post<Todo>('/api/todos', newTodo);
  }
});
```

<br/>

2. **에러 처리 강화**

```typescript
const mutation = useMutation({
  mutationFn: updateTodo,
  retry: 3,
  retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  onError: (error) => {
    if (error.response?.status === 401) {
      // 인증 에러 처리
      navigate('/login');
    }
  }
});
```

## 데이터 읽어오기

- 새 db.json 파일 만들기
- json-server 패키지를 사용해 JSON 서버 설정하기
- 서버에서 데이터를 읽어오면서 사용자 목록을 표시하는 컴포넌트 작성하기
- 효과 안에서 async와 await를 사용할 때 주의사항

### 새 db.json 파일 만들기

```
// static.json
{
    days: [/* 요일 이름들 */]
    session:[*/ 세션 이름들 */]
}
```
나중에는 POST 및 PUT 요청을 보내서 데이터베이스 파일을 갱신.
create-react-app 개발 서버는 src폴더 안에 있는 파일이 변경될 때마다 재시작한다.
db.json 파일을 src 폴더 밖에 두면 새로운 예약 가능 자원을 추가하고 새 예약을 만들어서 데이터 파일 갱신을 테스트할 때 불필요한 개발 서버 재시작을 방지할 수 있다.

### JSON 서버 설정
json-server npm 패키지 사용

JSON 데이터를 mock REST API로 제공하는 아주 편리하고 쉬운 방법이다.

### useEffect 훅 안에서 데이터를 읽어오기

리액트가 렌더링 '다음에' 효과 함수를 호출하기 때문에,  첫 번째 렌더링 시에는 데이를 사용할 수 없다. 초기값을 빈 사용자를 목록으로 설정하고, 적재 중 상태를 위한 폴백 UI로 새 spinner 컴포넌트를 반환

```
import { useEffect, useState } from "react";

export default function UserPicker() {
  const [users, setUsers] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3001/user")
      .then((resp) => resp.json())
      .then((data) => setUsers(data));
  }, []);

  if (users === null) {
    return <Spinner />;
  }

  return (
    <select>
      {users.map((u) => (
        <option key={u.id}>{u.name}</option>
      ))}
    </select>
  );
}
```

1. 리액트가 컴포넌트를 호출
2. useState 호출이 users 변수를 null로 설정
3. useEffect 호출이 리액트에게 데이터 읽기 효과 함수를 등록
4. users 변수가 null이므로 컴포넌트가 스피너 아이콘을 반환
5. 리액트가 효과를 실행, 서버에 데이터 요청
6. 데이터가 도착하면 효과 함수는 setUsers 갱신 함수를 호출, 재렌더링을 촉발
7. 리액트가 컴포넌트 호출
8. useState 호출이 users 변수를 반환된 사용자 목륵으로 설정
9. useEffect에 대한 빈 의존 관계 배열, 즉 []이 변경되지 않았으므로 훅 호출은 효과를 재등록하지 않는다
10. users 배열엔 4개의 원소가 들어있다(null이 아님) 드롭다운 UI 반환

이렇게 데이터를 읽어오는 방식, 즉 컴포넌트가 데이터 요청을 시작하기 전에 렌더링을 수행하는 방식을 렌더링 시 읽기(fetch on render)라 한다.

의ㄴ 관계 배열에 포함 => 지ㅇ한 의존 관계 값이 변경될 때마다 리액트가 효과 함수를 실행
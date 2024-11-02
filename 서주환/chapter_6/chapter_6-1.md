# 애플리케이션 상태 관리

# 자식 컴포넌트에게 공유상태 전달

여러 컴포넌트가 같은 데이터를 사용할 때, 가장 명시적으로 공유하는 방법은 부모에서 자식으로 전달하는 프롭을 통해 공유할 상태를 전달한다.

```
import React, { useState } from "react";
import { ColorChoiceText } from './ColorChoiceText';
import {ColorPickers} from './ColorPickers'
import { ColorSample } from './ColorSample';

export default function Colors() {
  const availableColors = ["skyblue", "goldenrod", "teal", "coral"];

  const [color, setColor] = useState(availableColors[0]);

  return (
    <div className="colors">
      <ColorPickers
       colors={availableColors}
       color={color}
       setColor={setColor}
       />
       <ColorChoiceText color={color}/>
       <ColorSample color={color} />
    </div>
  );
}
```

## 부모 컴포넌트로부터 프롭을 통해 상태 받기

![IMG_0347](https://github.com/user-attachments/assets/40a72294-24bf-45e4-ad0c-0d57c52a866f)

## 부모로부터 갱신 함수 프롭 받기

![IMG_0348](https://github.com/user-attachments/assets/c8e5b500-703a-4562-9d68-b7aaa28f6034)

## 컴포넌트를 더 작은 조각으로 분리

- 컴포넌트를 더 큰 앱의 일부분으로 바라보기
- 페이지 UI 안에서 여러 컴포넌트를 조직화하기

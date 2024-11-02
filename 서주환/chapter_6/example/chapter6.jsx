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

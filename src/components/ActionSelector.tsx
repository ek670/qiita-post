import { useState } from "react";
import { GetItemsInput } from "./GetItemsInput";

export const actions = ["条件に一致する記事を作成日時の降順で返します"];

export const ActionSelector = () => {
  console.log("render ActionSelector");

  const [action, setAction] = useState(actions[0]);

  const selectAction = (e: { target: { value: string } }) => {
    setAction(e.target.value);
  };

  return (
    <>
      <div className="block">
        <h3 className="title">検索種別</h3>
        {actions.map((item) => {
          return (
            <div key={item}>
              <input id={item} type="radio" value={item} onChange={selectAction} checked={item === action} />
              <label htmlFor={item}>{item}</label>
            </div>
          );
        })}
      </div>
      {action === actions[0] && <GetItemsInput action={action} />}
    </>
  );
};

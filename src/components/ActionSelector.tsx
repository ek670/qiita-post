import { useState } from "react";
import { InputForm } from "./InputForm";

export const actions = [
  "条件に一致する記事の一覧を作成日時が新しい順で返します",
  "その他",
];

export const ActionSelector = () => {
  console.log("render ActionSelector");

  const [action, setAction] = useState(actions[0]);

  const selectAction = (e: { target: { value: string } }) => {
    setAction(e.target.value);
  };

  return (
    <>
      <div className="block">
        <h2 className="title">Select Action</h2>
        {actions.map((item) => {
          return (
            <div key={item}>
              <input
                id={item}
                type="radio"
                value={item}
                onChange={selectAction}
                checked={item === action}
              />
              <label htmlFor={item}>{item}</label>
            </div>
          );
        })}
      </div>
      {action === actions[0] && <InputForm action={action} />}
    </>
  );
};

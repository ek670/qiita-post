import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { queryParams } from "../model/ParamsToGetItems";

export const GetItemsInput = () => {
  console.log("render Input component");

  const [seachParams] = useSearchParams();

  const [state, setState] = useState(
    // 定義済みのクエリ項目設定からstateのオブジェクトを生成する
    Object.fromEntries(queryParams.map((p) => [p.name, seachParams.get(p.name) || p.defaultValue]))
  );

  const handleInput = (e: { target: { name: string; value: string } }) => {
    // if (queryParams.filter((v) => v.name === e.target.name).length != 1) return;

    for (const p of queryParams) {
      if (p.name !== e.target.name) continue;

      if (p.isNum) {
        if (e.target.value == "") e.target.value = p.min ? p.min.toString() : "0";

        // 最小値が存在し入力値がそれを下回っているなら最小値で上書きする
        if (p.min && parseInt(e.target.value) < (p.min || 0)) e.target.value = (p.min || 0).toString();

        if (p.max && parseInt(e.target.value) > (p.max || 0)) e.target.value = (p.max || 0).toString();
      }

      console.log("handleInput", { ...state, [e.target.name]: e.target.value });

      setState({ ...state, [e.target.name]: e.target.value });
    }
  };

  const navigateFunction = useNavigate();

  // Resutページに遷移しAPIとクエリパラメータを渡す
  const showResult = () =>
    navigateFunction(
      `/result?${Object.keys(state)
        .map((key) => `${key}=${state[key]}`)
        .join("&")}`
    );

  return (
    <div className="block">
      {/* <h3 className="title">検索条件</h3> */}
      <div className="form">
        <table className="table">
          <tbody>
            {queryParams.map((p) => (
              <tr key={p.name} className="tr">
                <th className="th">{p.th}</th>
                <td className="td">
                  <input
                    className="param"
                    type={p.isNum ? "number" : "text"}
                    name={p.name}
                    value={state[p.name]}
                    onChange={handleInput}
                    placeholder={p.placeholder}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div>
          <button onClick={showResult}>結果を取得する</button>
        </div>
      </div>
    </div>
  );
};

import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { queryParams } from "../model/ParamsToGetItems";

export const GetItemsInput = () => {
  console.log("render Input component");

  const [seachParams] = useSearchParams();

  /** クエリパラメータからオブジェクトを生成する */
  const getParamsObj = () => Object.fromEntries(queryParams.map((p) => [p.name, seachParams.get(p.name) || p.defaultValue]));

  const [state, setState] = useState(getParamsObj());

  const [searchParams] = useSearchParams();

  useEffect(
    () => {
      console.log(`useEffect input`);
      setState(getParamsObj());
    },
    queryParams.map((p) => searchParams.get(p.name))
  );

  const handleInput = (e: { target: { name: string; value: string } }) => {
    const p = queryParams.find((v) => v.name == e.target.name);
    if (p == undefined) return;

    // if (p.isNum && e.target.value != "") {
    //   // 最小値が存在し入力値がそれを下回っているなら最小値で上書きする
    //   if (p.min && parseInt(e.target.value) < (p.min || 0)) e.target.value = (p.min || 0).toString();

    //   if (p.max && parseInt(e.target.value) > (p.max || 0)) e.target.value = (p.max || 0).toString();
    // }

    console.log("handleInput", { ...state, [e.target.name]: e.target.value });

    setState({ ...state, [e.target.name]: e.target.value });
  };

  const navigateFunction = useNavigate();

  /** Resutページに遷移しAPIとクエリパラメータを渡す */
  const showResult = () =>
    navigateFunction(
      `${process.env.PUBLIC_URL}/result?${Object.keys(state)
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
          <button className="result" onClick={showResult}>
            結果を取得する
          </button>
        </div>
      </div>
    </div>
  );
};

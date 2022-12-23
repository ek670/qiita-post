import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { queryParams } from "../model/ParamsToGetItems";

export const GetItemsInput = () => {
  console.log("[render]Input component");

  const [searchParams] = useSearchParams();

  /** クエリパラメータからオブジェクトを生成する */
  const getParamsObj = () => Object.fromEntries(queryParams.map((p) => [p.name, searchParams.get(p.name) || p.defaultValue]));

  const [state, setState] = useState(getParamsObj());

  useEffect(
    () => {
      console.log(`[useEffect]Input`);
      setState(getParamsObj());
    },
    queryParams.map((p) => searchParams.get(p.name))
  );

  const handleInput = (e: { target: { name: string; value: string } }) => {
    const p = queryParams.find((v) => v.name == e.target.name);
    if (p == undefined) return;

    console.log("handleInput", { ...state, [e.target.name]: e.target.value });

    setState({ ...state, [e.target.name]: e.target.value });
  };

  const navigateFunction = useNavigate();

  /** Resutページに遷移しAPIとクエリパラメータを渡す */
  const showResult = () =>
    navigateFunction(
      `${process.env.PUBLIC_URL}?${Object.keys(state)
        .map((key) => `${key}=${state[key]}`)
        .join("&")}`
    );

  return (
    <div className="block">
      {/* <h3 className="title">検索条件</h3> */}
      <div className="form">
        <div className="des">条件を指定してQiitaの記事を取得します</div>
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

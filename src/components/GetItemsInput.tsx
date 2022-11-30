import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { queryParams } from "../model/GetItemsParams";

export const GetItemsInput = () => {
  console.log("render Input component");

  const [seachParams] = useSearchParams();

  const [state, setState] = useState(
    Object.fromEntries(Object.keys(queryParams).map((key) => [key, seachParams.get(key) || queryParams[key].defaultValue]))
  );

  const handleInput = (e: { target: { name: string; value: string } }) => {
    if (queryParams[e.target.name].isNum) {
      if (e.target.value == "") e.target.value = "1";

      if (queryParams[e.target.name].min && parseInt(e.target.value) < (queryParams[e.target.name].min || 0))
        e.target.value = (queryParams[e.target.name].min || 0).toString();

      if (queryParams[e.target.name].max && parseInt(e.target.value) > (queryParams[e.target.name].max || 0))
        e.target.value = (queryParams[e.target.name].max || 0).toString();
    }

    console.log({ ...state, [e.target.name]: e.target.value });

    setState({ ...state, [e.target.name]: e.target.value });
  };

  const navigate = useNavigate();

  // Resutページに遷移しAPIとクエリパラメータを渡す
  const showResult = () =>
    navigate(
      `/result?${Object.keys(state)
        .map((key) => `${key}=${state[key]}`)
        .join("&")}`
    );

  return (
    <div className="block">
      <h3 className="title">検索条件</h3>
      <div className="form">
        <table className="table">
          <tbody>
            {Object.keys(queryParams).map((key) => (
              <tr key={key} className="tr">
                <th className="th">{queryParams[key].th}</th>
                <td className="td">
                  <input
                    className="param"
                    type={queryParams[key].isNum ? "number" : "text"}
                    name={key}
                    value={state[key]}
                    onChange={handleInput}
                    placeholder={queryParams[key].placeholder}
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

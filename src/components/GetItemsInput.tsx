import { useInput } from "../hooks/useInput";
import { queryParams } from "../model/ParamsToGetItems";

export const GetItemsInput = () => {
  console.log("[render]Input component");

  const { inputs, handleInput, showOutput } = useInput();

  return (
    <div className="block">
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
                    value={inputs[p.name]}
                    onChange={handleInput}
                    placeholder={p.placeholder}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div>
          <button className="result" onClick={showOutput}>
            結果を取得する
          </button>
        </div>
      </div>
    </div>
  );
};

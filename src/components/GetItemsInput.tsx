import { useInput } from "../hooks/useInput";
import { paramsToGetItems } from "../model/ParamsToGetItems";

export const GetItemsInput = () => {
  console.log("[render]Input component");

  const { inputs, handleInput, setQueryParams } = useInput();

  return (
    <div className="block">
      <div className="form">
        <div className="des">条件を指定してQiitaの記事を取得します</div>
        <table className="table">
          <tbody>
            {paramsToGetItems.map((p) => (
              <tr key={p.name} className="tr">
                <th className="th">{p.th}</th>
                <td className="td">
                  <input
                    className="param"
                    type={p.isNum ? "number" : "text"}
                    name={p.name}
                    value={inputs[p.name] || p.defaultValue}
                    onChange={handleInput}
                    placeholder={p.placeholder}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div>
          <button className="result" onClick={setQueryParams}>
            結果を取得する
          </button>
        </div>
      </div>
    </div>
  );
};

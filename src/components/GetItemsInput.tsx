import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { GetItemsParams } from "../model/GetItemsParams";

export const GetItemsInput = () => {
  console.log("render InputForm");

  const [seachParams] = useSearchParams();

  const [state, setState] = useState<GetItemsParams>({
    tag: seachParams.get("tag") || "",
    page: seachParams.get("page") || "1",
    per_page: seachParams.get("per_page") || "3",
  });

  const handleInput = (e: { target: { name: string; value: string } }) => {
    console.log({ ...state, [e.target.name]: e.target.value });

    if (e.target.name == "page") {
      if (e.target.value == "") e.target.value = "1";
    } else if (e.target.name == "per_page") {
      if (e.target.value == "") e.target.value = "1";
      if (parseInt(e.target.value) > 100) {
        e.target.value = "100";
      }
    }

    setState({ ...state, [e.target.name]: e.target.value });
  };

  const navigate = useNavigate();

  // Resutページに遷移しAPIとクエリパラメータを渡す
  const showResult = () => navigate(`/result?page=${state.page}&per_page=${state.per_page}&tag=${state.tag}`);

  return (
    <div className="block">
      <h3 className="title">検索条件</h3>
      <div className="form">
        <table>
          <tr>
            <th>
              タグ（
              <a href="https://qiita.com/tags" target="_blank" rel="noreferrer">
                一覧
              </a>
              ）
            </th>
            <td>
              <input
                className="param"
                type="text"
                name="tag"
                value={state.tag}
                onChange={handleInput}
                placeholder="指定する場合は入力してください"
              />
            </td>
          </tr>
          <tr>
            <th>ページ番号</th>
            <td>
              <input className="param" type="number" name="page" value={state.page} onChange={handleInput} />
            </td>
          </tr>
          <tr>
            <th>記事数/ページ</th>
            <td>
              <input className="param" type="number" name="per_page" value={state.per_page} onChange={handleInput} />
            </td>
          </tr>
        </table>
        <div>
          <button onClick={showResult}>結果を取得する</button>
        </div>
      </div>
    </div>
  );
};

import { useState } from "react";
import { actions } from "./ActionSelector";
import axios from "axios";
import { GetItemsResult, item } from "./GetItemsResult";

export const GetItemsInput = (props: { action: string }) => {
  console.log("render InputForm");

  const [state, setState] = useState<{
    tag: string;
    page: string;
    per_page: string;
  }>({
    tag: "",
    page: "1",
    per_page: "3",
  });

  const handleInput = (e: { target: { value: string; name: string } }) => {
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

  const [post, setPost] = useState<{ items: item[]; got: boolean }>({ items: [], got: false });

  const client = axios.create({
    baseURL: "https://qiita.com/api/v2",
  });

  const getItems = async () => {
    const endpoint = `items?page=${state.page}&per_page=${state.per_page}`;

    const response = await client.get(state.tag == "" ? endpoint : `${endpoint}&query=tag%3A${state.tag}`, {
      headers: {
        Authorization: "Bearer 541dfaeb7284908f175a9564708a69ff24c103d8",
      },
    });

    setPost({ items: response.data, got: true });

    console.log(response);
  };

  return (
    <>
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
                <input className="param" type="text" name="tag" value={state.tag} onChange={handleInput} />
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
            <button onClick={getItems}>結果を取得する</button>
          </div>
        </div>
      </div>
      {props.action === actions[0] && post.got && <GetItemsResult items={post.items} date={new Date().toLocaleString("ja")} />}
    </>
  );
};

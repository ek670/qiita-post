import { useState } from "react";
import { actions } from "./ActionSelector";
import axios from "axios";
import { ActionResult, item } from "./ActionResult";

export const InputForm = (props: { action: string }) => {
  console.log("render InputForm");

  type getItemState = {
    tag: string;
    page: string;
    per_page: string;
  };

  const [state, setState] = useState<getItemState>({
    tag: "",
    page: "1",
    per_page: "3",
  });

  const handleInputChange = (e: { target: { value: string; name: string } }) => {
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

  const [post, setPost] = useState<item[]>([]);

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

    setPost(response.data);

    console.log(response);
  };

  return (
    <>
      <div className="block">
        <h2 className="title">検索条件</h2>
        <p className="label">
          タグ
          <input type="text" name="tag" value={state.tag} onChange={handleInputChange} />
        </p>
        <p className="label">
          ページ番号
          <input type="number" name="page" value={state.page} onChange={handleInputChange} />
        </p>
        <p className="label">
          1ページあたりの記事数
          <input type="number" name="per_page" value={state.per_page} onChange={handleInputChange} />
        </p>
        <p>
          <button onClick={getItems}>結果を取得する</button>
        </p>
      </div>
      {props.action === actions[0] && <ActionResult items={post} />}
    </>
  );
};

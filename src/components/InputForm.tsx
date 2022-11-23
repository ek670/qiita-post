import React from "react";
import { actions } from "./ActionSelector";
import axios from "axios";
import { ActionResult, item } from "./ActionResult";

export const InputForm = (props: { action: string }) => {
  console.log("render InputForm");

  const [tag, setTag] = React.useState("");

  const setTagOnInput = (e: { target: { value: string } }) => {
    setTag(e.target.value);
  };

  const client = axios.create({
    baseURL: "https://qiita.com/api/v2/items?page=1&per_page=3",
  });

  const b = async () => {
    const response = await client.get("", {
      headers: {
        Authorization: "Bearer 541dfaeb7284908f175a9564708a69ff24c103d8",
      },
    });

    setPost(response.data);

    console.log(response.data);
  };

  const [post, setPost] = React.useState<item[]>([]);

  return (
    <>
      <div className="block">
        <h2 className="title">検索条件</h2>
        <p className="label">
          タグ
          <input
            type="text"
            placeholder="タグ"
            value={tag}
            onChange={setTagOnInput}
          />
        </p>
        <p className="label">
          ページ番号
          <input type="text" defaultValue={1} />
        </p>
        <p className="label">
          1ページあたりの記事数
          <input type="text" defaultValue={30} />
        </p>
        <p>
          <button onClick={b}>結果を取得する</button>
        </p>
      </div>
      <ActionResult items={post} />
    </>
  );
};

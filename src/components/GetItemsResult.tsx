import { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { item } from "../model/Item";
import { queryParams } from "../model/GetItemsParams";

export const GetItemsResult = () => {
  console.log("render Result component");

  const [seachParams] = useSearchParams();

  const [post, setPost] = useState<{ items: item[]; got: boolean; date: string }>({
    items: [],
    got: false,
    date: "",
  });

  const client = axios.create({
    baseURL: "https://qiita.com/api/v2",
  });

  useEffect(
    () => {
      console.log(`useEffect`);
      getItems();
    },
    Object.keys(queryParams).map((key) => seachParams.get(key))
  );

  const getItems = async () => {
    console.log("get items");

    const endpoint = `items?page=${seachParams.get("page") || queryParams.page.defaultValue}&per_page=${
      seachParams.get("per_page") || queryParams.per_page.defaultValue
    }`;

    let query = "";
    for (const k in queryParams) {
      if (k != "page" && k != "per_page" && seachParams.get(k) != "" && seachParams.get(k) != null) {
        query == "" ? (query = "&query=") : (query += "+");
        query = query + k + queryParams[k].encoded + seachParams.get(k);
      }
    }
    query != "" && console.log("query", query);

    try {
      const response = await client.get(endpoint + query, {
        headers: {
          Authorization: "Bearer 541dfaeb7284908f175a9564708a69ff24c103d8",
        },
      });

      setPost({ items: response.data, got: true, date: new Date().toLocaleString("ja") });

      console.log("response", response);
    } catch (e) {
      console.log(e);

      setPost({ items: [], got: true, date: "" });
    }
  };

  return (
    <div className="block">
      <h3 className="title">検索結果</h3>
      {post.got || <div>記事を取得中です</div>}
      {post.got && <div>{post.items.length + "件  " + post.date}</div>}
      {post.got && post.items.length == 0 && <div>検索条件に一致する記事がありませんでした</div>}
      {post.items.map((item) => (
        <div key={item.id} className="card">
          <article className="article">
            <a className="itemlink" href={item.url} target="_blank" rel="noreferrer"></a>
            <h3 className="itemtitle">{item.title}</h3>
            <span className="tags">
              <img className="icon" src={`${process.env.PUBLIC_URL}/tag-free7.jpg`} />
              {item.tags.map((tag, index) => (
                <span key={index}>
                  <a className="taglink" href={`https://qiita.com/tags/${tag.name}`} target="_blank" rel="noreferrer">
                    {tag.name}
                  </a>
                </span>
              ))}
            </span>
            <span className="footer">
              <img className="icon" src={`${process.env.PUBLIC_URL}/star.png`} />
              {item.stocks_count}
            </span>
            <span className="footer">
              <img className="icon" src={`${process.env.PUBLIC_URL}/heart.png`} />
              {item.likes_count}
            </span>
            <span className="footer">{" " + item.updated_at.slice(0, 10)}</span>
          </article>
        </div>
      ))}
    </div>
  );
};
import { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { item } from "../model/Item";
import { queryParams } from "../model/ParamsToGetItems";
import { useNavigate } from "react-router-dom";

export const GetItemsResult = () => {
  console.log("render Result component");

  const [post, setPost] = useState<{ items: item[]; got: boolean; date: string }>({
    items: [],
    got: false,
    date: "",
  });
  const [searchParams] = useSearchParams();

  useEffect(
    () => {
      console.log(`useEffect result`);
      getItems();
    },
    queryParams.map((p) => searchParams.get(p.name))
  );

  const client = axios.create({
    baseURL: "https://qiita.com/api/v2",
  });

  const getItems = async () => {
    const endpoint = `items?page=${searchParams.get("page") || queryParams[2]?.defaultValue}&per_page=${
      searchParams.get("per_page") || queryParams[3]?.defaultValue
    }`;

    const query = queryParams
      .filter((p) => !["page", "per_page"].includes(p.name) && searchParams.get(p.name))
      .map((p, i) => (i == 0 ? "&query=" : "") + p.name + p.encoded + searchParams.get(p.name))
      .join("+");

    query != "" && console.log("[query]", query);

    try {
      const response = await client.get(endpoint + query, {
        headers: {
          Authorization: "Bearer 541dfaeb7284908f175a9564708a69ff24c103d8",
        },
      });

      setPost({ items: response.data, got: true, date: new Date().toLocaleString("ja") });

      window.scrollTo(0, 0);

      console.log("[response]", response);
    } catch (e) {
      setPost({ items: [], got: true, date: "" });

      console.log("[error]", e);
    }
  };

  const navigateFunction = useNavigate();

  /** 指定したページ番号のResutページに遷移する関数を返却する */
  const getShowResultFunc = (n: number) => () =>
    navigateFunction(
      `${process.env.PUBLIC_URL}/result?${queryParams
        .map((p) => {
          if (p.name == "page") return p.name + "=" + n;
          return p.name + "=" + searchParams.get(p.name);
        })
        .join("&")}`
    );

  return (
    <div className="block">
      {/* <h3 className="title">検索結果</h3> */}
      {post.got || <div>記事を取得中です</div>}
      {/* {post.got && <div>{post.items.length + "件  " + post.date}</div>} */}
      {post.got && post.items.length == 0 && <div>検索条件に一致する記事がありませんでした</div>}
      {post.items.map((item) => (
        <div key={item.id} className="card">
          <article className="article">
            <a className="itemlink" href={item.url} target="_blank" rel="noreferrer"></a>
            <h3 className="itemtitle">{item.title}</h3>
            <span className="tags">
              <img className="icon" src={`${process.env.PUBLIC_URL}/tag.png`} />
              {item.tags.map((tag, index) => (
                <span key={index}>
                  <a className="taglink" href={`https://qiita.com/tags/${tag.name}`} target="_blank" rel="noreferrer">
                    {tag.name}
                  </a>
                </span>
              ))}
            </span>
            <span className="footer">
              <img className="icon" src={`${process.env.PUBLIC_URL}/stock.png`} />
              {item.stocks_count}
            </span>
            <span className="footer">
              <img className="icon" src={`${process.env.PUBLIC_URL}/like.png`} />
              {item.likes_count}
            </span>
            <span className="footer">{"update:" + item.updated_at.slice(0, 10)}</span>
          </article>
        </div>
      ))}
      {post.got && post.items.length > 0 && (
        <ul className="pagelist">
          {(() => {
            const page = parseInt(searchParams.get("page") || "1");

            return [...Array(7).keys()].map((i) => {
              const n = page < 4 ? i + 1 : i + 1 + page - 4;

              return (
                <li key={n} className={n != page ? "pageno" : "lastpageno"}>
                  {n != page ? <button onClick={getShowResultFunc(n)}>{n}</button> : <>{n}</>}
                </li>
              );
            });
          })()}
        </ul>
      )}
    </div>
  );
};

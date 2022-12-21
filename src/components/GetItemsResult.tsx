import { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { item } from "../model/Item";
import { queryParams } from "../model/ParamsToGetItems";
import { useNavigate } from "react-router-dom";

export const GetItemsResult = () => {
  console.log("render Result component");

  const [post, setPost] = useState<{ items: item[]; got: boolean; date: string; status: string }>({
    items: [],
    got: false,
    date: "",
    status: "neutral",
  });
  const [searchParams] = useSearchParams();

  useEffect(
    () => {
      console.log(`useEffect result`);
      setItems(post.status);
      window.scrollTo(0, 0);
    },
    queryParams.map((p) => searchParams.get(p.name))
  );

  const client = axios.create({
    baseURL: "https://qiita.com/api/v2",
  });

  const setItems = async (status: string) => {
    setPost({ ...post, status: "loading" });

    const endpoint = `items?page=${searchParams.get("page") || queryParams[3]?.defaultValue}&per_page=${
      searchParams.get("per_page") || queryParams[2]?.defaultValue
    }`;

    const query = queryParams
      .filter((p) => !["page", "per_page"].includes(p.name) && searchParams.get(p.name))
      .map((p, i) => (i == 0 ? "&query=" : "") + p.name + p.encoded + searchParams.get(p.name))
      .join("+");

    if (searchParams.get("page") == null && searchParams.get("per_page") == null && query == "") {
      setPost({ ...post, status: status });
      return;
    }

    console.log("[endpoint]", endpoint + query);

    const headers =
      process.env.NODE_ENV == "development"
        ? {
            Authorization: "Bearer 541dfaeb7284908f175a9564708a69ff24c103d8",
          }
        : {};

    try {
      const response = await client.get(endpoint + query, { headers: headers });

      setPost({ ...post, items: response.data, status: "got" }); //, date: new Date().toLocaleString("ja") });

      console.log("[response]", response);
    } catch (e) {
      setPost({ ...post, items: [], status: "failed" });

      console.log("[error]", e);
    }
  };

  const navigateFunction = useNavigate();

  /** 指定したページ番号のResutページに遷移する関数を返却する */
  const getShowResultFunc = (n: number) => () =>
    navigateFunction(
      `${process.env.PUBLIC_URL}?${queryParams
        .map((p) => {
          if (p.name == "page") return p.name + "=" + n;
          return p.name + "=" + searchParams.get(p.name);
        })
        .join("&")}`
    );

  return (
    <div className="block">
      {/* <h3 className="title">検索結果</h3> */}
      {post.status == "loading" && <div>記事を取得中です</div>}
      {/* {post.got && <div>{post.items.length + "件  " + post.date}</div>} */}
      {post.status == "failed" && <div>記事の取得に失敗しました。ご利用の端末でのQiita API利用制限に達している可能性が有ります。</div>}
      {post.status == "got" && post.items.length == 0 && <div>検索条件に一致する記事がありませんでした</div>}
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
      {post.status == "got" && post.items.length > 0 && (
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

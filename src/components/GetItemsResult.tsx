import { useOutput } from "../hooks/useOutput";
import { queryParams } from "../model/ParamsToGetItems";

export const GetItemsOutput = () => {
  console.log("[render]Result component");

  const { searchParams, post, getShowResultFunc, page } = useOutput();

  return (
    <div className="block">
      {/* <h3 className="title">検索結果</h3> */}
      {post.status == "loading" && <div>記事を取得中です</div>}
      {post.status == "got" && post.pages.at(page - 1) != undefined && post.pages[page - 1].length == 0 && (
        <div>検索条件に一致する記事がありませんでした</div>
      )}
      {post.status == "failed" && <div>記事の取得に失敗しました。ご利用の端末でのQiita API利用制限に達している可能性が有ります。</div>}
      {post.pages.at(page - 1) != undefined &&
        post.pages[page - 1].map((item) => (
          <div key={item.id} className="card">
            <article className="article">
              <a className="itemlink" href={item.url} target="_blank" rel="noreferrer"></a>
              <h3 className="itemtitle">{item.title}</h3>
              <span className="tags">
                <img className="icon" src={`${process.env.PUBLIC_URL}/tag.png`} />
                {item.tags.map((tag, index) => (
                  <span key={index}>
                    <a
                      className="taglink"
                      href={`${process.env.PUBLIC_URL}?${queryParams
                        .map((p) => p.name + "=" + (p.name == "tag" ? tag.name : p.name == "page" ? "1" : searchParams.get(p.name)))
                        .join("&")}`}
                      target="_blank"
                      rel="noreferrer"
                    >
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
      {post.pages.length > 0 && (
        <ul className="pagelist">
          {[...Array(7)].map((_, i) => {
            const n = (page < 4 ? 1 : page - 3) + i;

            return (
              <li key={n} className={n != page ? "pageno" : "lastpageno"}>
                {n != page ? <button onClick={getShowResultFunc(n)}>{n}</button> : <>{n}</>}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

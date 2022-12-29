import { useOutput } from "../hooks/useOutput";

export const GetItemsOutput = () => {
  console.log("[render]Output component");

  const { state, getShowResultFunc } = useOutput();

  const page = parseInt(state.queryParams["page"] || "1");

  const startPage = page < 4 ? 1 : page - 3;

  return (
    <div className="block">
      {state.status == "loading" && <div>記事を取得中です</div>}
      {state.status == "got" && state.pages.at(page - 1) != undefined && state.pages[page - 1].length == 0 && (
        <div>検索条件に一致する記事がありませんでした</div>
      )}
      {state.status == "failed" && <div>記事の取得に失敗しました。ご利用の端末でのQiita API利用制限に達している可能性が有ります。</div>}
      {state.pages.at(page - 1) != undefined &&
        state.pages[page - 1].map((item) => (
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
                      href={`?${Object.keys(state.queryParams)
                        .map((p) => p + "=" + (p == "tag" ? tag.name : p == "page" ? "1" : state.queryParams[p] || ""))
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
      {state.pages.length > 0 && (
        <ul className="pagelist">
          {[...Array(7)].map((_, i) =>
            page != startPage + i ? (
              <li key={i} className="pageno">
                <button onClick={getShowResultFunc(startPage + i)}>{startPage + i}</button>
              </li>
            ) : (
              <li key={i} className="lastpageno">
                <>{startPage + i}</>
              </li>
            )
          )}
        </ul>
      )}
    </div>
  );
};

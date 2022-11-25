export type item = {
  id: string;
  title: string;
  url: string;
  likes_count: number;
  stocks_count: number;
  updated_at: string;
  page_views_count: string;
  user: {
    id: string;
    name: string;
    profile_image_url: string;
    organization: string;
  };
  tags: { name: string }[];
};

export const GetItemsResult = (props: { items: item[]; date: string }) => {
  return (
    <>
      <div className="block">
        <h3 className="title">検索結果</h3>
        <span>{+props.items.length + "件  " + props.date}</span>
        {props.items.length == 0 && "検索条件に一致する記事がありませんでした"}
        {props.items.map((item) => {
          return (
            <div key={item.id} className="card">
              <article className="article">
                <a className="itemlink" href={item.url} target="_blank" rel="noreferrer"></a>
                <h3 className="itemtitle">{item.title}</h3>
                <span className="tags">
                  <img className="icon" src={`${process.env.PUBLIC_URL}/tag-free7.jpg`} />
                  {item.tags.map((tag, index) => {
                    return (
                      <span key={index}>
                        {index != 0 && ","}
                        <a className="taglink" href={`https://qiita.com/tags/${tag.name}`} target="_blank" rel="noreferrer">
                          {tag.name}
                        </a>
                      </span>
                    );
                  })}
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
          );
        })}
      </div>
    </>
  );
};

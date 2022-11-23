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

export const ActionResult = (props: { items: item[] }) => {
  return (
    <>
      <div className="block">
        <h2 className="title">Result</h2>
        {props.items.length == 0 && "検索条件に一致する記事がありませんでした"}
        {props.items.map((item) => {
          return (
            <div key={item.id} className="wrapper">
              <div>
                <article>
                  <a href={item.url} target="_blank" rel="noreferrer"></a>
                  <h2>{item.title}</h2>
                  <p>
                    <img src={`${process.env.PUBLIC_URL}/tag-free7.jpg`} />
                    {item.tags.map((tag, index) => {
                      return index != 0 ? `, ${tag.name}` : tag.name;
                    })}
                  </p>
                  <p>
                    {`likes:${item.likes_count}  stocks:${item.stocks_count}`}
                  </p>
                </article>
              </div>
              <div className="author">
                <img src={item.user.profile_image_url} height="32" width="32" />
                <p>
                  {"@" + item.user.id}
                  {item.user.name && " " + item.user.name}
                </p>
                <p>更新日:{item.updated_at.slice(0, 10)}</p>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

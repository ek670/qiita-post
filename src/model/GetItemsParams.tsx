export const queryParams: {
  [k: string]: {
    th: JSX.Element;
    defaultValue: string;
    isNum: boolean;
    max?: number;
    min?: number;
    placeholder?: string;
    encoded?: string;
  };
} = {
  tag: {
    th: (
      <>
        タグ（
        <a href="https://qiita.com/tags" target="_blank" rel="noreferrer">
          一覧
        </a>
        ）
      </>
    ),
    defaultValue: "",
    isNum: false,
    placeholder: "指定する場合は入力してください",
    encoded: "%3A",
  },
  stocks: {
    th: <>最低ストック数</>,
    defaultValue: "100",
    isNum: true,
    encoded: "%3A%3E%3D",
  },
  per_page: { th: <>記事数/ページ</>, defaultValue: "10", isNum: true, max: 100, min: 1 },
  page: { th: <>ページ番号</>, defaultValue: "1", isNum: true, min: 1 },
};

export const queryParams: {
  [k: string]: {
    th: JSX.Element;
    default: string;
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
    default: "",
    isNum: false,
    placeholder: "指定する場合は入力してください",
    encoded: "%3A",
  },
  page: { th: <>ページ番号</>, default: "1", isNum: true, min: 1 },
  per_page: { th: <>記事数/ページ</>, default: "10", isNum: true, max: 100, min: 1 },
};

// >= %3E%3D

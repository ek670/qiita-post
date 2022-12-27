import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { item } from "../model/Item";
import { queryParams } from "../model/ParamsToGetItems";

const neutral = "neutral";
const loading = "loading";
const got = "got";
const failed = "failed";

export const useOutput = () => {
  console.log("[render]Result component");

  const [searchParams] = useSearchParams();

  /** クエリパラメータからオブジェクトを生成する */
  const getParamsObj = () => Object.fromEntries(queryParams.map((p) => [p.name, searchParams.get(p.name) || p.defaultValue]));

  const [post, setPost] = useState<{
    pages: item[][];
    status: string;
    queryParam: {
      [k: string]: string;
    };
  }>({
    pages: [],
    status: neutral,
    queryParam: getParamsObj(),
  });

  useEffect(
    () => {
      console.log(`[useEffect]Result`);

      setItemstoState();

      console.log("[newPages]", post.pages);

      window.scrollTo(0, 0);
    },
    queryParams.map((p) => searchParams.get(p.name))
  );

  const page = parseInt(searchParams.get("page") || "1");
  const per_page = parseInt(searchParams.get("per_page") || queryParams[2]?.defaultValue);

  /** qiita APIで取得した記事とステータスをstateに保存する */
  const setItemstoState = async () => {
    console.log("[page]", page);

    // クエリパラメータが無いなら記事を消す
    if (queryParams.filter((v) => searchParams.get(v.name) != null).length == 0) {
      setPost({
        pages: [],
        status: neutral,
        queryParam: getParamsObj(),
      });
      return;
    }

    /** page以外のクエリパラメータが変更されたか */
    const notChangedQuery = queryParams.filter((v) => v.name != "page" && post.queryParam[v.name] != searchParams.get(v.name)).length == 0;

    // クエリパラメータで指定されたページ番号の記事が取得済みなら、APIを叩かず終了
    if (notChangedQuery && post.pages.length >= page && post.pages[page - 1].length != 0) {
      setPost({ ...post, queryParam: getParamsObj() });

      console.log("[page change]");

      updatePost(page + 1);

      return;
    }

    if (!notChangedQuery) post.pages = [];

    setPost({ ...post, status: loading, queryParam: getParamsObj() });

    // 既存ページから新規ページまで記事の空配列で埋める
    page > post.pages.length && post.pages.push(...[...Array(page - post.pages.length)].map(() => []));

    const status = await updatePost(page);

    if (status == failed) {
      setPost({ ...post, pages: [], status: failed, queryParam: getParamsObj() });
      return;
    }

    setPost({ pages: post.pages, status: got, queryParam: getParamsObj() }); //, date: new Date().toLocaleString("ja") });

    updatePost(page + 1);
  };

  const updatePost = async (pageno: number) => {
    if (post.pages.at(pageno - 1) != undefined && post.pages[pageno - 1].length > 0) return got;

    const { resBody, status } = await getItems(pageno, per_page);

    if (status == failed || resBody.length < 1) return status;

    if (post.pages.at(pageno - 1) != undefined) post.pages[pageno - 1] = resBody;
    if (post.pages.length == pageno - 1) post.pages.push(resBody);

    console.log("pages", post.pages);

    return status;
  };

  const getItems = async (page: number, per_page: number) => {
    const endpoint = `items?page=${page}&per_page=${per_page}`;

    const query = queryParams
      .filter((p) => !["page", "per_page"].includes(p.name) && searchParams.get(p.name))
      .map((p, i) => (i == 0 ? "&query=" : "") + p.name + p.encoded + searchParams.get(p.name))
      .join("+");

    console.log("[endpoint]", endpoint + query);

    try {
      const response = await axios
        .create({
          baseURL: "https://qiita.com/api/v2",
        })
        .get(endpoint + query, {
          headers: {
            Authorization: "Bearer 541dfaeb7284908f175a9564708a69ff24c103d8",
          },
        });

      console.log("[response]", response);

      return { resBody: response.data as item[], status: got };
    } catch (e) {
      console.error("[error]", e);

      return { resBody: Array<item>(0), status: failed };
    }
  };

  const navigateFunction = useNavigate();

  /** 指定したページ番号のResutページに遷移する関数を返却する */
  const getShowResultFunc = (pageNo: number) => () =>
    navigateFunction(`?${queryParams.map((p) => p.name + "=" + (p.name == "page" ? pageNo : searchParams.get(p.name))).join("&")}`);

  return { searchParams, post, getShowResultFunc, page };
};

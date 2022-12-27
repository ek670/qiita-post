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

      window.scrollTo(0, 0);
    },
    queryParams.map((p) => searchParams.get(p.name))
  );

  const page = parseInt(searchParams.get("page") || "1");
  const per_page = parseInt(searchParams.get("per_page") || queryParams[2]?.defaultValue);

  /** qiita APIで取得した記事とステータスをstateに保存する */
  const setItemstoState = async () => {
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

      getNextPage();

      return;
    }

    setPost({ ...post, status: loading });

    /** 一纏めにするページ数 */
    const pageUnit = 1; // ((100 / per_page) | 0) > 7 ? 7 : (100 / per_page) | 0;

    /** pageUnit単位でpageが何個目のブロックに含まれるか */
    const pageUnitIndex = ((page - 1) / pageUnit) | 0;

    console.log("pageUnit", pageUnit, "index", pageUnitIndex);

    const { resBody, status } = await getItems(pageUnitIndex + 1, per_page * pageUnit);

    if (status == failed) {
      setPost({ ...post, pages: [], status: failed, queryParam: getParamsObj() });
      return;
    }

    if (!notChangedQuery) post.pages = [];

    notChangedQuery && console.log("[notChangedQuery oldPages]", post.pages);
    console.log("post.pages.length", post.pages.length);

    // 既存pages末尾と新規pages先頭の間のページを記事の空配列で埋める
    post.pages.length < pageUnit * pageUnitIndex &&
      post.pages.push(...[...Array(pageUnit * pageUnitIndex - post.pages.length)].map(() => []));

    // qiita APIで取得した記事をページ単位で配列に追加する
    [...Array(pageUnit)].map((_, i) => {
      // 記事の残りが無ければ終了する
      if (resBody.length < per_page * i + 1) return;

      const end = resBody.length < per_page * (i + 1) ? resBody.length : per_page * (i + 1);

      console.log("page", pageUnit * pageUnitIndex + i, "end", end, resBody.slice(per_page * i, end));

      // 既にpageが挿入されていれば上書きする
      if (post.pages.at(pageUnit * pageUnitIndex + i) != undefined) {
        post.pages[pageUnit * pageUnitIndex + i] = resBody.slice(per_page * i, end);
        return;
      }

      post.pages.push(resBody.slice(per_page * i, end));
    });

    console.log("[newPages]", post.pages);

    setPost({ pages: post.pages, status: got, queryParam: getParamsObj() }); //, date: new Date().toLocaleString("ja") });

    if (pageUnit == 1) getNextPage();
  };

  const getNextPage = async () => {
    if (post.pages.at(page) != undefined && post.pages[page].length > 0) return;

    console.log("get next pagea");

    const { resBody, status } = await getItems(page + 1, per_page);

    if (status == failed || resBody.length < 1) return;

    if (post.pages.at(page) != undefined) {
      post.pages[page] = resBody;
    } else {
      post.pages.push(resBody);
    }

    console.log(post.pages);
  };

  const client = axios.create({
    baseURL: "https://qiita.com/api/v2",
  });

  const getItems = async (page: number, per_page: number) => {
    const endpoint = `items?page=${page}&per_page=${per_page}`;

    const query = queryParams
      .filter((p) => !["page", "per_page"].includes(p.name) && searchParams.get(p.name))
      .map((p, i) => (i == 0 ? "&query=" : "") + p.name + p.encoded + searchParams.get(p.name))
      .join("+");

    console.log("[endpoint]", endpoint + query);

    try {
      const response = await client.get(endpoint + query, {
        headers:
          process.env.NODE_ENV == "development"
            ? {
                Authorization: "Bearer 541dfaeb7284908f175a9564708a69ff24c103d8",
              }
            : {},
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
    navigateFunction(
      `${process.env.PUBLIC_URL}?${queryParams.map((p) => p.name + "=" + (p.name == "page" ? pageNo : searchParams.get(p.name))).join("&")}`
    );

  return { searchParams, post, getShowResultFunc, page };
};

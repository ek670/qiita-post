import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { item } from "../model/Item";
import { getItemsParams } from "../model/ParamsToGetItems";

export const useOutput = () => {
  const [searchParams] = useSearchParams();

  /** クエリパラメータからオブジェクトを生成する */
  const getParamsObj = () => Object.fromEntries(getItemsParams.map((p) => [p.name, searchParams.get(p.name)]));

  type status = "neutral" | "loading" | "got" | "failed";

  const [state, setState] = useState<{
    pages: item[][];
    status: status;
    queryParams: {
      [k: string]: string | null;
    };
  }>({
    pages: [],
    status: "neutral",
    queryParams: getParamsObj(),
  });

  useEffect(
    () => {
      console.log(`[useEffect]Output`);

      setItemstoState();

      window.scrollTo(0, 0);
    },
    getItemsParams.map((p) => searchParams.get(p.name))
  );

  const page = parseInt(searchParams.get("page") || "1");
  const per_page = parseInt(searchParams.get("per_page") || getItemsParams[2]?.defaultValue);

  /** qiita APIで取得した記事とステータスをstateに保存する */
  const setItemstoState = async () => {
    console.log("[page]", page);

    // クエリパラメータが無いなら記事を消す
    if (!getItemsParams.some((v) => searchParams.get(v.name) != null)) {
      setState({
        pages: [],
        status: "neutral",
        queryParams: getParamsObj(),
      });
      return;
    }

    /** page以外のクエリパラメータが変更されたか */
    const optionHasChanged = getItemsParams.some((v) => v.name != "page" && state.queryParams[v.name] != searchParams.get(v.name));

    // クエリパラメータで指定されたページ番号の記事が取得済みなら、APIを叩かず終了
    if (!optionHasChanged && (state.pages.at(page - 1) || []).length != 0) {
      setState({ ...state, queryParams: getParamsObj() });

      console.log("[page change]");

      updatePages(page + 1);

      return;
    }

    if (optionHasChanged) state.pages = [];

    setState({ ...state, status: "loading", queryParams: getParamsObj() });

    // 既存ページから新規ページまで記事の空配列で埋める
    page > state.pages.length && state.pages.push(...[...Array(page - state.pages.length)].map(() => []));

    const status = await updatePages(page);

    if (status == "failed") {
      setState({ ...state, pages: [], status: "failed", queryParams: getParamsObj() });
      return;
    }

    setState({ pages: state.pages, status: "got", queryParams: getParamsObj() });

    updatePages(page + 1);
  };

  const updatePages = async (pageno: number) => {
    if (state.pages.at(pageno - 1) != undefined && state.pages[pageno - 1].length > 0) return "got";

    const { resBody, status } = await getItems(pageno, per_page);

    if (status == "failed" || resBody.length < 1) return status;

    if (state.pages.at(pageno - 1) != undefined) state.pages[pageno - 1] = resBody;
    if (state.pages.length == pageno - 1) state.pages.push(resBody);

    console.log("pages", state.pages);

    return status;
  };

  const getItems = async (
    page: number,
    per_page: number
  ): Promise<{
    resBody: item[];
    status: status;
  }> => {
    const endpoint = `items?page=${page}&per_page=${per_page}`;

    const query = getItemsParams
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

      return { resBody: response.data, status: "got" };
    } catch (e) {
      console.error("[error]", e);

      return { resBody: [], status: "failed" };
    }
  };

  const navigateFunction = useNavigate();

  /** 指定したページ番号のOutputページに遷移する関数を返却する */
  const getShowResultFunc = (pageNo: number) => () =>
    navigateFunction(`?${getItemsParams.map((p) => p.name + "=" + (p.name == "page" ? pageNo : searchParams.get(p.name))).join("&")}`);

  return { state, getShowResultFunc };
};

import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { item } from "../model/Item";
import { paramsToGetItems } from "../model/ParamsToGetItems";
import { status } from "../model/type";

export const useOutput = () => {
  const [searchParams] = useSearchParams();

  /** クエリパラメータからオブジェクトを生成する */
  const getParamsObj = () => Object.fromEntries(paramsToGetItems.map((p) => [p.name, searchParams.get(p.name)]));

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
    paramsToGetItems.map((p) => searchParams.get(p.name))
  );

  /** qiita APIで取得した記事とステータスをstateに保存する */
  const setItemstoState = async () => {
    const page = parseInt(searchParams.get("page") || "1");
    console.log("[page]", page);

    // クエリパラメータが無いならOutputを表示しない
    if (!paramsToGetItems.some((v) => searchParams.get(v.name) != null)) {
      setState({
        pages: [],
        status: "neutral",
        queryParams: getParamsObj(),
      });
      return;
    }

    /** page以外のクエリパラメータが変更されたか */
    const optionHasChanged = paramsToGetItems.some((v) => v.name != "page" && state.queryParams[v.name] != searchParams.get(v.name));

    // クエリパラメータで指定されたページ番号の記事が取得済みなら、APIを叩かず終了
    if (!optionHasChanged && (state.pages.at(page - 1) || []).length != 0) {
      setState({ ...state, queryParams: getParamsObj() });

      console.log("[page change]");

      updatePages(page + 1);

      return;
    }

    if (optionHasChanged) state.pages = [];

    setState({ pages: state.pages, status: "loading", queryParams: getParamsObj() });

    // 既存ページの次から新規ページまで記事の空配列で埋める
    page > state.pages.length && state.pages.push(...[...Array(page - state.pages.length)].map(() => []));

    if ((await updatePages(page)) == "failed") {
      setState({ pages: [], status: "failed", queryParams: getParamsObj() });
      return;
    }

    setState({ pages: state.pages, status: "got", queryParams: getParamsObj() });

    updatePages(page + 1);
  };

  const updatePages = async (page: number) => {
    if (state.pages.at(page - 1) != undefined && state.pages[page - 1].length > 0) return "got";

    const per_page = parseInt(searchParams.get("per_page") || paramsToGetItems[2]?.defaultValue || "10");

    const { resBody, status } = await getItems(page, per_page);
    if (status == "failed") return status;

    if (state.pages.length >= page) state.pages[page - 1] = resBody;
    if (state.pages.length == page - 1) state.pages.push(resBody);

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

    const query = paramsToGetItems
      .filter((v) => !["page", "per_page"].includes(v.name) && searchParams.get(v.name))
      .map((v, i) => (i == 0 ? "&query=" : "") + v.name + v.encoded + searchParams.get(v.name))
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
  const getShowResultFunc = (page: number) => () =>
    navigateFunction(`?${paramsToGetItems.map((v) => v.name + "=" + (v.name == "page" ? page : searchParams.get(v.name))).join("&")}`);

  return { state, getShowResultFunc };
};

import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { paramsToGetItems } from "../model/ParamsToGetItems";

export const useInput = () => {
  const [searchParams] = useSearchParams();

  /** クエリパラメータからオブジェクトを生成する */
  const getParamsObj = () => Object.fromEntries(paramsToGetItems.map((p) => [p.name, searchParams.get(p.name) || p.defaultValue]));

  // クエリパラメータにある値を初期値とする
  const [inputs, setInputs] = useState(getParamsObj());

  useEffect(
    () => {
      console.log(`[useEffect]Input`);
      setInputs(getParamsObj());
    },
    paramsToGetItems.map((p) => searchParams.get(p.name))
  );

  const handleInput = (e: { target: { name: string; value: string } }) => setInputs({ ...inputs, [e.target.name]: e.target.value });

  const navigateFunction = useNavigate();

  /** クエリパラメータ付のURLに遷移する */
  const setQueryParams = () =>
    navigateFunction(
      `?${Object.keys(inputs)
        .map((key) => `${key}=${inputs[key]}`)
        .join("&")}`
    );

  return { inputs, handleInput, setQueryParams };
};

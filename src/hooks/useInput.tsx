import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getItemsParams } from "../model/ParamsToGetItems";

export const useInput = () => {
  const [searchParams] = useSearchParams();

  /** クエリパラメータからオブジェクトを生成する */
  const getParamsObj = () => Object.fromEntries(getItemsParams.map((p) => [p.name, searchParams.get(p.name) || p.defaultValue]));

  // クエリパラメータにある値を初期値とする
  const [inputs, setInputs] = useState(getParamsObj());

  useEffect(
    () => {
      console.log(`[useEffect]Input`);
      setInputs(getParamsObj());
    },
    getItemsParams.map((p) => searchParams.get(p.name))
  );

  const handleInput = (e: { target: { name: string; value: string } }) => {
    const p = getItemsParams.find((v) => v.name == e.target.name);
    if (p == undefined) return;

    console.log("handleInput", { ...inputs, [e.target.name]: e.target.value });

    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const navigateFunction = useNavigate();

  /** Resutページに遷移しAPIとクエリパラメータを渡す */
  const showOutput = () =>
    navigateFunction(
      `?${Object.keys(inputs)
        .map((key) => `${key}=${inputs[key]}`)
        .join("&")}`
    );

  return { inputs, handleInput, showOutput };
};

import { GetItemsInput } from "../components/GetItemsInput";
import { GetItemsResult } from "../components/GetItemsResult";

export const Result = () => {
  console.log("render Result-page");

  return (
    <>
      <GetItemsInput />
      <GetItemsResult />
    </>
  );
};

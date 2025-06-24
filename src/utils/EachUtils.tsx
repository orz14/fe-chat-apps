import { Children } from "react";

type EachUtilsType = {
  of: any[];
  render: any;
  isLoading?: boolean;
  Loader?: any;
  Empty?: any;
};

export default function EachUtils({ of, render, isLoading, Loader, Empty }: EachUtilsType) {
  if (typeof render !== "function") {
    console.log("render is not a function");
    return null;
  }

  if (isLoading) {
    return Loader != null ? <Loader /> : null;
  } else if (of?.length > 0 && !isLoading) {
    return Children.toArray(of?.map((item: any, index: number) => render(item, index)));
  } else {
    return Empty != null ? (
      <Empty />
    ) : (
      <div>
        <p className="text-center text-gray-500">No Data</p>
      </div>
    );
  }
}

EachUtils.defaultProps = {
  isLoading: false,
  Loader: null,
  Empty: null,
};

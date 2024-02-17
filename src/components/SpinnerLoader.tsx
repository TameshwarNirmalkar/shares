import React, { FC, memo } from "react";

const SpinnerLoader: FC<{ loading: boolean }> = memo((props) => {
  const { loading } = props;
  return (
    <>
      {loading && (
        <div className="spinner-mask" />
      )}
    </>
  );
});

export default SpinnerLoader;

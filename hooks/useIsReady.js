import { useEffect, useState } from "react";

const useIsReady = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsReady(true), 100);
  }, []);

  return isReady;
};

export default useIsReady;

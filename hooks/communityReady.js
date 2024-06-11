import { useEffect, useState } from "react";

const CommunityIsReady = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsReady(true), 500);
  }, []);

  return isReady;
};

export default CommunityIsReady;

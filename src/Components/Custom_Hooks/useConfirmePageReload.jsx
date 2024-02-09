import { useEffect, useRef } from "react";

const useConfirmPageReload = () => {
  const isReloadingRef = useRef(false);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (!isReloadingRef.current) {
        const confirmationMessage = "Are you sure you want to leave this page?";
        event.returnValue = confirmationMessage; // For older browsers
        return confirmationMessage;
      }
    };

    const handleReload = () => {
      isReloadingRef.current = true;
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("unload", handleReload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("unload", handleReload);
    };
  }, []);

  return isReloadingRef;
};

export default useConfirmPageReload;

import { useEffect } from 'react';

const useOutsideClick = (ref, onOutSideClick) => {
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (ref && ref.current && ref.current.contains(e.target)) return;
      onOutSideClick();
    };


    const eventType = 'ontouchstart' in window ? 'touchstart' : 'click';

    document.addEventListener(eventType, handleOutsideClick);
    return () => document.removeEventListener(eventType, handleOutsideClick);
  }, [onOutSideClick, ref]);
};

export default useOutsideClick;

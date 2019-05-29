import { useEffect } from 'react';

const useOutsideClick = (ref, onOutSideClick) => {
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (ref && ref.current && ref.current.contains(e.target)) return;
      onOutSideClick();
    };

    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [onOutSideClick, ref]);
};

export default useOutsideClick;

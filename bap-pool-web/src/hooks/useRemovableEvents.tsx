import {
  MouseEvent,
  TouchEvent,
  useCallback,
  useRef,
  useState,
} from 'react';

interface useRemovableEventsProps {
  threshold: number;
  onRemove: () => Promise<void> | void;
}

const useRemovableEvents = ({
  threshold,
  onRemove,
}: useRemovableEventsProps) => {
  const [deltaX, setDeltaX] = useState(0);
  const [startX, setStartX] = useState(0);

  const handleTouchStart = useCallback((e: TouchEvent<HTMLDivElement>) => {
    setStartX(e.touches[0].screenX);
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent<HTMLDivElement>) => {
    setDeltaX(e.touches[0].screenX - startX);
  }, [startX]);

  const handleTouchEnd = useCallback(() => {
    if (Math.abs(deltaX) > Math.round(threshold)) {
      onRemove();
    }

    setStartX(0);
    setDeltaX(0);
  }, [deltaX, threshold, onRemove]);

  const draggingItemRef = useRef<MouseEvent<HTMLDivElement>>();

  const handleMouseDown = useCallback((e: MouseEvent<HTMLDivElement>) => {
    draggingItemRef.current = e;
    setStartX(e.screenX);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    if (draggingItemRef.current == null) {
      return;
    }

    setDeltaX(e.screenX - startX);
  }, [startX]);

  const resetMouseEvent = useCallback(() => {
    draggingItemRef.current = undefined;
    setStartX(0);
    setDeltaX(0);

    if (Math.abs(deltaX) > Math.round(threshold)) {
      onRemove();
    }
  }, [deltaX, threshold, onRemove]);

  const handleMouseUp = useCallback(() => {
    resetMouseEvent();
  }, [resetMouseEvent]);

  const handleMouseLeave = useCallback(() => {
    resetMouseEvent();
  }, [resetMouseEvent]);

  return {
    deltaX,
    onTouchStart: handleTouchStart,
    onTouchEnd: handleTouchEnd,
    onTouchMove: handleTouchMove,
    onMouseDown: handleMouseDown,
    onMouseMove: handleMouseMove,
    onMouseUp: handleMouseUp,
    onMouseLeave: handleMouseLeave,
  };
};

export default useRemovableEvents;

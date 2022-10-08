import { useState, useEffect, cloneElement } from "react";

const Animate = ({
  on,
  duration,
  from,
  to,
  easing,
  children,
  onEnter,
  unMountOnExit
}) => {
  const [open, setOpen] = useState();
  const [styles, setStyles] = useState(from);
  const [entered, setEntered] = useState(false);

  const ClonedChild = cloneElement(children, {
    style: { ...styles, transition: `${duration}ms ${easing || "ease-out"}` }
  });

  useEffect(() => {
    if (on) {
      setOpen(true);
    } else {
      setTimeout(() => {
        setOpen(false);
      }, duration);
    }
  }, [on]);

  useEffect(() => {
    if (open && on) {
      onEnter && onEnter();
      setEntered(true);
    }

    if (open && !on) {
      setTimeout(() => setStyles(from), 0);
    }
  }, [open, on]);

  useEffect(() => {
    if (entered) {
      setTimeout(() => setStyles(to), 0);
      setEntered(false);
    }
  }, [entered]);

  return unMountOnExit ? open && ClonedChild : ClonedChild;
};

export default Animate;

// create a shape based on 2D array data
// empty box whre value ===1
// when value === 0 then render nothing
// we can select a box and change bgColor to green
// deselect in the order of selection
// disable any interaction
// [[],[],[]]

import { useMemo } from "react";
import classnames from "classnames";
import propTypes from "prop-types";
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
const Shape = ({ data }) => {
  const boxes = useMemo(() => data.flat(Infinity), [data]);
  const countOfVisibleBoxes = useMemo(() => {
    return boxes.reduce((acc, box) => {
      if (box === 1) {
        acc += 1;
      }
      return acc;
    }, 0);
  }, [boxes]);
  const [selected, setSelected] = useState(new Set());
  const [unloading, setUnloading] = useState(false);
  const timerRef = useRef(null);
  console.log(boxes);
  const handleClick = (e) => {
    const { target } = e;
    const index = target.getAttribute("data-index");
    const status = target.getAttribute("data-status");

    // checking '0' boxes
    if (
      index === null ||
      status === "hidden" ||
      selected.has(index) ||
      unloading
    ) {
      return;
    }

    setSelected((prev) => {
      return new Set(prev.add(index));
    });
  };

  const unload = () => {
    setUnloading(true);
    const keys = Array.from(selected.keys());
    const removeNextKey = () => {
      if (keys.length) {
        const currentKey = keys.shift();
        setSelected((prev) => {
          const updatedKeys = new Set(prev);
          updatedKeys.delete(currentKey);
          return updatedKeys;
        });

        timerRef.current = setTimeout(removeNextKey, 500);
      } else {
        setUnloading(false);
        clearTimeout(timerRef.current);
      }
    };

    timerRef.current = setTimeout(removeNextKey, 100);
  };

  useEffect(() => {
    if (selected.size >= countOfVisibleBoxes) {
      unload();
    }
  }, [selected]);
  return (
    <div className="boxes" onClick={handleClick}>
      {boxes.map((box, index) => {
        const status = box === 1 ? "visible" : "hidden";
        const isSelected = selected.has(index.toString());
        return (
          <div
            key={`${box}-${index}`}
            className={classnames("box", status, isSelected && "selected")}
            data-index={index}
            data-status={status}
          />
        );
      })}
    </div>
  );
};

Shape.propTypes = {
  data: propTypes.array.isRequired,
};

export default Shape;

import { useState, useEffect, useRef } from "react";
import Fuse from "fuse.js";

function useFuseSearch(data, options, filter) {
  const dataRef = useRef([]);
  const fuseRef = useRef(null);
  const [list, setList] = useState([]);

  useEffect(() => {}, [data]);

  useEffect(() => {
    if (!filter || !filter.length) {
      setList(dataRef.current);
    } else if (fuseRef.current) {
      setList(fuseRef.current.search(filter));
    }
  }, [filter]);

  return [list];
}

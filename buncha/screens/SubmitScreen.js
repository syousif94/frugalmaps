import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import SubmitForm, { FORM_WIDTH } from "../components/SubmitForm";
import SubmissionList from "../components/SubmissionList";
import PublishedList from "../components/PublishedList";
import { WEB } from "../utils/Constants";
import { useDimensions } from "../utils/Hooks";

const NARROW_PAGES = ["Pending", "Published"];

const ALL_PAGES = ["Form", "Pending", "Published"];

export const NARROW = 820;
export const SIDEBAR_WIDTH = 250;
export const MEDIUM = SIDEBAR_WIDTH * 2 + FORM_WIDTH + 80;

function usePages(dimensions) {
  const lastDimensions = useRef(null);
  const initialPages =
    !WEB || dimensions.width <= NARROW ? ALL_PAGES : NARROW_PAGES;
  const [pages, setPages] = useState(initialPages);
  const [page, setPage] = useState(pages[0]);

  useEffect(() => {
    if (WEB) {
      if (
        lastDimensions.current &&
        lastDimensions.current.width > NARROW !== dimensions.width > NARROW
      ) {
        const pages = dimensions.width <= NARROW ? ALL_PAGES : NARROW_PAGES;
        setPages(pages);
        setPage(pages[0]);
      }
      lastDimensions.current = dimensions;
    }
  }, [dimensions]);

  return [page, pages, setPage];
}

function componentForPage(page, pages, setPage) {
  let Component;
  switch (page) {
    case "Form":
      Component = SubmitForm;
      break;
    case "Pending":
      Component = SubmissionList;
      break;
    case "Published":
      Component = PublishedList;
      break;
    default:
      break;
  }

  if (Component) {
    return <Component pages={pages} page={page} setPage={setPage} />;
  }

  return null;
}

export default () => {
  const [dimensions] = useDimensions();
  const [page, pages, setPage] = usePages(dimensions);

  if (WEB && dimensions.width > NARROW) {
    const medium = dimensions.width > MEDIUM;
    const containerStyle = medium ? null : { flexDirection: "row-reverse" };
    const listStyle = medium
      ? {
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0
        }
      : null;
    return (
      <View style={[styles.container, containerStyle]}>
        <SubmitForm />
        <View style={[styles.lists, listStyle]}>
          {componentForPage(page, pages, setPage)}
        </View>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      {componentForPage(page, pages, setPage)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  lists: {
    width: SIDEBAR_WIDTH,
    borderRightWidth: 1,
    borderColor: "#f2f2f2",
    backgroundColor: "#fff"
  }
});

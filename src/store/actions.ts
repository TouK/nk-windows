import { omitBy } from "lodash";
import * as queryString from "query-string";
import { ParseOptions } from "query-string";
import { v4 as uuid } from "uuid";
import { WindowType } from "../types";
import { WMAction } from "./action";
import { getTopmostModal, getWindow, getWindows, getWindowsFromQuery } from "./selectors";

const defaultArrayFormat: ParseOptions["arrayFormat"] = `comma`;

//duplicated for reason
function extendQueryParams<T extends Record<string, unknown>>(params: T, arrayFormat = defaultArrayFormat): string {
  const queryParams = queryString.parse(window.location.search, { arrayFormat, parseNumbers: true });
  const resultParams = omitBy(Object.assign({}, queryParams, params), (e) => {
    return e == null || e === "" || e === 0 || e === [];
  });

  return queryString.stringify(resultParams, { arrayFormat });
}

function replaceQueryParams(params: Record<string, unknown>) {
  console.log({
    pathname: window.location.pathname,
    search: extendQueryParams(params),
  });
  // history.replace({
  //   pathname: window.location.pathname,
  //   search: extendQueryParams(params),
  // });
}

const defaults: Partial<WindowType> = {
  isModal: true,
  isResizable: true,
  shouldCloseOnEsc: true,
};

export function openWindow<Kind extends number | string = any, Meta = never>({
  id = uuid(),
  ...data
}: Partial<WindowType<Kind, Meta>>): WMAction<WindowType<Kind, Meta>> {
  const withDefaults = { ...defaults, ...data };
  return (dispatch, getState) => {
    const state = getState();
    const windowData = {
      ...withDefaults,
      id,
      focusParent: withDefaults.isModal ? id : getTopmostModal(state),
    };

    if (windowData.urlParam) {
      const [param, value] = windowData.urlParam;
      const { [param]: current = [] } = getWindowsFromQuery(state);
      replaceQueryParams({
        [param]: [...current, value],
      });
    }

    dispatch({ type: "OPEN_WINDOW", windowData });
    return windowData;
  };
}

export function closeWindow(id: string = null): WMAction {
  return async (dispatch, getState) => {
    const state = getState();
    await Promise.all(
      getWindows(state)
        .filter(({ parent }) => parent === id)
        .map(({ id }) => dispatch(closeWindow(id))),
    );
    dispatch({ type: "CLOSE_WINDOW", id });

    const currentWindow = getWindow(state, { id });
    if (currentWindow.urlParam) {
      const [param] = currentWindow.urlParam;
      const { [param]: current = [] } = getWindowsFromQuery(getState());
      replaceQueryParams({
        [param]: [...current],
      });
    }
  };
}

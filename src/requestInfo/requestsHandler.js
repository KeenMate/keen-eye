import {
  onCompleted,
  onHeadersReceived,
  onSendHeaders,
  onTabRemoved,
} from "../providers/chromeApiProvider";
import { fetchFilters, mainFrameFilters, extra } from "./requestInfoConstants";

export default function (requestInfoStore) {
  onSendHeaders(
    function (details) {
      requestInfoStore.mainFrameSend(details);
    },
    mainFrameFilters,
    extra.requestHeaders
  );
  onHeadersReceived(
    function (details) {
      requestInfoStore.mainFrameReceived(details);
    },
    mainFrameFilters,
    extra.responseHeaders
  );

  onSendHeaders(
    function (details) {
      requestInfoStore.requestSend(details);
    },
    fetchFilters,
    extra.requestHeaders
  );
  onHeadersReceived(
    function (details) {
      requestInfoStore.requestHeadersReceived(details);
    },
    fetchFilters,
    extra.responseHeaders
  );
  onCompleted(
    function (details) {
      requestInfoStore.requestComplete(details);
    },
    fetchFilters,
    extra.responseHeaders
  );

  onTabRemoved(function (details) {
    requestInfoStore.removeForTab(details);
  });
}

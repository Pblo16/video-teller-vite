import { WebWorkerMLCEngineHandler } from "@mlc-ai/web-llm";

const handler = new WebWorkerMLCEngineHandler();

// Initialize worker message handler
self.onmessage = function (event) {
  try {
    handler.onmessage(event);
  } catch (err) {
    // Send error back to main thread
    self.postMessage({
      kind: "error",
      error: err.message || "Unknown error in worker"
    });
  }
};

// Handle worker errors
self.onerror = function (error) {
  self.postMessage({
    kind: "error",
    error: error.message || "Unknown error in worker"
  });
};
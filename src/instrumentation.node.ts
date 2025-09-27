import process from "node:process";
import { NodeSDK } from "@opentelemetry/sdk-node";

import { resourceFromAttributes } from "@opentelemetry/resources";
import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
} from "@opentelemetry/semantic-conventions";
import { PeriodicExportingMetricReader } from "@opentelemetry/sdk-metrics";
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-http";
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-base";
import { SimpleLogRecordProcessor } from "@opentelemetry/sdk-logs";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";
import {
  getNodeAutoInstrumentations,
  getResourceDetectors,
} from "@opentelemetry/auto-instrumentations-node";
const _traceExporter = new OTLPTraceExporter({
  url: `${process.env.OTEL_EXPORTER_ENDPOINT}/v1/traces`,
});
const _spanProcessor = new BatchSpanProcessor(_traceExporter);
const logExporter = new OTLPLogExporter({
  url: `${process.env.OTEL_EXPORTER_ENDPOINT}/v1/logs`,
});
const logRecordProcessor = new SimpleLogRecordProcessor(logExporter);
const _metricReader = new PeriodicExportingMetricReader({
  exporter: new OTLPMetricExporter({
    url: `${process.env.OTEL_EXPORTER_ENDPOINT}/v1/metrics`,
  }),
  exportIntervalMillis: 1000,
});
const sdk = new NodeSDK({
  metricReader: _metricReader,
  resource: resourceFromAttributes({
    [ATTR_SERVICE_NAME]: "nclip-v2-nextjs",
    [ATTR_SERVICE_VERSION]: "2.0.7",
  }),
  instrumentations: getNodeAutoInstrumentations(),
  resourceDetectors: getResourceDetectors(),
  spanProcessor: _spanProcessor,
  traceExporter: _traceExporter,
  logRecordProcessors: [logRecordProcessor],
});
// this enables the API to record telemetry
sdk.start();

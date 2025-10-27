import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-http";
import {
  getNodeAutoInstrumentations,
  getResourceDetectors,
} from "@opentelemetry/auto-instrumentations-node";
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { BatchLogRecordProcessor } from "@opentelemetry/sdk-logs";
import { PeriodicExportingMetricReader } from "@opentelemetry/sdk-metrics";
import { SimpleSpanProcessor } from "@opentelemetry/sdk-trace-base";
import { ATTR_SERVICE_VERSION } from "@opentelemetry/semantic-conventions";
import { registerOTel } from "@vercel/otel";

export async function register() {
  if (process.env.USE_VERCEL_OTEL === "true") {
    console.log("Using Vercel OTel instrumentation");
    const _traceExporter = new OTLPTraceExporter({
      url: `${process.env.OTEL_EXPORTER_ENDPOINT}/v1/traces`,
    });
    const _spanProcessor = new SimpleSpanProcessor(_traceExporter);
    const logExporter = new OTLPLogExporter({
      url: `${process.env.OTEL_EXPORTER_ENDPOINT}/v1/logs`,
    });
    const logRecordProcessor = new BatchLogRecordProcessor(logExporter);
    const _metricReader = new PeriodicExportingMetricReader({
      exporter: new OTLPMetricExporter({
        url: `${process.env.OTEL_EXPORTER_ENDPOINT}/v1/metrics`,
      }),
      exportIntervalMillis: 15_000,
    });
    registerOTel({
      serviceName: "nextjs-service",
      attributes: {
        [ATTR_SERVICE_VERSION]: "1.0.0",
      },
      metricReaders: [_metricReader],
      spanProcessors: [_spanProcessor],
      traceExporter: _traceExporter,
      logRecordProcessors: [logRecordProcessor],
      instrumentations: getNodeAutoInstrumentations(),
      resourceDetectors: getResourceDetectors(),
    });
    return;
  }
  if (
    process.env.NEXT_RUNTIME === "nodejs" &&
    process.env.OTEL_EXPORTER_ENDPOINT
  ) {
    await import("./instrumentation.node.ts");
  }
}

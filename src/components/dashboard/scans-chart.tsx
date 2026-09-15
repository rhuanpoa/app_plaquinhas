import { Card, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatNumber, formatShortDate } from "@/lib/format";
import type { DailyScans } from "@/types";

const CHART_WIDTH = 900;
const CHART_HEIGHT = 200;
const GRID_LINES = [0, CHART_HEIGHT / 3, (CHART_HEIGHT * 2) / 3, CHART_HEIGHT];

function buildChartPaths(data: DailyScans[]) {
  const maxValue = Math.max(...data.map((day) => day.count), 1) * 1.1;
  const lastIndex = Math.max(data.length - 1, 1);
  const points = data.map((day, index) => {
    const x = (index / lastIndex) * CHART_WIDTH;
    const y = CHART_HEIGHT - (day.count / maxValue) * CHART_HEIGHT;
    return `${x.toFixed(1)} ${y.toFixed(1)}`;
  });

  return {
    line: points.map((point, index) => `${index === 0 ? "M" : "L"}${point}`).join(" "),
    area: `M0 ${CHART_HEIGHT} ${points.map((point) => `L${point}`).join(" ")} L${CHART_WIDTH} ${CHART_HEIGHT} Z`,
  };
}

interface ScansChartProps {
  data?: DailyScans[];
  total?: number;
}

export function ScansChart({ data, total }: ScansChartProps) {
  const ready = data !== undefined && data.length > 0 && total !== undefined;
  const paths = ready ? buildChartPaths(data) : null;

  return (
    <Card className="mb-[22px] px-[18px] pt-[18px] pb-3.5">
      <div className="mb-3.5 flex flex-wrap items-baseline justify-between gap-3">
        <CardTitle title="Acessos aos QR Codes" description="Últimos 30 dias" />
        {ready && (
          <p className="text-[13px] text-muted">
            <strong className="font-[620] text-ink tabular-nums">{formatNumber(total)}</strong> acessos
          </p>
        )}
      </div>

      {ready && paths ? (
        <>
          <svg
            viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
            preserveAspectRatio="none"
            role="img"
            aria-label={`Gráfico de acessos por dia nos últimos 30 dias. Total de ${formatNumber(total)} acessos.`}
            className="block h-[180px] w-full overflow-visible"
          >
            {GRID_LINES.map((y) => (
              <line
                key={y}
                x1="0"
                x2={CHART_WIDTH}
                y1={y}
                y2={y}
                className="stroke-chart-grid"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
            ))}
            <path d={paths.area} className="fill-accent/12" />
            <path
              d={paths.line}
              fill="none"
              className="stroke-accent"
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          <div className="mt-2 flex justify-between font-mono text-[11.5px] text-muted" aria-hidden>
            <span>{formatShortDate(data[0].date)}</span>
            <span>{formatShortDate(data[Math.floor(data.length / 2)].date)}</span>
            <span>{formatShortDate(data[data.length - 1].date)}</span>
          </div>
        </>
      ) : (
        <Skeleton className="h-[200px] w-full" />
      )}
    </Card>
  );
}

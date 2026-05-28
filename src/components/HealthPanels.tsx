import { addDays, format, startOfWeek } from "date-fns";
import { MoreHorizontal, Stethoscope, Brain, Activity } from "lucide-react";

const APPTS = [
  { time: "8:00 - 8:30 AM", title: "Dentist", doctor: "Dr. Dianne Fisher", loc: "CityMed Clinic", tone: "bg-warning/15", icon: Stethoscope },
  { time: "9:00 - 9:30 AM", title: "Neurologist", doctor: "Dr. Paul Collins", loc: "Huston Hospital", tone: "bg-accent", icon: Brain },
  { time: "18:00 - 18:30", title: "Digital X-Ray", doctor: "Dr. Betty Woods", loc: "CityMed Clinic", tone: "bg-destructive/10", icon: Activity },
];

export function CalendarStrip() {
  const start = startOfWeek(new Date(), { weekStartsOn: 1 });
  const today = new Date().getDay();
  const days = Array.from({ length: 10 }, (_, i) => addDays(start, i));
  return (
    <div className="flex items-center justify-between gap-1 overflow-x-auto">
      {days.map((d, i) => {
        const isToday = d.getDay() === today && i < 7;
        return (
          <div
            key={i}
            className={`flex min-w-[42px] flex-col items-center rounded-2xl px-2 py-1.5 text-xs ${
              isToday ? "bg-warning text-warning-foreground" : "text-muted-foreground"
            }`}
          >
            <span className="text-[10px] uppercase">{format(d, "EEE")}</span>
            <span className={`mt-1 text-sm font-semibold ${isToday ? "" : "text-foreground"}`}>
              {format(d, "d")}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function AppointmentsList() {
  return (
    <div className="space-y-2">
      {APPTS.map((a) => (
        <div key={a.title} className={`flex items-center gap-3 rounded-2xl ${a.tone} p-3`}>
          <div className="hidden text-right text-[11px] font-medium text-foreground/70 sm:block sm:w-20">
            {a.time}
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-card text-primary shadow-soft">
            <a.icon className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{a.title}</p>
            <p className="truncate text-xs text-muted-foreground">{a.doctor}</p>
          </div>
          <div className="hidden text-right text-[11px] text-muted-foreground sm:block">{a.loc}</div>
          <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
        </div>
      ))}
      <p className="pr-1 text-right text-xs text-muted-foreground">View more →</p>
    </div>
  );
}

export function BloodPressureChart() {
  const pts = [80, 110, 140, 130, 95, 120, 145, 130, 100, 115, 95];
  const max = 160, min = 70;
  const w = 320, h = 110;
  const step = w / (pts.length - 1);
  const norm = (v: number) => h - ((v - min) / (max - min)) * h;
  const path = pts.map((v, i) => `${i === 0 ? "M" : "L"} ${i * step} ${norm(v)}`).join(" ");
  const area = `${path} L ${w} ${h} L 0 ${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h + 20}`} className="w-full">
      <defs>
        <linearGradient id="bp" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.78 0.16 55)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="oklch(0.78 0.16 55)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#bp)" />
      <path d={path} fill="none" stroke="oklch(0.70 0.18 50)" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx={5 * step} cy={norm(pts[5])} r="4" fill="oklch(0.70 0.18 50)" />
      {["8:00", "11:00", "14:00", "17:00", "20:00", "23:00"].map((l, i) => (
        <text key={l} x={(i * w) / 5} y={h + 14} fontSize="9" fill="oklch(0.55 0.02 240)" textAnchor="middle">
          {l}
        </text>
      ))}
    </svg>
  );
}

export function ActivityBars() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const vals = [40, 55, 85, 60, 50, 35, 45];
  return (
    <div className="flex h-28 items-end justify-between gap-2 pt-2">
      {days.map((d, i) => {
        const isPeak = vals[i] === Math.max(...vals);
        return (
          <div key={d} className="flex flex-1 flex-col items-center gap-1.5">
            {isPeak && <span className="text-[10px] font-semibold text-foreground">85%</span>}
            <div
              className={`w-full rounded-t-lg ${isPeak ? "bg-warning" : "bg-accent"}`}
              style={{ height: `${vals[i]}%` }}
            />
            <span className="text-[10px] text-muted-foreground">{d}</span>
          </div>
        );
      })}
    </div>
  );
}

export function HeartRateCard() {
  return (
    <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-2xl bg-gradient-hero p-5 text-primary-foreground shadow-elegant">
      <p className="text-sm font-medium opacity-90">Heart rate</p>
      <svg viewBox="0 0 200 60" className="absolute inset-x-0 top-12 w-full opacity-70">
        <path
          d="M0 30 L40 30 L50 10 L60 50 L70 20 L80 40 L90 30 L130 30 L140 12 L150 48 L160 28 L200 28"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <div className="mt-auto">
        <p className="text-4xl font-bold leading-none">
          102<span className="ml-1 text-base font-medium opacity-90">bpm</span>
        </p>
      </div>
    </div>
  );
}

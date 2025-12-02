import { useBattery } from "react-use";
import { Wifi, Battery, Cpu, HardDrive, Activity, Radio } from "lucide-react";

export function StatusWidget() {
  const battery = useBattery();
  
  // Safe access to battery level with fallback
  const batteryLevel = 'level' in battery ? (battery.level * 100).toFixed(0) : '100';
  
  return (
    <div className="glass-panel p-4 rounded-lg border border-primary/20 flex flex-col gap-4">
      <h3 className="text-xs font-display tracking-widest text-primary border-b border-primary/20 pb-2">SYSTEM STATUS</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded text-primary">
            <Battery className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-muted-foreground">POWER</div>
            <div className="text-sm font-mono">{batteryLevel}%</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded text-primary">
            <Wifi className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-muted-foreground">NETWORK</div>
            <div className="text-sm font-mono">SECURE</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded text-primary">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-muted-foreground">CPU</div>
            <div className="text-sm font-mono">OPTIMAL</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded text-primary">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-muted-foreground">UPTIME</div>
            <div className="text-sm font-mono">00:42:15</div>
          </div>
        </div>
      </div>

      <div className="mt-2">
        <div className="flex justify-between text-[10px] mb-1 text-primary/70">
          <span>MEMORY INTEGRITY</span>
          <span>98%</span>
        </div>
        <div className="h-1 w-full bg-primary/10 rounded-full overflow-hidden">
          <div className="h-full bg-primary w-[98%] shadow-[0_0_10px_rgba(0,243,255,0.5)]"></div>
        </div>
      </div>
    </div>
  );
}

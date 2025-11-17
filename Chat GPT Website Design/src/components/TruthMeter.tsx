import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";

interface TruthMeterProps {
  score: number;
  size?: "tiny" | "small" | "large";
}

export function TruthMeter({ score, size = "small" }: TruthMeterProps) {
  const getColor = (score: number) => {
    if (score >= 70) return "text-green-600";
    if (score >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  const getBgColor = (score: number) => {
    if (score >= 70) return "bg-green-50 border-green-200";
    if (score >= 40) return "bg-yellow-50 border-yellow-200";
    return "bg-red-50 border-red-200";
  };

  const getProgressColor = (score: number) => {
    if (score >= 70) return "bg-green-600";
    if (score >= 40) return "bg-yellow-600";
    return "bg-red-600";
  };

  const getIcon = (score: number) => {
    if (score >= 70) return <CheckCircle2 className="w-4 h-4" />;
    if (score >= 40) return <AlertTriangle className="w-4 h-4" />;
    return <XCircle className="w-4 h-4" />;
  };

  const getLabel = (score: number) => {
    if (score >= 70) return "신뢰도 높음";
    if (score >= 40) return "검증 필요";
    return "신뢰도 낮음";
  };

  if (size === "large") {
    return (
      <div className={`rounded-lg border-2 p-4 ${getBgColor(score)}`}>
        <div className="flex items-center gap-3 mb-3">
          <div className={getColor(score)}>{getIcon(score)}</div>
          <div className="flex-1">
            <p className="text-sm text-gray-600">사실 확인 결과</p>
            <p className={`font-semibold ${getColor(score)}`}>{getLabel(score)}</p>
          </div>
          <div className={`text-3xl ${getColor(score)}`}>{score}%</div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full ${getProgressColor(score)} transition-all duration-500 rounded-full`}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>
    );
  }

  if (size === "tiny") {
    return (
      <div className="flex items-center gap-1">
        <span className={`font-semibold text-sm ${getColor(score)}`}>{score}%</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${getBgColor(score)}`}>
      <div className={getColor(score)}>{getIcon(score)}</div>
      <div className="flex items-center gap-2">
        <span className={`font-semibold ${getColor(score)}`}>{score}%</span>
        <span className="text-xs text-gray-600">{getLabel(score)}</span>
      </div>
    </div>
  );
}

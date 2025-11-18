import { TrendingUp } from "lucide-react";

interface RankingItem {
  rank: number;
  id: number;
  title: string;
  category: string;
  views: string;
}

interface RankingListProps {
  items: RankingItem[];
  onItemClick: (id: number) => void;
}

export function RankingList({
  items,
  onItemClick,
}: RankingListProps) {
  return (
    <div className="sticky top-4 bg-white rounded-xl shadow-lg p-4 border border-gray-200">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200">
        <TrendingUp className="w-5 h-5 text-purple-600" />
        <h3 className="font-semibold text-gray-900">실시간 인기 컨텐츠</h3>
      </div>

      {/* Ranking List */}
      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => onItemClick(item.id)}
            className="flex gap-2.5 cursor-pointer hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 p-2 rounded-lg transition-all group"
          >
            {/* Rank Number */}
            <div
              className={`flex-shrink-0 w-6 h-6 flex items-center justify-center rounded text-sm ${
                item.rank <= 3
                  ? "bg-gradient-to-br from-purple-600 to-pink-600 text-white font-bold shadow-md"
                  : "bg-gray-100 text-gray-600 font-semibold"
              }`}
            >
              {item.rank}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-sm leading-snug line-clamp-1 group-hover:text-purple-600 transition-colors mb-1 font-medium">
                {item.title}
              </p>
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-purple-600 font-semibold">
                  {item.category}
                </span>
                <span className="text-gray-300">•</span>
                <span className="text-gray-500">
                  {item.views}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
import { X } from "lucide-react";
import { TruthMeter } from "./TruthMeter";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface ContentItem {
  id: number;
  caption: string;
  image: string;
  truthScore: number;
  category: string;
  timeAgo: string;
  sourceName: string;
}

interface ContentSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  items: ContentItem[];
  onItemClick: (id: number) => void;
}

export function ContentSheet({
  isOpen,
  onClose,
  title,
  items,
  onItemClick,
}: ContentSheetProps) {
  if (!isOpen) return null;

  // 진실도에 따른 배경색
  const getScoreColor = (score: number) => {
    if (score >= 70) return "bg-green-50 border-green-200";
    if (score >= 40) return "bg-yellow-50 border-yellow-200";
    return "bg-red-50 border-red-200";
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="fixed top-0 right-0 h-full w-full max-w-xl bg-white shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-semibold">{title}</h2>
            <p className="text-sm text-gray-500 mt-1">
              {items.length}개의 컨텐츠
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content List */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <p>아직 컨텐츠가 없습니다</p>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    onItemClick(item.id);
                    onClose();
                  }}
                  className={`border-2 rounded-lg p-4 cursor-pointer hover:shadow-lg transition-all ${getScoreColor(
                    item.truthScore,
                  )}`}
                >
                  <div className="flex gap-4">
                    {/* Thumbnail */}
                    <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <ImageWithFallback
                        src={item.image}
                        alt={item.caption}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Content Info */}
                    <div className="flex-1 min-w-0">
                      {/* Category & Source */}
                      <div className="flex items-center gap-2 mb-2">
                        <span className="inline-block px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded">
                          {item.category}
                        </span>
                        <span className="text-xs text-gray-500">
                          {item.sourceName}
                        </span>
                      </div>

                      {/* Caption */}
                      <h3 className="font-semibold text-sm line-clamp-2 mb-2">
                        {item.caption}
                      </h3>

                      {/* Meta */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {item.timeAgo}
                        </span>
                        <div className="flex items-center gap-2">
                          <TruthMeter
                            score={item.truthScore}
                            size="tiny"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
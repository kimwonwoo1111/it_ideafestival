import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Eye, MessageCircle, ExternalLink, Youtube, CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import { TruthMeter } from "./TruthMeter";

//import { motion } from "motion/react";
import { motion } from "framer-motion";


interface FeedItemProps {
  id: number;
  username: string;
  userAvatar: string;
  image: string;
  caption: string;
  likes: number;
  comments: number;
  timeAgo: string;
  category?: string;
  truthScore: number;
  sourceType: "youtube" | "news" | "article";
  sourceUrl: string;
  sourceName: string;
  onClick: () => void;
}

export function FeedItem({
  id,
  username,
  image,
  caption,
  likes,
  comments,
  timeAgo,
  category,
  truthScore,
  sourceType,
  sourceUrl,
  sourceName,
  onClick,
}: FeedItemProps) {
  // 진실도에 따른 스타일 (미니멀한 접근)
  const getScoreStyle = (score: number) => {
    if (score >= 70) return {
      badge: "bg-emerald-500",
      text: "text-emerald-700",
      icon: CheckCircle2,
      label: "검증됨"
    };
    if (score >= 40) return {
      badge: "bg-amber-500",
      text: "text-amber-700",
      icon: AlertCircle,
      label: "불확실"
    };
    return {
      badge: "bg-rose-500",
      text: "text-rose-700",
      icon: XCircle,
      label: "의심"
    };
  };

  const scoreStyle = getScoreStyle(truthScore);
  const ScoreIcon = scoreStyle.icon;
  
  // 각 피드마다 고유한 gradient ID 생성
  const gradientId = `gradient-${id}`;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.005 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="relative bg-gradient-to-br from-white via-white to-gray-50/50 rounded-3xl overflow-hidden cursor-pointer border-2 border-gray-200/60 hover:border-gray-300 shadow-lg shadow-gray-200/50 hover:shadow-2xl hover:shadow-gray-300/40 transition-all duration-300 group"
      onClick={onClick}
    >
      {/* Gradient Accent Line */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${
        truthScore >= 70 
          ? 'bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600' 
          : truthScore >= 40 
          ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600' 
          : 'bg-gradient-to-r from-rose-400 via-rose-500 to-rose-600'
      }`} />
      
      <div className="flex gap-5 p-6">
        {/* Image with Enhanced Effects */}
        <div className="relative w-80 h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden flex-shrink-0 shadow-md">
          <ImageWithFallback
            src={image}
            alt={caption}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
          />
          {/* Image Overlay on Hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Floating Category Badge on Image */}
          {category && (
            <div className="absolute top-3 left-3">
              <span className="inline-flex items-center px-3 py-1.5 bg-white/95 backdrop-blur-sm text-gray-900 text-xs rounded-full font-semibold shadow-lg border border-gray-200/50">
                {category}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between min-w-0">
          {/* Header */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              {/* Source Badge with Icon */}
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 text-xs rounded-full border border-gray-200 shadow-sm">
                {sourceType === "youtube" ? (
                  <Youtube className="w-3.5 h-3.5 text-red-500" />
                ) : (
                  <ExternalLink className="w-3.5 h-3.5 text-blue-500" />
                )}
                <span className="font-medium">{sourceName}</span>
              </span>
              {/* Truth Badge - Prominent */}
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 ${scoreStyle.text} bg-gradient-to-r ${
                truthScore >= 70 
                  ? 'from-emerald-50 to-emerald-100/50' 
                  : truthScore >= 40 
                  ? 'from-amber-50 to-amber-100/50' 
                  : 'from-rose-50 to-rose-100/50'
              } rounded-full text-xs font-bold border-2 border-current/30 shadow-sm`}>
                <ScoreIcon className="w-3.5 h-3.5" />
                {scoreStyle.label}
              </span>
            </div>
            
            {/* Title - More Prominent */}
            <h3 className="text-xl font-bold mb-3 line-clamp-2 text-gray-900 leading-snug group-hover:text-gray-700 transition-colors">
              {caption}
            </h3>
          </div>

          {/* Meta Info */}
          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-900 font-semibold">@{username}</span>
            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
            <span className="text-gray-600 font-medium">{timeAgo}</span>
            <div className="ml-auto flex items-center gap-5">
              <span className="flex items-center gap-2 text-gray-700 bg-gray-100 px-3 py-1.5 rounded-full">
                <Eye className="w-4 h-4" />
                <span className="font-semibold">{(likes / 1000).toFixed(1)}k</span>
              </span>
              <span className="flex items-center gap-2 text-gray-700 bg-gray-100 px-3 py-1.5 rounded-full">
                <MessageCircle className="w-4 h-4" />
                <span className="font-semibold">{comments}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Truth Score - Enhanced Circular Display */}
        <div className="flex-shrink-0 flex items-center justify-center">
          <div className="relative w-28 h-28">
            {/* Glow Effect */}
            <div className={`absolute inset-0 rounded-full blur-xl opacity-20 ${
              truthScore >= 70 
                ? 'bg-emerald-500' 
                : truthScore >= 40 
                ? 'bg-amber-500' 
                : 'bg-rose-500'
            }`} />
            
            {/* Background Circle */}
            <svg className="w-28 h-28 transform -rotate-90" viewBox="0 0 100 100">
              {/* Background track with gradient */}
              <circle
                cx="50"
                cy="50"
                r="42"
                stroke="currentColor"
                strokeWidth="6"
                fill="none"
                className="text-gray-200"
              />
              {/* Progress circle with enhanced styling */}
              <circle
                cx="50"
                cy="50"
                r="42"
                stroke={`url(#${gradientId})`}
                strokeWidth="6"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 42}`}
                strokeDashoffset={`${2 * Math.PI * 42 * (1 - truthScore / 100)}`}
                strokeLinecap="round"
                className="drop-shadow-md"
              />
              {/* Gradient definition */}
              <defs>
                <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={truthScore >= 70 ? '#10b981' : truthScore >= 40 ? '#f59e0b' : '#f43f5e'} />
                  <stop offset="100%" stopColor={truthScore >= 70 ? '#059669' : truthScore >= 40 ? '#d97706' : '#e11d48'} />
                </linearGradient>
              </defs>
            </svg>
            {/* Center content with enhanced styling */}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white rounded-full m-3 shadow-inner">
              <ScoreIcon className={`w-6 h-6 mb-1 ${scoreStyle.text} drop-shadow-sm`} />
              <span className={`text-3xl font-black ${scoreStyle.text} tracking-tight`}>
                {truthScore}
              </span>
              <span className="text-xs text-gray-500 font-bold -mt-1">%</span>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

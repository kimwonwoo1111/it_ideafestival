import {
  X,
  Bookmark,
  BookmarkCheck,
  ArrowBigUp,
  ArrowBigDown,
  Link as LinkIcon,
  Image as ImageIcon,
  CheckCircle,
  XCircle,
  ExternalLink,
  Youtube,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ScrollArea } from "./ui/scroll-area";
import { TruthMeter } from "./TruthMeter";
import { Badge } from "./ui/badge";

interface Evidence {
  id: number;
  username: string;
  text: string;
  timeAgo: string;
  upvotes: number;
  type: "support" | "refute";
  evidenceType?: "link" | "image" | "text";
  imageUrl?: string;
  linkUrl?: string;
  linkTitle?: string;
}

interface FeedModalProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
  image: string;
  caption: string;
  likes: number;
  comments: Evidence[];
  timeAgo: string;
  truthScore: number;
  sourceType: "youtube" | "news" | "article";
  sourceUrl: string;
  sourceName: string;
  onSubmitEvidence?: (evidence: Omit<Evidence, "id" | "timeAgo">) => void;
}

export function FeedModal({
  isOpen,
  onClose,
  username,
  image,
  caption,
  likes,
  comments,
  timeAgo,
  truthScore,
  sourceType,
  sourceUrl,
  sourceName,
  onSubmitEvidence,
}: FeedModalProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [evidenceText, setEvidenceText] = useState("");
  const [evidenceType, setEvidenceType] = useState<
    "support" | "refute" | null
  >(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkTitle, setLinkTitle] = useState("");
  const [attachedLink, setAttachedLink] = useState<{url: string; title: string} | null>(null);

  // 다른 피드로 이동할 때 저장 상태 초기화
  useEffect(() => {
    setIsSaved(false);
    setEvidenceText("");
    setEvidenceType(null);
    setAttachedLink(null);
    setLinkUrl("");
    setLinkTitle("");
  }, [caption, image]);

  // 모달이 열렸을 때 body 스크롤 막기
  useEffect(() => {
    if (isOpen) {
      // 스크롤바 너비 계산
      const scrollbarWidth =
        window.innerWidth -
        document.documentElement.clientWidth;

      // body 스크롤 막기
      document.body.style.overflow = "hidden";
      // 스크롤바가 사라지면서 생기는 레이아웃 시프트 방지
      document.body.style.paddingRight = `${scrollbarWidth}px`;

      return () => {
        // 모달이 닫힐 때 원래 상태로 복원
        document.body.style.overflow = "";
        document.body.style.paddingRight = "";
      };
    }
  }, [isOpen]);

  const handleSave = () => {
    setIsSaved(!isSaved);
    if (!isSaved) {
      toast.success("저장되었습니다", {
        duration: 1000,
        position: "bottom-center",
      });
    } else {
      toast.info("저장이 취소되었습니다", {
        duration: 1000,
        position: "bottom-center",
      });
    }
  };

  // AI 자동 판단 (현재는 랜덤)
  useEffect(() => {
    if (evidenceText.trim().length > 10) {
      setIsAnalyzing(true);

      // 타이핑이 멈춘 후 분석 (debounce)
      const timer = setTimeout(() => {
        // 랜덤으로 Support 또는 Refute 결정
        const randomType =
          Math.random() > 0.5 ? "support" : "refute";
        setEvidenceType(randomType);
        setIsAnalyzing(false);
      }, 800);

      return () => clearTimeout(timer);
    } else {
      setEvidenceType(null);
      setIsAnalyzing(false);
    }
  }, [evidenceText]);

  const handleAddLink = () => {
    if (!linkUrl.trim()) {
      toast.error("링크 URL을 입력해주세요");
      return;
    }

    try {
      new URL(linkUrl);
    } catch {
      toast.error("올바른 URL 형식이 아닙니다");
      return;
    }

    setAttachedLink({
      url: linkUrl,
      title: linkTitle.trim() || linkUrl,
    });
    setShowLinkDialog(false);
    setLinkUrl("");
    setLinkTitle("");
    toast.success("링크가 추가되었습니다");
  };

  const handleSubmitEvidence = () => {
    if (!evidenceText.trim()) {
      toast.error("내용을 입력해주세요");
      return;
    }

    if (!evidenceType) {
      toast.error("Support 또는 Refute를 선택해주세요");
      return;
    }

    const newEvidence: Omit<Evidence, "id" | "timeAgo"> = {
      username: "나",
      text: evidenceText,
      upvotes: 0,
      type: evidenceType,
      evidenceType: attachedLink ? "link" : "text",
      ...(attachedLink && {
        linkUrl: attachedLink.url,
        linkTitle: attachedLink.title,
      }),
    };

    if (onSubmitEvidence) {
      onSubmitEvidence(newEvidence);
    }

    // 입력 필드 초기화
    setEvidenceText("");
    setEvidenceType(null);
    setAttachedLink(null);
    toast.success("근거가 제출되었습니다!");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-gradient-to-br from-black/95 via-purple-900/20 to-black/95 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Link Dialog */}
          <AnimatePresence>
            {showLinkDialog && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="fixed inset-0 z-[60] flex items-center justify-center p-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  className="absolute inset-0 bg-black/50"
                  onClick={() => setShowLinkDialog(false)}
                />
                <div className="relative bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg">링크 추가</h3>
                    <button
                      onClick={() => setShowLinkDialog(false)}
                      className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-600 mb-1 block">
                        URL
                      </label>
                      <input
                        type="url"
                        value={linkUrl}
                        onChange={(e) => setLinkUrl(e.target.value)}
                        placeholder="https://example.com"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 mb-1 block">
                        링크 제목 (선택사항)
                      </label>
                      <input
                        type="text"
                        value={linkTitle}
                        onChange={(e) => setLinkTitle(e.target.value)}
                        placeholder="링크에 대한 설명"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowLinkDialog(false)}
                        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all font-medium"
                      >
                        취소
                      </button>
                      <button
                        onClick={handleAddLink}
                        className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-md transition-all font-medium"
                      >
                        추가
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Modal Content - 2 Column Layout */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative w-full max-w-7xl max-h-[90vh] bg-white rounded-2xl overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] border border-gray-100"
          >
            {/* Top Action Buttons - Fixed */}
            <div className="absolute top-6 right-6 z-10 flex items-center gap-3">
              {/* Save Button */}
              <motion.button
                onClick={handleSave}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-5 py-2.5 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl backdrop-blur-sm flex items-center gap-2 font-semibold ${
                  isSaved
                    ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white"
                    : "bg-white/90 hover:bg-white text-gray-700 hover:text-yellow-600"
                }`}
              >
                {isSaved ? (
                  <>
                    <BookmarkCheck className="w-5 h-5" />
                    <span>저장됨</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="w-5 h-5" />
                    <span>저장</span>
                  </>
                )}
              </motion.button>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="p-2.5 bg-white/90 hover:bg-white backdrop-blur-sm rounded-full transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-110 group"
              >
                <X className="w-5 h-5 text-gray-700 group-hover:text-gray-900 transition-colors" />
              </button>
            </div>

            {/* 2 Column Layout */}
            <div className="flex h-full max-h-[90vh]">
              {/* Left Column - Main Content */}
              <div className="flex-1 flex flex-col overflow-hidden bg-black">
                {/* Image with overlay info */}
                <div className="w-full aspect-video relative overflow-hidden flex-shrink-0 group">
                  <ImageWithFallback
                    src={image}
                    alt={caption}
                    className="w-full h-full object-cover"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80" />

                  {/* User info overlay on image */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center ring-2 ring-white/30">
                        <span className="font-semibold">
                          {username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">
                          @{username}
                        </p>
                        <p className="text-white/80 text-sm">
                          {timeAgo}
                        </p>
                      </div>

                      {/* Source icon on the right */}
                      <a
                        href={sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-full transition-all duration-200 group/link border border-white/20"
                      >
                        {sourceType === "youtube" ? (
                          <Youtube className="w-4 h-4" />
                        ) : (
                          <ExternalLink className="w-4 h-4" />
                        )}
                        <span className="text-sm">Source</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Info Section - Clean and minimal */}
                <div className="flex-1 overflow-y-auto bg-white">
                  <div className="p-8">
                    {/* Caption/Title - Emphasized */}
                    <h1 className="text-2xl font-bold text-gray-900 leading-tight mb-6 tracking-tight">
                      {caption}
                    </h1>

                    {/* Source info - minimal */}
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-8 pb-8 border-b border-gray-100">
                      {sourceType === "youtube" ? (
                        <Youtube className="w-4 h-4 text-red-500" />
                      ) : (
                        <ExternalLink className="w-4 h-4 text-blue-500" />
                      )}
                      <span className="truncate">
                        {sourceName}
                      </span>
                    </div>

                    {/* Truth Score - Clean and prominent */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          Truth Score
                        </span>
                        <span
                          className={`text-5xl font-bold tabular-nums ${
                            truthScore >= 70
                              ? "text-green-600"
                              : truthScore >= 40
                                ? "text-yellow-600"
                                : "text-red-600"
                          }`}
                        >
                          {truthScore}%
                        </span>
                      </div>

                      {/* Progress bar */}
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${truthScore}%` }}
                          transition={{
                            duration: 1,
                            ease: "easeOut",
                          }}
                          className={`h-full rounded-full ${
                            truthScore >= 70
                              ? "bg-gradient-to-r from-green-500 to-green-600"
                              : truthScore >= 40
                                ? "bg-gradient-to-r from-yellow-500 to-yellow-600"
                                : "bg-gradient-to-r from-red-500 to-red-600"
                          }`}
                        />
                      </div>

                      {/* Label */}
                      <p
                        className={`text-sm font-semibold ${
                          truthScore >= 70
                            ? "text-green-600"
                            : truthScore >= 40
                              ? "text-yellow-600"
                              : "text-red-600"
                        }`}
                      >
                        {truthScore >= 70
                          ? "Highly Credible"
                          : truthScore >= 40
                            ? "Partially Credible"
                            : "Low Credibility"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Evidence Section */}
              <div className="w-[480px] border-l border-gray-200 bg-gray-50 flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="p-5 border-b border-gray-200 bg-white flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {comments.length} Evidence Submissions
                      </p>
                      <p className="text-xs text-gray-500">
                        Sorted by community votes
                      </p>
                    </div>
                  </div>
                </div>

                {/* Evidence List - Scrollable */}
                <div className="flex-1 overflow-y-auto min-h-0">
                  <div className="p-4 space-y-3">
                    {comments.map((evidence) => (
                      <motion.div
                        key={evidence.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`border-2 rounded-xl p-4 transition-all duration-200 hover:shadow-md bg-white ${
                          evidence.type === "support"
                            ? "border-green-200 hover:border-green-300"
                            : "border-red-200 hover:border-red-300"
                        }`}
                      >
                        <div className="flex gap-3">
                          {/* Vote Section - Credibility Rating */}
                          <div className="flex flex-col items-center gap-1.5 min-w-[44px]">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="group p-1.5 rounded-lg hover:bg-gradient-to-br hover:from-green-50 hover:to-emerald-50 transition-all duration-200 hover:shadow-sm"
                            >
                              <ArrowBigUp className="w-5 h-5 text-gray-400 group-hover:text-green-600 group-hover:fill-green-100 transition-all duration-200" />
                            </motion.button>
                            <span className="text-xs font-bold text-gray-700 px-2 py-0.5 bg-gradient-to-br from-gray-100 to-gray-50 rounded-full border border-gray-200 shadow-sm">
                              {evidence.upvotes}
                            </span>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="group p-1.5 rounded-lg hover:bg-gradient-to-br hover:from-red-50 hover:to-rose-50 transition-all duration-200 hover:shadow-sm"
                            >
                              <ArrowBigDown className="w-5 h-5 text-gray-400 group-hover:text-red-600 group-hover:fill-red-100 transition-all duration-200" />
                            </motion.button>
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            {/* Header */}
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                                <span className="text-white text-xs font-semibold">
                                  {evidence.username
                                    .charAt(0)
                                    .toUpperCase()}
                                </span>
                              </div>
                              <p className="font-semibold text-xs text-gray-900 truncate">
                                {evidence.username}
                              </p>
                              <span className="text-gray-400 text-xs">
                                •
                              </span>
                              <p className="text-gray-500 text-xs">
                                {evidence.timeAgo}
                              </p>
                            </div>

                            {/* Type Badge */}
                            <Badge
                              variant={
                                evidence.type === "support"
                                  ? "defualt"
                                  : "destructive"
                              }
                              className="mb-2 text-xs"
                            >
                              {evidence.type === "support" ? (
                                <>
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Supports
                                </>
                              ) : (
                                <>
                                  <XCircle className="w-3 h-3 mr-1" />
                                  Refutes
                                </>
                              )}
                            </Badge>

                            {/* Evidence Text */}
                            <p className="text-gray-800 text-sm leading-relaxed mb-2">
                              {evidence.text}
                            </p>

                            {/* Evidence Media/Link */}
                            {evidence.evidenceType ===
                              "image" &&
                              evidence.imageUrl && (
                                <div className="mt-2 rounded-lg overflow-hidden border border-gray-200">
                                  <ImageWithFallback
                                    src={evidence.imageUrl}
                                    alt="Evidence"
                                    className="w-full max-h-32 object-cover"
                                  />
                                </div>
                              )}

                            {evidence.evidenceType === "link" &&
                              evidence.linkUrl && (
                                <a
                                  href={evidence.linkUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="mt-2 flex items-center gap-2 p-2 bg-gray-50 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50/30 transition-all duration-200 group"
                                >
                                  <div className="w-6 h-6 rounded bg-blue-100 flex items-center justify-center flex-shrink-0">
                                    <LinkIcon className="w-3 h-3 text-blue-600" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-semibold text-blue-600 truncate">
                                      {evidence.linkTitle ||
                                        "Source Link"}
                                    </p>
                                  </div>
                                  <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-blue-600 flex-shrink-0 transition-colors" />
                                </a>
                              )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Evidence Input - Fixed at Bottom */}
                <div className="border-t border-gray-200 p-4 bg-white flex-shrink-0 shadow-[0_-4px_12px_-2px_rgba(0,0,0,0.08)]">
                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles
                        className={`w-4 h-4 transition-all duration-300 ${isAnalyzing ? "text-purple-500 animate-pulse" : "text-purple-500"}`}
                      />
                      <p className="font-semibold text-sm text-gray-900">
                        Submit Evidence
                      </p>
                      {isAnalyzing && (
                        <motion.span
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="text-xs text-purple-600 font-medium"
                        >
                          AI 분석 중...
                        </motion.span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <motion.button
                        animate={
                          evidenceType === "support"
                            ? { scale: [1, 1.05, 1] }
                            : {}
                        }
                        transition={{ duration: 0.3 }}
                        className={`flex-1 px-3 py-2 border-2 rounded-lg transition-all duration-200 text-sm font-semibold ${
                          evidenceType === "support"
                            ? "border-green-500 bg-green-50 text-green-700 shadow-md"
                            : "border-gray-200 text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        <CheckCircle
                          className={`w-3.5 h-3.5 inline mr-1 transition-all duration-200 ${
                            evidenceType === "support"
                              ? "animate-pulse"
                              : ""
                          }`}
                        />
                        Support
                      </motion.button>
                      <motion.button
                        animate={
                          evidenceType === "refute"
                            ? { scale: [1, 1.05, 1] }
                            : {}
                        }
                        transition={{ duration: 0.3 }}
                        className={`flex-1 px-3 py-2 border-2 rounded-lg transition-all duration-200 text-sm font-semibold ${
                          evidenceType === "refute"
                            ? "border-red-500 bg-red-50 text-red-700 shadow-md"
                            : "border-gray-200 text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        <XCircle
                          className={`w-3.5 h-3.5 inline mr-1 transition-all duration-200 ${
                            evidenceType === "refute"
                              ? "animate-pulse"
                              : ""
                          }`}
                        />
                        Refute
                      </motion.button>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="flex-1">
                      <textarea
                        value={evidenceText}
                        onChange={(e) =>
                          setEvidenceText(e.target.value)
                        }
                        placeholder="글을 입력하세요."
                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all resize-none text-sm"
                        rows={2}
                      />
                      {attachedLink && (
                        <div className="mt-2 flex items-center gap-2 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                          <LinkIcon className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                          <p className="text-xs text-blue-700 truncate flex-1">
                            {attachedLink.title}
                          </p>
                          <button
                            onClick={() => setAttachedLink(null)}
                            className="p-0.5 hover:bg-blue-100 rounded transition-colors"
                          >
                            <X className="w-3.5 h-3.5 text-blue-600" />
                          </button>
                        </div>
                      )}
                      <div className="flex gap-2 mt-2">
                        <button className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 text-xs font-medium">
                          <ImageIcon className="w-3.5 h-3.5" />
                          Image
                        </button>
                        <button className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 text-xs font-medium" onClick={() => setShowLinkDialog(true)}>
                          <LinkIcon className="w-3.5 h-3.5" />
                          Link
                        </button>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 font-semibold text-sm shadow-lg hover:shadow-xl" onClick={handleSubmitEvidence}>
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
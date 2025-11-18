import { X, Search } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";

interface Post {
  id: number;
  username: string;
  caption: string;
  image: string;
  truthScore: number;
  category: string;
  timeAgo: string;
  sourceName: string;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  posts: Post[];
  onPostClick: (id: number) => void;
}

export function SearchModal({
  isOpen,
  onClose,
  posts,
  onPostClick,
}: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Post[]>([]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    // 키워드로 caption(제목) 검색
    const query = searchQuery.toLowerCase().trim();
    const results = posts.filter((post) =>
      post.caption.toLowerCase().includes(query)
    );
    setSearchResults(results);
  }, [searchQuery, posts]);

  // 모달 열릴 때 검색어 초기화
  useEffect(() => {
    if (isOpen) {
      setSearchQuery("");
      setSearchResults([]);
    }
  }, [isOpen]);

  // ESC 키로 닫기
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  // 모달이 열렸을 때 body 스크롤 막기
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [isOpen]);

  const handlePostClick = (id: number) => {
    onPostClick(id);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-20">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Search Container */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative w-full max-w-3xl"
          >
            {/* Search Input */}
            <div className="relative mb-4">
              <div className="absolute left-5 top-1/2 transform -translate-y-1/2">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="키워드를 입력하세요..."
                autoFocus
                className="w-full pl-14 pr-14 py-4 rounded-2xl bg-white border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-all shadow-xl text-lg"
              />
              <button
                onClick={onClose}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Search Results */}
            {searchQuery.trim() && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-2xl max-h-[500px] overflow-y-auto"
              >
                {searchResults.length > 0 ? (
                  <div className="p-3">
                    <p className="text-sm text-gray-500 px-3 py-2">
                      {searchResults.length}개의 결과
                    </p>
                    <div className="space-y-2">
                      {searchResults.map((post) => (
                        <motion.div
                          key={post.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          whileHover={{ scale: 1.01 }}
                          onClick={() => handlePostClick(post.id)}
                          className="flex gap-4 p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-all"
                        >
                          {/* Thumbnail */}
                          <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                            <img
                              src={post.image}
                              alt={post.caption}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-3 mb-2">
                              <h3 className="font-semibold text-gray-900 line-clamp-2">
                                {post.caption}
                              </h3>
                              <div
                                className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-bold ${
                                  post.truthScore >= 70
                                    ? "bg-green-100 text-green-700"
                                    : post.truthScore >= 40
                                      ? "bg-yellow-100 text-yellow-700"
                                      : "bg-red-100 text-red-700"
                                }`}
                              >
                                {post.truthScore}%
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <span className="px-2 py-0.5 bg-gray-100 rounded-full text-xs">
                                {post.category}
                              </span>
                              <span>•</span>
                              <span>{post.timeAgo}</span>
                              <span>•</span>
                              <span className="truncate">
                                @{post.username}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="p-12 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <Search className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500">
                      '{searchQuery}' 검색 결과가 없습니다
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      다른 키워드로 검색해보세요
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {/* Placeholder when no search */}
            {!searchQuery.trim() && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-2xl shadow-2xl p-8 text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                  <Search className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  팩트를 검색하세요
                </h3>
                <p className="text-sm text-gray-500">
                  궁금한 뉴스나 정보의 키워드를 입력해보세요
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

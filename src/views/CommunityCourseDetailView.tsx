import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { UserAvatar } from '../components/UserAvatar';
import { 
  ChevronLeft, 
  Bookmark, 
  GitFork, 
  Heart, 
  Clock, 
  Footprints, 
  Send, 
  Share2, 
  ThumbsUp, 
  Check,
  Trash2
} from 'lucide-react';
import { communityService } from '../services/communityService';
import { analyticsService } from '../services/analyticsService';
import { CourseComment } from '../types';

export const CommunityCourseDetailView: React.FC = () => {
  const { 
    selectedCourseForDetail, 
    allCourses, 
    savedCourseIds, 
    toggleBookmarkCourse, 
    openForkModal, 
    navigate, 
    showToast,
    currentUser 
  } = useApp();

  const course = selectedCourseForDetail || allCourses[0];
  const [comments, setComments] = useState<CourseComment[]>([]);
  const [newCommentText, setNewCommentText] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(course.bookmarkCount);

  const isBookmarked = savedCourseIds.includes(course.id);

  useEffect(() => {
    communityService.getComments(course.id).then(setComments);
    communityService.getLikeStatus(course.id).then(status => {
      setIsLiked(status.isLiked);
      setLikeCount(status.likeCount);
    });
  }, [course.id]);

  const handleToggleLike = async () => {
    const next = !isLiked;
    try {
      const res = await communityService.toggleLikeCourse(course.id, next);
      setIsLiked(res.isLiked);
      setLikeCount(res.likeCount);
      showToast(res.isLiked ? '좋아요를 눌렀습니다 ❤️' : '좋아요가 취소되었습니다');
      
      const eventName = res.isLiked ? 'course_liked' : 'course_unliked';
      analyticsService.track(eventName, {
        screenName: 'community_course_detail',
        resourceType: 'course',
        resourceId: course.postId || course.id,
      }).catch(() => {});
    } catch (err: any) {
      showToast(err?.message || '좋아요 처리에 실패했습니다.');
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newCommentText.trim();
    if (!trimmed) {
      showToast('댓글 내용을 입력해주세요.');
      return;
    }
    if (trimmed.length > 1000) {
      showToast('댓글은 1000자 이하로 작성해주세요.');
      return;
    }

    try {
      const created = await communityService.addComment(course.id, trimmed);
      setComments(prev => [...prev, created]);
      setNewCommentText('');
      showToast('댓글이 등록되었습니다 💬');
      
      analyticsService.track('comment_created', {
        screenName: 'community_course_detail',
        resourceType: 'course',
        resourceId: course.postId || course.id,
      }).catch(() => {});
    } catch (err: any) {
      showToast(err?.message || '댓글 등록에 실패했습니다.');
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await communityService.deleteComment(commentId);
      setComments(prev => prev.filter(c => c.id !== commentId));
      showToast('댓글이 삭제되었습니다');
    } catch (err: any) {
      showToast(err?.message || '댓글 삭제에 실패했습니다.');
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F8FAFF] min-h-[780px] pb-28">
      {/* Top Header */}
      <div className="sticky top-16 z-20 bg-[#FFFFFF] px-4 py-2 border-b border-[#E2E8F0] flex items-center justify-between">
        <button
          onClick={() => navigate('community')}
          className="w-9 h-9 -ml-1 rounded-full flex items-center justify-center text-[#183B4E] hover:bg-[#F1F5F9]"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="text-xs font-bold text-[#183B4E] truncate max-w-[200px]">
          {course.title}
        </span>
        <button
          onClick={() => showToast('공유 링크가 복사되었습니다')}
          className="w-9 h-9 rounded-full flex items-center justify-center text-[#183B4E] hover:bg-[#F1F5F9]"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      {/* Main Content */}
      <div className="p-4 flex flex-col gap-4">
        {/* Cover image & Title */}
        <div className="rounded-2xl overflow-hidden bg-[#FFFFFF] border border-[#E2E8F0] shadow-xs">
          <img
            src={course.coverImage}
            alt={course.title}
            className="w-full h-44 object-cover"
          />
          <div className="p-3.5 space-y-2">
            <h1 className="text-base font-bold text-[#183B4E] leading-snug">
              {course.title}
            </h1>
            <p className="text-xs text-[#64748B]">{course.subtitle}</p>

            <div className="flex items-center justify-between pt-2 border-t border-[#F1F5F9]">
              <div className="flex items-center gap-2">
                <UserAvatar
                  src={course.author.avatar}
                  alt={course.author.name}
                  className="w-7 h-7"
                />
                <span className="text-xs font-bold text-[#183B4E]">{course.author.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleToggleLike}
                  className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border transition-all ${
                    isLiked
                      ? 'bg-[#FEE2E2] text-[#F24D4D] border-[#F24D4D]'
                      : 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0]'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-[#F24D4D]' : ''}`} />
                  <span>{likeCount}</span>
                </button>
                <button
                  type="button"
                  onClick={() => toggleBookmarkCourse(course.id)}
                  className={`p-1.5 rounded-full border ${
                    isBookmarked ? 'bg-[#E6EEFF] text-[#006781] border-[#BAEAFF]' : 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0]'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-[#006781]' : ''}`} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Route Nodes */}
        <div className="p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-xs">
          <h2 className="text-xs font-bold text-[#183B4E] mb-2">방문 코스 동선</h2>
          <div className="space-y-2">
            {course.items.map((item, idx) => (
              <div key={item.id} className="flex items-center gap-2 text-xs">
                <span className="w-5 h-5 rounded-full bg-[#183B4E] text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <span className="font-bold text-[#183B4E] truncate">{item.place.name}</span>
                <span className="text-[#64748B] text-[11px] ml-auto shrink-0">
                  {item.startTime} ({item.stayDurationMinutes}분)
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Comments Section */}
        <div className="p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-xs flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-[#183B4E]">여행자 후기 & 댓글 ({comments.length})</h2>
          </div>

          {/* Comment Form */}
          <form onSubmit={handleAddComment} className="flex items-center gap-2">
            <input
              type="text"
              value={newCommentText}
              onChange={e => setNewCommentText(e.target.value)}
              placeholder="이 코스에 대한 질문이나 후기를 남겨보세요"
              className="flex-1 h-10 px-3 rounded-xl bg-[#F8FAFC] text-xs text-[#183B4E] border border-[#E2E8F0] outline-none focus:border-[#45C7F2]"
            />
            <button
              type="submit"
              className="h-10 px-3 rounded-xl bg-[#183B4E] text-white flex items-center justify-center active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Comments List */}
          <div className="space-y-2.5 pt-1">
            {comments.map(c => (
              <div key={c.id} className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <UserAvatar
                      src={c.author.avatar}
                      alt={c.author.name}
                      className="w-5 h-5"
                    />
                    <span className="font-bold text-[#183B4E]">{c.author.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#94A3B8]">{c.createdAt}</span>
                    {currentUser && (c.userId === currentUser.id || c.author.id === currentUser.id) && (
                      <button
                        type="button"
                        onClick={() => handleDeleteComment(c.id)}
                        className="text-[#94A3B8] hover:text-[#F24D4D] p-0.5"
                        title="댓글 삭제"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-xs text-[#475569] pl-6.5">{c.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Fork CTA Bar */}
      <div className="fixed bottom-16 left-0 right-0 z-30 bg-[#FFFFFF]/95 backdrop-blur-md px-4 py-2.5 border-t border-[#E2E8F0] shadow-[0_-4px_16px_rgba(24,59,78,0.08)] max-w-[430px] mx-auto">
        <button
          onClick={() => openForkModal(course)}
          className="w-full h-12 rounded-full bg-[#45C7F2] text-[#183B4E] text-xs font-bold flex items-center justify-center gap-1.5 shadow-md active:scale-98 transition-all hover:bg-[#5BD4FF]"
        >
          <GitFork className="w-4 h-4" />
          <span>일정에 추가</span>
        </button>
      </div>
    </div>
  );
};

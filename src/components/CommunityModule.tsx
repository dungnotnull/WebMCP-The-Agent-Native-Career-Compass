import React, { useState } from 'react';
import {
  Users,
  Heart,
  MessageSquare,
  ShieldAlert,
  Send,
  Sparkles,
  Lock,
  CheckCircle2,
  Award,
  PhoneCall,
  UserCheck,
  TrendingUp,
  MapPin,
  Map as MapIcon
} from 'lucide-react';
import { CommunityPost, Language, VerifiedTransitionStory } from '../types';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import { t } from '../utils/i18n';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
});
L.Marker.prototype.options.icon = DefaultIcon;

interface CommunityModuleProps {
  posts: CommunityPost[];
  verifiedStories: VerifiedTransitionStory[];
  onAddPost: (post: { title: string; content: string; isAnonymous: boolean; tag: any; locationName?: string }) => void;
  onAddReply: (postId: string, content: string) => void;
  onLikePost: (postId: string, delta?: number) => void;
  language: Language;
}

export const CommunityModule: React.FC<CommunityModuleProps> = ({
  posts,
  verifiedStories,
  onAddPost,
  onAddReply,
  onLikePost,
  language
}) => {
  const [activeTab, setActiveTab] = useState<'noi_niem' | 'map' | 'verified_stories'>('noi_niem');
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [selectedTag, setSelectedTag] = useState<CommunityPost['tag']>('fear_of_displacement');
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('laban_liked_posts');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [activeMarker, setActiveMarker] = useState<CommunityPost | null>(null);

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;
    onAddPost({
      title: newTitle,
      content: newContent,
      isAnonymous,
      tag: selectedTag,
      locationName: newLocation
    });
    setNewTitle('');
    setNewContent('');
    setNewLocation('');
  };

  const handleReplySubmit = (postId: string) => {
    const text = replyInputs[postId];
    if (!text || !text.trim()) return;
    onAddReply(postId, text);
    setReplyInputs({ ...replyInputs, [postId]: '' });
  };

  const toggleLike = (postId: string) => {
    const isCurrentlyLiked = !!likedPosts[postId];
    const newLikedState = !isCurrentlyLiked;
    const delta = newLikedState ? 1 : -1;

    setLikedPosts(prev => {
      const next = { ...prev, [postId]: newLikedState };
      try {
        localStorage.setItem('laban_liked_posts', JSON.stringify(next));
      } catch (err) {
        console.warn('LocalStorage save error:', err);
      }
      return next;
    });

    onLikePost(postId, delta);
  };

  const safePosts = posts || [];
  const safeVerifiedStories = verifiedStories || [];

  // Map locations to coordinates
  const locationCoords: Record<string, { lat: number, lng: number }> = {
    'Hà Nội': { lat: 21.0285, lng: 105.8542 },
    'Hồ Chí Minh': { lat: 10.8231, lng: 106.6297 },
    'TP.HCM': { lat: 10.8231, lng: 106.6297 },
    'TP HCM': { lat: 10.8231, lng: 106.6297 },
    'Đà Nẵng': { lat: 16.0471, lng: 108.2062 },
    'Cần Thơ': { lat: 10.0452, lng: 105.7469 },
    'Hải Phòng': { lat: 20.8449, lng: 106.6881 },
    'Bình Dương': { lat: 11.2294, lng: 106.6582 },
    'Đồng Nai': { lat: 10.9416, lng: 106.8229 },
    'Nha Trang': { lat: 12.2388, lng: 109.1967 },
    'Huế': { lat: 16.4637, lng: 107.5909 },
  };

  const postsWithCoords = safePosts.map(post => {
    if (post.coordinates) return post;
    const locKey = Object.keys(locationCoords).find(key => post.locationName?.includes(key));
    const baseCoords = locKey ? locationCoords[locKey] : { lat: 16.047079, lng: 108.206230 };
    
    // Add small random offset so pins in same city don't completely overlap
    return {
      ...post,
      coordinates: {
        lat: baseCoords.lat + (Math.random() * 0.05 - 0.025),
        lng: baseCoords.lng + (Math.random() * 0.05 - 0.025)
      }
    };
  });

  return (
    <div className="space-y-6">
      {/* Mental Health & Psychological Safety Support Banner */}
      <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center flex-shrink-0">
            <Heart className="w-5 h-5 text-rose-600" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 flex items-center gap-1.5">
              <span>{t(language, 'Không Gian Đồng Cảm & An Toàn Tâm Lý La Bàn 🌿', 'Empathy & Psychological Safety Space 🌿')}</span>
              <span className="text-[10px] px-2 py-0.2 rounded-full bg-rose-100 text-rose-700 font-semibold">
                {t(language, 'Bảo mật ẩn danh', 'Anonymous & Secure')}
              </span>
            </h3>
            <p className="text-slate-600 text-[11px] mt-0.5">
              {t(language,
                'Thay đổi nghề nghiệp là hành trình nhiều âu lo. Nếu bạn cảm thấy kiệt sức, hãy chia sẻ ẩn danh hoặc kết nối đường dây hỗ trợ tâm lý miễn phí tại Việt Nam.',
                'Career transitions can be overwhelming. If you feel stressed, share anonymously or connect with free psychological support hotlines in Vietnam.'
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="tel:096306xxxx"
            className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold flex items-center gap-1.5 transition shadow-xs"
            title={t(language, 'Đường dây nóng Ngày Mai (Hỗ trợ tâm lý miễn phí tại Việt Nam)', 'Ngay Mai Hotline (Free Psychological Support Vietnam)')}
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>{t(language, 'Ngày Mai: 096 306 xxxx', 'Ngay Mai Hotline: 096 306 xxxx')}</span>
          </a>
        </div>
      </div>

      {/* Main Tab Switcher */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('noi_niem')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'noi_niem'
              ? 'bg-amber-500 text-slate-950 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>{t(language, `Góc Chia Sẻ (${safePosts.length})`, `Community Feed (${safePosts.length})`)}</span>
        </button>

        <button
          onClick={() => setActiveTab('verified_stories')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'verified_stories'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>{t(language, `Câu Chuyện Chuyển Đổi (${safeVerifiedStories.length})`, `Verified Stories (${safeVerifiedStories.length})`)}</span>
        </button>
      </div>

      {activeTab === 'noi_niem' && (
        <div className="space-y-6">
          {/* Empathy Map at the top */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm animate-in fade-in">
            <div className="mb-4 flex flex-col gap-1">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <MapIcon className="w-5 h-5 text-blue-600" />
                <p>{t(language, 'Bản đồ kết nối những người lao động đang đối mặt với thử thách nghề nghiệp trên toàn quốc. Bạn không cô đơn!', 'Map connecting workers facing career challenges across the country. You are not alone!')}</p>
              </div>
              <div className="text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-100 self-start mt-1">
                {t(language, 'Hoàng Sa và Trường Sa là của Việt Nam', 'Paracel and Spratly Islands belong to Vietnam.')}
              </div>
            </div>
            <div className="w-full h-[400px] rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
              <MapContainer center={[16.047079, 108.206230]} zoom={6} scrollWheelZoom={true} style={{ height: '100%', width: '100%', zIndex: 10 }}>
                <TileLayer
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
                  attribution='&copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012'
                />
                {postsWithCoords.map((post) => (
                  <Marker
                    key={post.id}
                    position={[post.coordinates.lat, post.coordinates.lng]}
                    eventHandlers={{ click: () => setActiveMarker(post) }}
                  >
                    {activeMarker?.id === post.id && (
                      <Popup eventHandlers={{ remove: () => setActiveMarker(null) }}>
                        <div className="max-w-[250px]">
                          <h4 className="font-bold text-sm text-slate-900 mb-1">{post.title}</h4>
                          <p className="text-xs text-slate-600 mb-2 line-clamp-3">{post.content}</p>
                          <div className="flex justify-between items-center text-[10px]">
                            <span className="font-semibold text-amber-700">{post.authorAlias}</span>
                            <span className="text-slate-400">{post.locationName || (language === 'vi' ? 'Việt Nam' : 'Vietnam')}</span>
                          </div>
                        </div>
                      </Popup>
                    )}
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>
          {/* Create Post Form */}
          <form
            onSubmit={handlePostSubmit}
            className="bg-white/90 backdrop-blur border border-white/40 rounded-3xl p-6 shadow-sm space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>{language === 'vi' ? 'Gửi Gắm Tâm Sự hoặc Câu Hỏi Của Bạn' : 'Share Your Thoughts or Questions'}</span>
              </h3>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="w-3.5 h-3.5 accent-amber-600"
                  />
                  <span className="flex items-center gap-1 font-medium">
                    <Lock className="w-3 h-3 text-amber-600" /> {language === 'vi' ? 'Đăng ẩn danh' : 'Post anonymously'}
                  </span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <input
                  type="text"
                  required
                  id="community-post-title"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder={language === 'vi' ? "Tiêu đề tâm sự (VD: 28 tuổi làm Graphic Designer liệu có muộn để đổi sang UI/UX?)..." : "Title (e.g., Is it too late to switch to UI/UX at 28?)..."}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-200 focus:outline-none transition-all"
                />
              </div>

              <div>
                <select
                  id="community-post-tag"
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-200 focus:outline-none font-medium transition-all"
                >
                  <option value="fear_of_displacement">{t(language, '😰 Lo ngại AI thay thế', '😰 AI Replacement Anxiety')}</option>
                  <option value="transition_fatigue">{t(language, '😮‍💨 Mệt mỏi chuyển đổi', '😮‍💨 Transition Fatigue')}</option>
                  <option value="seeking_mentor">{t(language, '🤝 Tìm Mentor', '🤝 Seeking Mentor')}</option>
                  <option value="success_milestone">{t(language, '🎉 Cột mốc nhỏ', '🎉 Small Win / Milestone')}</option>
                  <option value="salary_negotiation">{t(language, '💼 Đàm phán lương', '💼 Salary Negotiation')}</option>
                </select>
              </div>

              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder={language === 'vi' ? "Khu vực (VD: Hà Nội, Đà Nẵng)" : "Location (e.g., Hanoi, Da Nang)"}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-200 focus:outline-none transition-all"
                />
              </div>
            </div>

            <textarea
              required
              id="community-post-content"
              rows={3}
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder={language === 'vi' ? "Chia sẻ chi tiết hoàn cảnh, áp lực và mục tiêu của bạn để cộng đồng và các mentor cùng lắng nghe & hỗ trợ..." : "Share details about your situation, pressures, and goals so the community and mentors can support you..."}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-200 focus:outline-none transition-all"
            ></textarea>

            <div className="flex justify-between items-center">
              <span className="text-[10px] text-slate-500">
                {t(language,
                  'Gemini sẽ tự động đưa bài viết của bạn lên "Bản Đồ Đồng Cảm" nếu bạn có nhập Khu Vực.',
                  'Your post will automatically pin on the Empathy Map if a location is entered.'
                )}
              </span>
              <button
                type="submit"
                id="btn-submit-community-post"
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-sm transition cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>{t(language, 'Đăng', 'Post')}</span>
              </button>
            </div>
          </form>

          {/* Posts Feed */}
          <div className="space-y-4">
            {posts.map((post) => {
              const isLiked = !!likedPosts[post.id];
              const tagLabels: Record<string, { label: string; color: string }> = {
                fear_of_displacement: { label: t(language, 'Lo ngại AI thay thế', 'AI Replacement Anxiety'), color: 'bg-rose-50 text-rose-700 border-rose-200' },
                transition_fatigue: { label: t(language, 'Áp lực học chuyển đổi', 'Transition Fatigue'), color: 'bg-amber-50 text-amber-800 border-amber-200' },
                seeking_mentor: { label: t(language, 'Tìm Mentor', 'Seeking Mentor'), color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
                success_milestone: { label: t(language, 'Cột mốc thành công', 'Success Milestone'), color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
                salary_negotiation: { label: t(language, 'Lương & Đàm phán', 'Salary Negotiation'), color: 'bg-teal-50 text-teal-800 border-teal-200' }
              };

              const currentTag = tagLabels[post.tag] || tagLabels.fear_of_displacement;

              return (
                <div
                  key={post.id}
                  className="bg-white/80 backdrop-blur border border-white/50 rounded-2xl p-5 shadow-sm space-y-4 transition hover:shadow-md"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-sm text-amber-700">
                        {post.isAnonymous ? (language === 'vi' ? 'ẨN' : 'ANON') : post.authorAlias.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-900">{post.authorAlias}</span>
                          <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{post.userCurrentRole}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1 mt-0.5">
                          {post.createdAt.split('T')[0]} {post.locationName && `• ${post.locationName}`}
                        </span>
                      </div>
                    </div>

                    <span className={`text-[10px] font-bold px-3 py-1 rounded-full border shadow-sm ${currentTag.color}`}>
                      {currentTag.label}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 leading-snug">
                    {post.title}
                  </h4>

                  <p className="text-sm text-slate-700 leading-relaxed bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                    {post.content}
                  </p>

                  {/* Post Interactions */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs mt-2">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => toggleLike(post.id)}
                        className={`flex items-center gap-1.5 font-semibold transition cursor-pointer px-3 py-1.5 rounded-lg ${
                          isLiked ? 'text-rose-600 bg-rose-50' : 'text-slate-500 hover:text-rose-600 hover:bg-rose-50'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-600 text-rose-600' : ''}`} />
                        <span>{post.likesCount || 0} {t(language, 'Đồng cảm', 'Empathy')}</span>
                      </button>

                      <span className="flex items-center gap-1.5 text-slate-500">
                        <MessageSquare className="w-4 h-4" />
                        <span>{(post.replies || []).length} {t(language, 'Phản hồi & Lời khuyên', 'Replies & Advice')}</span>
                      </span>
                    </div>
                  </div>

                  {/* Replies List */}
                  {(post.replies || []).length > 0 && (
                    <div className="space-y-3 pt-3 border-t border-slate-100 mt-2">
                      {(post.replies || []).map((reply) => (
                        <div
                          key={reply.id}
                          className={`p-4 rounded-xl border text-sm space-y-2 ${
                            reply.isAiSupportive
                              ? 'bg-rose-50/60 border-rose-200 text-rose-900'
                              : reply.isVerifiedTransition
                              ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                              : 'bg-slate-50 border-slate-200 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between text-xs border-b border-slate-200/50 pb-2">
                            <span className="font-bold flex items-center gap-1">
                              {reply.authorAlias}
                              {reply.isVerifiedTransition && (
                                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-[10px]">
                                  {t(language, '✓ Đã chuyển đổi thành công', '✓ Verified Transformation')}
                                </span>
                              )}
                            </span>
                            <span className="text-slate-400 font-mono">{(reply.createdAt || '').split('T')[0]}</span>
                          </div>
                          <p className="leading-relaxed">{reply.content}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Reply Input */}
                  <div className="flex items-center gap-3 pt-3 mt-2">
                    <input
                      type="text"
                      id={`reply-input-${post.id}`}
                      value={replyInputs[post.id] || ''}
                      onChange={(e) => setReplyInputs({ ...replyInputs, [post.id]: e.target.value })}
                      placeholder={t(language, 'Gửi lời động viên hoặc chia sẻ kinh nghiệm thực tế của bạn...', 'Send words of encouragement or share your practical experience...')}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all"
                    />
                    <button
                      onClick={() => handleReplySubmit(post.id)}
                      className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition flex-shrink-0 cursor-pointer shadow-sm"
                    >
                      {t(language, 'Gửi', 'Send')}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'verified_stories' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in">
          {safeVerifiedStories.map((story) => (
            <div
              key={story.id}
              className="bg-white/80 backdrop-blur border border-emerald-100 hover:border-emerald-300 rounded-3xl p-6 shadow-sm transition space-y-4 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-200 text-emerald-800 flex items-center justify-center font-bold text-lg shadow-inner">
                    {(story.fullName || 'V').charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <span>{story.fullName}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
                        {story.verifiedBadge}
                      </span>
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1"><MapPin className="w-3 h-3"/> {story.location}</p>
                  </div>
                </div>
                <span className="text-xs font-mono text-slate-400">{story.transitionDate}</span>
              </div>

              {/* Transformation Metrics */}
              <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-100 space-y-3 text-sm">
                <div className="flex justify-between items-center text-slate-600">
                  <span>{t(language, 'Trước chuyển đổi:', 'Before Transition:')}</span>
                  <span className="font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">{story.previousRole}</span>
                </div>
                <div className="flex justify-between items-center text-slate-900">
                  <span className="font-bold text-emerald-700">{t(language, 'Sau khi học La Bàn:', 'After La Bàn Program:')}</span>
                  <span className="font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">{story.newRole}</span>
                </div>
                <div className="flex justify-between items-center text-slate-700 pt-2 border-t border-slate-200">
                  <span>{t(language, 'Tăng trưởng thu nhập:', 'Income Growth:')}</span>
                  <span className="font-bold text-amber-700 flex items-center gap-1"><TrendingUp className="w-4 h-4"/> {story.salaryIncrease}</span>
                </div>
              </div>

              <blockquote className="text-sm text-slate-700 italic bg-white p-4 rounded-xl border-l-4 border-emerald-500 leading-relaxed shadow-sm">
                "{story.storyQuoteVi}"
              </blockquote>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                  {t(language, 'Kỹ năng đột phá then chốt:', 'Key Learned Skills:')}
                </p>
                <div className="flex flex-wrap gap-2">
                  {(story.keySkillsLearned || []).map((sk, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium"
                    >
                      ✓ {sk}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const communityFeatures = [
  { icon: '👩', label: 'Women Only', desc: 'مجتمع نسائي خاص ومغلق بالكامل' },
  { icon: '🏆', label: 'Challenges', desc: 'تحديات شهرية حماسية ومحفزة' },
  { icon: '💬', label: 'Discussions', desc: 'نقاشات وتوجيهات داعمة باستمرار' },
  { icon: '🎉', label: 'Wins', desc: 'احتفال وإبراز لكل تحول وإنجاز' },
  { icon: '❓', label: 'Questions', desc: 'أسئلة وإجابات مباشرة مع الكوتش' },
  { icon: '✨', label: 'Motivation', desc: 'شغف وإلهام يومي متواصل' },
  { icon: '🤝', label: 'Accountability', desc: 'دعم ومساءلة تمنع التكاسل' },
];

const mockPosts = [
  {
    id: 1,
    avatar: '👩‍🦱',
    name: 'سارة',
    time: 'منذ 2 ساعة',
    content: 'أنهيت الأسبوع الثالث من مسار زيادة الوزن الصحي والنتيجة زيادة 2 كيلو ونص، ولاحظت الامتلاء حصل في الأرداف والأفخاذ والصدر بشكل ملحوظ الحمدلله 🤍✨',
    likes: 42,
    replies: 15,
    tag: 'زيادة وزن صحية 📈',
    tagColor: '#BA785C',
  },
  {
    id: 2,
    avatar: '👩‍🦰',
    name: 'نور',
    time: 'منذ 4 ساعات',
    content: 'بنات والله مو مصدقة! الميزان ثابت تقريباً بس المقاسات والخصر فرق كأنها إنسانة ثانية! جسمي انشد والترهلات اختفت تماماً 😍🔥',
    likes: 56,
    replies: 19,
    tag: 'إعادة تشكيل الجسم ✨',
    tagColor: '#EFD0D5',
  },
  {
    id: 3,
    avatar: '🧕',
    name: 'ريم',
    time: 'منذ يوم',
    content: 'التزمت بالمسار التغذوي والتدريبي وحسيت بفرق هائل في نشاطي وارتياح الجهاز الهضمي والقولون من أول أسبوع! المنظومة تجنن 💖',
    likes: 89,
    replies: 28,
    tag: 'راحة وعافية 🌿',
    tagColor: '#BA785C',
  },
];

export default function CommunitySection() {
  return (
    <section className="py-24 md:py-32 bg-dark-900 relative overflow-hidden">
      <div className="absolute inset-0 digital-dots-bg opacity-20 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="animate-on-scroll section-badge inline-block mb-6">Digital Women's Community</div>
          <h2 className="animate-on-scroll delay-1 section-heading mb-4">
            أنتِ لستِ وحدكِ.{' '}
            <span className="gradient-text">مجتمع كامل يحفزكِ يومياً.</span>
          </h2>
          <div className="divider-gold mb-6" />
          <p className="animate-on-scroll delay-2 section-subheading">
            بيئة نسائية رقمية فاخرة تجمع المشتركات الشغوفات لتبادل الخبرات، الاحتفال بالإنجازات، وضمان عدم التكاسل.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Features */}
          <div className="animate-on-scroll delay-1">
            <div className="grid grid-cols-2 gap-3">
              {communityFeatures.map((feature, i) => (
                <div
                  key={feature.label}
                  className={`group rounded-2xl p-4 md:p-5 transition-all duration-300 hover:-translate-y-1 cursor-default
                    ${i === 0 ? 'col-span-2' : ''}
                  `}
                  style={{
                    background: i === 0
                      ? 'linear-gradient(135deg, #5A2135 0%, #3F1425 100%)'
                      : 'linear-gradient(145deg, rgba(63,20,37,0.7) 0%, rgba(31,8,17,0.85) 100%)',
                    border: i === 0
                      ? '1px solid rgba(186,120,92,0.4)'
                      : '1px solid rgba(239,208,213,0.18)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{feature.icon}</span>
                    <div>
                      <p className={`font-bold text-sm ${i === 0 ? 'text-white' : 'text-cream'}`}>
                        {feature.label}
                      </p>
                      <p className={`text-xs mt-0.5 ${i === 0 ? 'text-cream/80' : 'text-taupe'}`}>
                        {feature.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mock community feed */}
          <div className="animate-on-scroll delay-2">
            <div
              className="rounded-4xl overflow-hidden"
              style={{
                background: '#1F0811',
                border: '1px solid rgba(239,208,213,0.25)',
                boxShadow: '0 15px 50px rgba(0,0,0,0.6)',
              }}
            >
              {/* Header bar */}
              <div
                className="px-6 py-4 flex items-center justify-between"
                style={{ background: '#2A0B18', borderBottom: '1px solid rgba(239,208,213,0.15)' }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">المجتمع النسائي الحصري</span>
                  <span
                    className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-gold/20 text-gold border border-gold/30"
                  >
                    Women Only
                  </span>
                </div>
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-gold" />
                  <span className="w-2.5 h-2.5 rounded-full bg-pink-300" />
                </div>
              </div>

              {/* Posts */}
              <div className="p-4 space-y-3">
                {mockPosts.map((post) => (
                  <div
                    key={post.id}
                    className="rounded-2xl p-4 transition-all duration-300 hover:border-gold/40"
                    style={{
                      background: 'rgba(63,20,37,0.5)',
                      border: '1px solid rgba(239,208,213,0.15)',
                    }}
                  >
                    {/* Post header */}
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{post.avatar}</span>
                        <div>
                          <p className="text-sm font-bold text-white">{post.name}</p>
                          <p className="text-[10px] text-taupe">{post.time}</p>
                        </div>
                      </div>
                      <span
                        className="text-[11px] px-2.5 py-1 rounded-full font-bold bg-dark-800 text-gold border border-gold/30"
                      >
                        {post.tag}
                      </span>
                    </div>

                    {/* Post content */}
                    <p className="text-sm text-cream/90 leading-relaxed mb-3 font-medium">{post.content}</p>

                    {/* Post footer */}
                    <div className="flex items-center gap-4 text-taupe">
                      <button className="flex items-center gap-1 text-xs hover:text-gold transition-colors font-semibold">
                        <span className="text-rose-400">♥</span>
                        <span>{post.likes}</span>
                      </button>
                      <button className="flex items-center gap-1 text-xs hover:text-gold transition-colors font-semibold">
                        <span>💬</span>
                        <span>{post.replies} ردود</span>
                      </button>
                    </div>
                  </div>
                ))}

                {/* Blur overlay - more coming */}
                <div
                  className="rounded-2xl p-4 text-center bg-dark-800/60 border border-dashed border-gold/30 opacity-80"
                >
                  <p className="text-xs text-taupe font-semibold">+ التقي بتشجيع مئات المشتركات داخل العضوية</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

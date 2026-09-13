import { useLang } from '../context/LanguageContext';

export default function CommunitySection() {
  const { lang, t, dir } = useLang();

  const communityFeatures = [
    {
      icon: '👩',
      labelAr: 'مجتمع نسائي فقط',
      labelEn: 'Women Only',
      descAr: 'مجتمع نسائي خاص ومغلق بالكامل',
      descEn: 'Exclusive, completely closed women-only community',
    },
    {
      icon: '🏆',
      labelAr: 'تحديات مستمرة',
      labelEn: 'Challenges',
      descAr: 'تحديات شهرية حماسية ومحفزة',
      descEn: 'Exciting and motivating monthly challenges',
    },
    {
      icon: '💬',
      labelAr: 'نقاشات وتوجيه',
      labelEn: 'Discussions',
      descAr: 'نقاشات وتوجيهات داعمة باستمرار',
      descEn: 'Supportive daily discussions & coach guidance',
    },
    {
      icon: '🎉',
      labelAr: 'إنجازات ونجاحات',
      labelEn: 'Wins & Results',
      descAr: 'احتفال وإبراز لكل تحول وإنجاز',
      descEn: 'Celebrating and spotlighting every transformation',
    },
    {
      icon: '❓',
      labelAr: 'أسئلة مع الكوتش',
      labelEn: 'Direct Q&A',
      descAr: 'أسئلة وإجابات مباشرة مع الكوتش',
      descEn: 'Direct Q&A sessions with Coach Hanan',
    },
    {
      icon: '✨',
      labelAr: 'شغف وإلهام',
      labelEn: 'Daily Motivation',
      descAr: 'شغف وإلهام يومي متواصل',
      descEn: 'Unstoppable daily inspiration and drive',
    },
    {
      icon: '🤝',
      labelAr: 'مساءلة والتزام',
      labelEn: 'Accountability',
      descAr: 'دعم ومساءلة تمنع التكاسل',
      descEn: 'Consistent accountability preventing setbacks',
    },
  ];

  const mockPosts = [
    {
      id: 1,
      avatar: '👩‍🦱',
      nameAr: 'سارة',
      nameEn: 'Sarah',
      timeAr: 'منذ ساعتين',
      timeEn: '2 hours ago',
      contentAr: 'أنهيت الأسبوع الثالث من مسار زيادة الوزن الصحي والنتيجة زيادة 2 كيلو ونص، ولاحظت الامتلاء حصل في الأرداف والأفخاذ والصدر بشكل ملحوظ الحمدلله 🤍✨',
      contentEn: 'Completed week 3 of the Healthy Weight Gain path with +2.5 kg! I noticed feminine fullness in my glutes, thighs, and chest noticeably alhamdulillah 🤍✨',
      likes: 42,
      replies: 15,
      tagAr: 'زيادة وزن صحية 📈',
      tagEn: 'Healthy Weight Gain 📈',
      tagColor: '#BA785C',
    },
    {
      id: 2,
      avatar: '👩‍🦰',
      nameAr: 'نور',
      nameEn: 'Noor',
      timeAr: 'منذ 4 ساعات',
      timeEn: '4 hours ago',
      contentAr: 'بنات والله مو مصدقة! الميزان ثابت تقريباً بس المقاسات والخصر فرق كأنها إنسانة ثانية! جسمي انشد والترهلات اختفت تماماً 😍🔥',
      contentEn: "Girls, I can't believe it! The scale is almost steady, but my measurements and waist look like an entirely different person! My body is toned and firm 😍🔥",
      likes: 56,
      replies: 19,
      tagAr: 'إعادة تشكيل الجسم ✨',
      tagEn: 'Body Recomposition ✨',
      tagColor: '#EFD0D5',
    },
    {
      id: 3,
      avatar: '🧕',
      nameAr: 'ريم',
      nameEn: 'Reem',
      timeAr: 'منذ يوم',
      timeEn: '1 day ago',
      contentAr: 'التزمت بالمسار التغذوي والتدريبي وحسيت بفرق هائل في نشاطي وارتياح الجهاز الهضمي والقولون من أول أسبوع! المنظومة تجنن 💖',
      contentEn: 'Committed to the nutrition and training protocol and felt a huge surge in daily energy, with total digestive and IBS relief from week one! The system is incredible 💖',
      likes: 89,
      replies: 28,
      tagAr: 'راحة وعافية 🌿',
      tagEn: 'Digestive Wellness 🌿',
      tagColor: '#BA785C',
    },
  ];

  return (
    <section className="py-24 md:py-32 bg-dark-900 relative overflow-hidden" dir={dir}>
      <div className="absolute inset-0 digital-dots-bg opacity-20 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="animate-on-scroll section-badge inline-block mb-6">
            {t('مجتمع رقمي نسائي', "Digital Women's Community")}
          </div>
          <h2 className="animate-on-scroll delay-1 section-heading mb-4">
            {lang === 'ar' ? (
              <>
                أنتِ لستِ وحدكِ.{' '}
                <span className="gradient-text">مجتمع كامل يحفزكِ يومياً.</span>
              </>
            ) : (
              <>
                You Are Not Alone.{' '}
                <span className="gradient-text">An Entire Sisterhood Powers You.</span>
              </>
            )}
          </h2>
          <div className="divider-gold mb-6" />
          <p className="animate-on-scroll delay-2 section-subheading">
            {t(
              'بيئة نسائية رقمية فاخرة تجمع المشتركات الشغوفات لتبادل الخبرات، الاحتفال بالإنجازات، وضمان عدم التكاسل.',
              'A luxury digital female space gathering ambitious women to share experiences, celebrate achievements, and ensure relentless momentum.'
            )}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Features */}
          <div className="animate-on-scroll delay-1">
            <div className="grid grid-cols-2 gap-3">
              {communityFeatures.map((feature, i) => (
                <div
                  key={feature.labelEn}
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
                        {lang === 'ar' ? feature.labelAr : feature.labelEn}
                      </p>
                      <p className={`text-xs mt-0.5 ${i === 0 ? 'text-cream/80' : 'text-taupe'}`}>
                        {lang === 'ar' ? feature.descAr : feature.descEn}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Community Feed Preview */}
          <div className="animate-on-scroll delay-2">
            <div
              className="rounded-3xl p-6 border relative"
              style={{
                background: 'linear-gradient(145deg, rgba(31,8,17,0.95) 0%, rgba(63,20,37,0.8) 100%)',
                borderColor: 'rgba(239,208,213,0.2)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
              }}
            >
              {/* Header inside feed box */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-bold text-cream">
                    {t('مقتطفات من تجارب المشتركات الحية', 'Live Highlights from Members')}
                  </span>
                </div>
                <span className="text-[11px] text-gold font-bold">
                  {t('عضوات نشطات الآن', 'Active Members Now')}
                </span>
              </div>

              {/* Feed Items */}
              <div className="space-y-4">
                {mockPosts.map((post) => (
                  <div
                    key={post.id}
                    className="p-4 rounded-2xl bg-dark-900/80 border border-white/5 hover:border-gold/30 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{post.avatar}</span>
                        <div>
                          <span className="text-xs font-bold text-white block">
                            {lang === 'ar' ? post.nameAr : post.nameEn}
                          </span>
                          <span className="text-[10px] text-taupe">
                            {lang === 'ar' ? post.timeAr : post.timeEn}
                          </span>
                        </div>
                      </div>
                      <span
                        className="text-[10px] font-bold px-2.5 py-0.5 rounded-full"
                        style={{
                          background: `${post.tagColor}20`,
                          color: post.tagColor,
                          border: `1px solid ${post.tagColor}40`,
                        }}
                      >
                        {lang === 'ar' ? post.tagAr : post.tagEn}
                      </span>
                    </div>

                    <p className="text-xs md:text-sm text-cream/90 leading-relaxed mb-3 font-medium">
                      {lang === 'ar' ? post.contentAr : post.contentEn}
                    </p>

                    <div className="flex items-center gap-4 text-[11px] text-taupe pt-2 border-t border-white/5">
                      <span className="flex items-center gap-1 hover:text-gold cursor-pointer">
                        ❤️ {post.likes}
                      </span>
                      <span className="flex items-center gap-1 hover:text-gold cursor-pointer">
                        💬 {post.replies} {t('تعليق وتشجيع', 'cheers')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

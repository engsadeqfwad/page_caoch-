import {
  Map, Salad, Dumbbell, TrendingUp, Trophy, BookOpen,
  Video, Users, CheckCircle, RefreshCw,
} from 'lucide-react';
import { membershipFeatures } from '../data';

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Map, Salad, Dumbbell, TrendingUp, Trophy, BookOpen,
  Video, Users, CheckCircle, RefreshCw,
};

export default function MembershipFeatures() {
  return (
    <section className="py-24 md:py-32 bg-dark-900 relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 digital-dots-bg opacity-20 pointer-events-none" />
      <div
        className="absolute top-1/3 left-10 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(90,33,53,0.9) 0%, transparent 70%)' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="animate-on-scroll section-badge inline-block mb-6">
            مزايا العضوية الرقمية
          </div>
          <h2 className="animate-on-scroll delay-1 section-heading mb-4">
            منظومة متكاملة بين يديكِ{' '}
            <span className="gradient-text">لتحقيق أقصى تحول.</span>
          </h2>
          <div className="divider-gold mb-6" />
          <p className="animate-on-scroll delay-2 section-subheading">
            العضوية تمنحكِ بيئة رقمية فائقة التطوير تجمع الأدوات والتوجيه لضمان استمرار إنجازاتكِ.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 auto-rows-auto gap-4 md:gap-5">
          {membershipFeatures.map((feature, index) => {
            const IconComponent = iconMap[feature.icon];
            const isWide = feature.size === 'wide';
            const isLarge = feature.size === 'large';

            return (
              <div
                key={feature.id}
                className={`animate-on-scroll delay-${Math.min(index + 1, 6)} bento-item group
                  ${isWide ? 'md:col-span-2' : ''}
                  ${isLarge ? 'lg:col-span-2 lg:row-span-2' : ''}
                `}
                style={{
                  background: isLarge
                    ? 'linear-gradient(135deg, rgba(90,33,53,0.85) 0%, rgba(31,8,17,0.95) 100%)'
                    : 'linear-gradient(145deg, rgba(63,20,37,0.7) 0%, rgba(31,8,17,0.85) 100%)',
                  border: isLarge
                    ? '1.5px solid rgba(186,120,92,0.4)'
                    : '1px solid rgba(239,208,213,0.18)',
                }}
              >
                {/* Icon */}
                <div
                  className={`${isLarge ? 'w-16 h-16 text-2xl mb-6' : 'w-12 h-12 text-xl mb-4'} rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-neon-rose`}
                  style={{
                    background: 'linear-gradient(135deg, rgba(90,33,53,0.9), rgba(63,20,37,0.7))',
                    border: '1px solid rgba(239,208,213,0.3)',
                  }}
                >
                  {IconComponent && (
                    <IconComponent
                      size={isLarge ? 28 : 20}
                      className="text-gold"
                    />
                  )}
                </div>

                {/* Label */}
                <p className="text-[11px] font-bold tracking-widest text-gold uppercase mb-1">
                  {feature.titleEn}
                </p>

                {/* Title */}
                <h3 className={`font-bold text-white group-hover:text-cream transition-colors ${isLarge ? 'text-2xl md:text-3xl mb-4' : 'text-lg mb-2'}`}>
                  {feature.title}
                </h3>

                {/* Description */}
                <p className={`text-taupe leading-relaxed font-medium ${isLarge ? 'text-base' : 'text-sm'}`}>
                  {feature.description}
                </p>

                {isLarge && (
                  <div className="mt-6 flex items-center gap-2 text-sm font-bold text-gold">
                    <span>مصممة لاختصار الطريق عليكِ</span>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="-scale-x-100 group-hover:-translate-x-1 transition-transform duration-300">
                      <path d="M3 8h10M8 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

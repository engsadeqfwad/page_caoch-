import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { faqItems } from '../data';
import { useLang } from '../context/LanguageContext';

export default function FAQ() {
  const [openId, setOpenId] = useState<string | null>(null);
  const { lang, t, dir } = useLang();

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="py-24 md:py-32 bg-dark-900 relative overflow-hidden" dir={dir}>
      <div className="absolute inset-0 digital-dots-bg opacity-20 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 md:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="animate-on-scroll section-badge inline-block mb-6">
            {t('الأسئلة الشائعة', 'Frequently Asked Questions')}
          </div>
          <h2 className="animate-on-scroll delay-1 section-heading mb-4">
            {t(
              <>{`لديكِ استفسار؟`}{' '}<span className="gradient-text">{'إليكِ كل التفاصيل.'}</span></>,
              <>{`Have a question?`}{' '}<span className="gradient-text">{'Here are all the details.'}</span></>
            )}
          </h2>
          <div className="divider-gold" />
        </div>

        {/* FAQ Items */}
        <div className="space-y-3.5">
          {faqItems.map((item, index) => (
            <div key={item.id} className={`animate-on-scroll delay-${Math.min(index + 1, 6)}`}>
              <div
                className="rounded-2xl overflow-hidden transition-all duration-300"
                style={{
                  background: openId === item.id ? 'linear-gradient(145deg, rgba(90,33,53,0.8), rgba(63,20,37,0.9))' : 'linear-gradient(145deg, rgba(63,20,37,0.5), rgba(31,8,17,0.8))',
                  border: openId === item.id ? '1px solid rgba(186,120,92,0.6)' : '1px solid rgba(239,208,213,0.15)',
                  boxShadow: openId === item.id ? '0 8px 30px rgba(90,33,53,0.4)' : '0 4px 15px rgba(0,0,0,0.3)',
                }}
              >
                {/* Question button */}
                <button
                  className="w-full flex items-center justify-between gap-4 p-5 md:p-6 text-right"
                  onClick={() => toggle(item.id)}
                  aria-expanded={openId === item.id}
                >
                  <span className="font-bold text-white text-sm md:text-base text-right">
                    {lang === 'en' && item.questionEn ? item.questionEn : item.question}
                  </span>
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 shadow-neon-rose"
                    style={{ background: openId === item.id ? 'linear-gradient(135deg, #BA785C, #5A2135)' : 'rgba(90,33,53,0.6)' }}
                  >
                    {openId === item.id
                      ? <Minus size={14} className="text-white" />
                      : <Plus size={14} className="text-gold" />
                    }
                  </div>
                </button>

                {/* Answer */}
                <div
                  className="overflow-hidden transition-all duration-400 ease-in-out"
                  style={{ maxHeight: openId === item.id ? '300px' : '0', opacity: openId === item.id ? 1 : 0 }}
                >
                  <div className="px-5 md:px-6 pb-5 md:pb-6">
                    <div className="h-px mb-4" style={{ background: 'linear-gradient(90deg, rgba(239,208,213,0.3), transparent)' }} />
                    <p className="text-taupe leading-relaxed text-sm md:text-base font-medium">
                      {lang === 'en' && item.answerEn ? item.answerEn : item.answer}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="animate-on-scroll delay-4 mt-12 text-center">
          <p className="text-sm text-taupe mb-4 font-semibold">
            {t('لديكِ استفسار خاص لم يذكر؟', 'Have a specific question not mentioned here?')}
          </p>
          <button
            className="btn-secondary text-sm"
            onClick={() => { window.open('mailto:hello@femina-wellness.com', '_blank'); }}
          >
            {t('تواصلي مباشرة معنا', 'Contact Us Directly')}
          </button>
        </div>
      </div>
    </section>
  );
}

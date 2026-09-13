import { CheckCircle2, ShieldCheck, Heart, Clock, Sparkles, AlertTriangle, FileText, Phone, Dumbbell, Utensils } from 'lucide-react';
import { useLang } from '../context/LanguageContext';

export default function SubscriptionTermsInfo() {
  const { t, dir, lang } = useLang();

  return (
    <div className={`w-full max-w-4xl mx-auto mt-12 space-y-8 ${lang === 'ar' ? 'text-right' : 'text-left'}`} dir={dir}>
      
      {/* Main Header Banner */}
      <div 
        className="p-6 md:p-8 rounded-3xl border relative overflow-hidden text-center"
        style={{
          background: 'linear-gradient(135deg, rgba(90,33,53,0.7) 0%, rgba(31,8,17,0.9) 100%)',
          borderColor: 'rgba(186,120,92,0.4)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.4)',
        }}
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/15 border border-gold/30 text-gold text-xs font-bold mb-4">
          <Sparkles size={14} />
          {t('دليلكِ الشامل ومعلومات العضوية والمتابعة', 'Your Complete Guide & Membership Information')}
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">
          {t('فكرة بسيطة عن الاشتراك والمتابعة الفردية 🤍', 'A Simple Overview of Your Subscription & Personal Coaching 🤍')}
        </h2>
        <p className="text-taupe text-sm md:text-base leading-relaxed max-w-2xl mx-auto font-medium">
          {lang === 'ar' ? (
            <>المتابعة تكون فردية ومباشرة عبر <strong className="text-cream">الواتساب</strong>، وتصميم نظامك كاملاً مبني بدقة على (طولكِ، وزنكِ، عمركِ، هدفكِ ومشاكلكِ الصحية).</>
          ) : (
            <>Coaching is individual and direct via <strong className="text-cream">WhatsApp</strong>. Your entire program is precisely built based on your height, weight, age, goal, and health conditions.</>
          )}
        </p>
      </div>

      {/* Feature Grid Cards */}
      <div className="grid md:grid-cols-2 gap-4 md:gap-6">
        
        {/* Card 1: Nutrition Flexibility */}
        <div 
          className="p-6 rounded-2xl border transition-all duration-300 hover:border-gold/50"
          style={{ background: 'rgba(31,8,17,0.7)', borderColor: 'rgba(239,208,213,0.12)' }}
        >
          <div className="w-10 h-10 rounded-xl bg-gold/15 flex items-center justify-center mb-4 text-gold">
            <Utensils size={20} />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">
            {t('بماذا يتميز نوع النظام الغذائي؟', 'What makes the nutrition plan special?')}
          </h3>
          <p className="text-sm text-taupe leading-relaxed">
            {lang === 'ar' ? (
              <>• نظام سعرات محسوبة حسب طولكِ ووزنكِ وهدفكِ المحدد.<br />• يتميز بالمرونة والأريحية مع وجود كافة البدائل، وأكل بسيط متوفر في كل بيت تسوينه بطريقتكِ الحالية بدون تعقيد.</>
            ) : (
              <>• A calorie plan calculated based on your height, weight and specific goal.<br />• Flexible and easy with all alternatives available — simple food found in every home, prepared in your own way without complexity.</>
            )}
          </p>
        </div>

        {/* Card 2: Workout Plan */}
        <div 
          className="p-6 rounded-2xl border transition-all duration-300 hover:border-gold/50"
          style={{ background: 'rgba(31,8,17,0.7)', borderColor: 'rgba(239,208,213,0.12)' }}
        >
          <div className="w-10 h-10 rounded-xl bg-rose-500/15 flex items-center justify-center mb-4 text-rose-300">
            <Dumbbell size={20} />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">
            {t('كيف يتم تصميم الجدول الرياضي؟', 'How is the training schedule designed?')}
          </h3>
          <p className="text-sm text-taupe leading-relaxed">
            {lang === 'ar' ? (
              <>• يُصمم الجدول حسب هدفكِ وطبيعة جسمكِ ومكان تمرينكِ (سواء بالنادي أو في البيت).<br />• جدول شامل للجسم كاملاً مرفقاً بالشروحات التوضيحية لكل عضلة لتطبيق التمرين بالشكل الصحيح.</>
            ) : (
              <>• The schedule is designed based on your goal, body type, and training location (gym or home).<br />• A comprehensive full-body schedule accompanied by explanations for each muscle group to ensure correct exercise execution.</>
            )}
          </p>
        </div>

        {/* Card 3: Updates & Follow-up */}
        <div 
          className="p-6 rounded-2xl border transition-all duration-300 hover:border-gold/50"
          style={{ background: 'rgba(31,8,17,0.7)', borderColor: 'rgba(239,208,213,0.12)' }}
        >
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center mb-4 text-amber-300">
            <Clock size={20} />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">
            {t('هل النظام الغذائي والتمارين ثابته أم تتغير؟', 'Do the diet and training plans change over time?')}
          </h3>
          <p className="text-sm text-taupe leading-relaxed">
            {lang === 'ar' ? (
              <>• الجدول الغذائي والخطة التمرينية تتجدد وتتغير <strong className="text-cream font-bold">كل أسبوعين</strong> بناءً على قياساتكِ وأحدث مستجدات وزنكِ لتضمين استمرار التطور.</>
            ) : (
              <>• The nutrition and training plans are updated <strong className="text-cream font-bold">every two weeks</strong> based on your latest measurements and weight progress to ensure continuous improvement.</>
            )}
          </p>
        </div>

        {/* Card 4: Special Health Conditions */}
        <div 
          className="p-6 rounded-2xl border transition-all duration-300 hover:border-gold/50"
          style={{ background: 'rgba(31,8,17,0.7)', borderColor: 'rgba(239,208,213,0.12)' }}
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center mb-4 text-emerald-300">
            <Heart size={20} />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">
            {t('ملاءمة النظام للحالات الصحية', 'Program Compatibility with Health Conditions')}
          </h3>
          <p className="text-sm text-taupe leading-relaxed">
            {lang === 'ar' ? (
              <><strong className="text-emerald-400">خمول الغدة الدرقية:</strong> نعم، النظام مناسب جداً في حال الالتزام بالعلاج الطبي.<br /><strong className="text-emerald-400">تكيسات المبايض:</strong> نعم، متوافق ومخصص لتنظيم الهرمونات والتغذية الصحية.</>
            ) : (
              <><strong className="text-emerald-400">Hypothyroidism:</strong> Yes, the program is very suitable with proper medical treatment.<br /><strong className="text-emerald-400">PCOS:</strong> Yes, it's compatible and tailored to regulate hormones and promote healthy nutrition.</>
            )}
          </p>
        </div>

      </div>

      {/* Follow-up details & Timeline */}
      <div 
        className="p-6 md:p-8 rounded-3xl border"
        style={{
          background: 'linear-gradient(160deg, rgba(63,20,37,0.6) 0%, rgba(20,4,10,0.8) 100%)',
          borderColor: 'rgba(239,208,213,0.2)',
        }}
      >
        <h3 className="text-xl font-extrabold text-white mb-4 flex items-center gap-2">
          <Phone className="text-gold" size={20} />
          {t('آلية المتابعة والبداية بالبرنامج', 'Coaching Process & Program Start')}
        </h3>
        
        <div className="space-y-4 text-sm text-taupe">
          <div className="flex items-start gap-3">
            <CheckCircle2 size={18} className="text-gold shrink-0 mt-1" />
            <p>
              <strong className="text-white font-bold">{t('آلية المتابعة:', 'Coaching Method:')}</strong>{' '}
              {t(
                "متابعة يومية مستمرة خلال أوقات عمل المدربة حنان خالد للرد على كافة استفساراتكِ ومساعدتكِ في تطبيق النظام والتمارين.",
                "Continuous daily follow-up during Coach Hanan Khalid's working hours to answer all your questions and help you apply the nutrition and training plan."
              )}
            </p>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle2 size={18} className="text-gold shrink-0 mt-1" />
            <p>
              <strong className="text-white font-bold">{t('متى تكون البداية؟', 'When does it start?')}</strong>{' '}
              {t(
                'البداية تكون فورية، وخلال 24 ساعة من تأكيد الدفع يتم التواصل معكِ مباشرة عبر الواتساب لإكمال إرسال جدولكِ وتوجيهاتكِ.',
                'It starts immediately. Within 24 hours of payment confirmation, you will be directly contacted via WhatsApp to receive your full schedule and guidelines.'
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Terms & Conditions Section */}
      <div className="grid md:grid-cols-2 gap-6 pt-4">
        
        {/* Conditions */}
        <div 
          className="p-6 rounded-3xl border"
          style={{ background: 'rgba(31,8,17,0.8)', borderColor: 'rgba(186,120,92,0.3)' }}
        >
          <div className="flex items-center gap-2 mb-4 text-amber-400 font-bold text-base">
            <ShieldCheck size={20} />
            {t('شروط الاشتراك', 'Subscription Conditions')}
          </div>
          <ul className="space-y-2.5 text-xs md:text-sm text-taupe">
            <li className="flex items-center gap-2">✨ {t('الجدية والالتزام التام بالمسار.', 'Seriousness and full commitment to the program.')}</li>
            <li className="flex items-center gap-2">✨ {t('العمر لا يقل عن 15 سنة.', 'Minimum age of 15 years.')}</li>
            <li className="flex items-center gap-2">✨ {t('الدفع مسبقاً قبل استلام النظام.', 'Payment in advance before receiving the plan.')}</li>
            <li className="flex items-center gap-2">✨ {t('البدء فور استلام الجدول المخصص.', 'Start immediately upon receiving your personalized schedule.')}</li>
            <li className="flex items-center gap-2">✨ {t('التواصل والمتابعة عن طريق الواتساب فقط.', 'Communication and follow-up via WhatsApp only.')}</li>
            <li className="flex items-center gap-2">✨ {t('الاشتراك مخصص بالكامل للنساء فقط ♀️.', 'Subscription is exclusively for women ♀️.')}</li>
            <li className="flex items-center gap-2">✨ {t('عدم وجود مشاكل صحية حادة تمنع التمارين الرياضية.', 'No severe health conditions that prevent physical exercise.')}</li>
          </ul>
        </div>

        {/* Legal Terms */}
        <div 
          className="p-6 rounded-3xl border"
          style={{ background: 'rgba(31,8,17,0.8)', borderColor: 'rgba(186,120,92,0.3)' }}
        >
          <div className="flex items-center gap-2 mb-4 text-rose-300 font-bold text-base">
            <AlertTriangle size={20} />
            {t('الشروط والأحكام القانونية', 'Terms & Conditions')}
          </div>
          <ul className="space-y-2.5 text-xs md:text-sm text-taupe">
            <li className="flex items-start gap-2">
              <span>📌</span>
              <span>{t('تمام الدفع يُعد موافقة رسمية من المشتركة على جميع الشروط والأحكام.', "Completing payment is considered official consent to all terms and conditions.")}</span>
            </li>
            <li className="flex items-start gap-2">
              <span>📌</span>
              <span>{t('يُمنع منعاً باتاً مشاركة أو نشر النظام الخاص بالمشتركة؛ والمخالفة تعرض صاحبها للمساءلة.', "It is strictly prohibited to share or publish the subscriber's personal plan. Violations will result in legal accountability.")}</span>
            </li>
            <li className="flex items-start gap-2">
              <span>📌</span>
              <span>{t('الرجاء التأكد التام من صحة رقم الجوال/الواتساب وحساب الإنستجرام المكتوب.', 'Please ensure that your phone/WhatsApp number and Instagram username are entered correctly.')}</span>
            </li>
          </ul>
        </div>

      </div>

      <div className="text-center pt-4 text-xs text-taupe/60 flex items-center justify-center gap-2">
        <FileText size={14} />
        {t('منظومة المدربة د/ك حنان خالد — جميع الحقوق محفوظة', "Coach Hanan Khalid's System — All Rights Reserved")}
      </div>

    </div>
  );
}

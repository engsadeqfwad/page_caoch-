import { CheckCircle2, ShieldCheck, Heart, Clock, Sparkles, AlertTriangle, FileText, Phone, Dumbbell, Utensils } from 'lucide-react';

export default function SubscriptionTermsInfo() {
  return (
    <div className="w-full max-w-4xl mx-auto mt-12 space-y-8 text-right" dir="rtl">
      
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
          دليلكِ الشامل ومعلومات العضوية والمتابعة
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">
          فكرة بسيطة عن الاشتراك والمتابعة الفردية 🤍
        </h2>
        <p className="text-taupe text-sm md:text-base leading-relaxed max-w-2xl mx-auto font-medium">
          المتابعة تكون فردية ومباشرة عبر <strong className="text-cream">الواتساب</strong>، وتصميم نظامك كاملاً مبني بدقة على (طولكِ، وزنكِ، عمركِ، هدفكِ ومشاكلكِ الصحية).
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
          <h3 className="text-lg font-bold text-white mb-2">بماذا يتميز نوع النظام الغذائي؟</h3>
          <p className="text-sm text-taupe leading-relaxed">
            • نظام سعرات محسوبة حسب طولكِ ووزنكِ وهدفكِ المح محدد.<br />
            • يتميز بالمرونة والأريحية مع وجود كافة البدائل، وأكل بسيط متوفر في كل بيت تسوينه بطريقتكِ الحالية بدون تعقيد.
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
          <h3 className="text-lg font-bold text-white mb-2">كيف يتم تصميم الجدول الرياضي؟</h3>
          <p className="text-sm text-taupe leading-relaxed">
            • يُصمم الجدول حسب هدفكِ وطبيعة جسمكِ ومكان تمرينكِ (سواء بالنادي أو في البيت).<br />
            • جدول شامل للجسم كاملاً مرفقاً بالشروحات  التوضيحية لكل عضلة لتطبيق التمرين بالشكل الصحيح.
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
          <h3 className="text-lg font-bold text-white mb-2">هل النظام الغذائي والتمارين ثابته أم تتغير؟</h3>
          <p className="text-sm text-taupe leading-relaxed">
            • الجدول الغذائي والخطة التمرينية تتجدد وتتغير <strong className="text-cream font-bold">كل أسبوعين</strong> بناءً على قياساتكِ وأحدث مستجدات وزنكِ لتضمين استمرار التطور.
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
          <h3 className="text-lg font-bold text-white mb-2">ملاءمة النظام للحالات الصحية</h3>
          <p className="text-sm text-taupe leading-relaxed">
            • <strong className="text-emerald-400">خمول الغدة الدرقية:</strong> نعم، النظام مناسب جداً في حال الالتزام بالعلاج الطبي.<br />
            • <strong className="text-emerald-400">تكيسات المبايض:</strong> نعم، متوافق ومخصص لتنظيم الهرمونات والتغذية الصحية.
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
          آلية المتابعة والبداية بالبرنامج
        </h3>
        
        <div className="space-y-4 text-sm text-taupe">
          <div className="flex items-start gap-3">
            <CheckCircle2 size={18} className="text-gold shrink-0 mt-1" />
            <p>
              <strong className="text-white font-bold">آلية المتابعة:</strong> متابعة يومية مستمرة خلال أوقات عمل المدربة حنان خالد للرد على كافة استفساراتكِ ومساعدتكِ في تطبيق النظام والتمارين.
            </p>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle2 size={18} className="text-gold shrink-0 mt-1" />
            <p>
              <strong className="text-white font-bold">متى تكون البداية؟</strong> البداية تكون فورية، وخلال 24 ساعة من تأكيد الدفع يتم التواصل معكِ مباشرة عبر الواتساب لإكمال إرسال جدولكِ وتوجيهاتكِ.
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
            شروط الاشتراك
          </div>
          <ul className="space-y-2.5 text-xs md:text-sm text-taupe">
            <li className="flex items-center gap-2">✨ الجدية والالتزام التام بالمسار.</li>
            <li className="flex items-center gap-2">✨ العمر لا يقل عن 15 سنة.</li>
            <li className="flex items-center gap-2">✨ الدفع مسبقاً قبل استلام النظام.</li>
            <li className="flex items-center gap-2">✨ البدء فور استلام الجدول المخصص.</li>
            <li className="flex items-center gap-2">✨ التواصل والمتابعة عن طريق الواتساب فقط.</li>
            <li className="flex items-center gap-2">✨ الاشتراك مخصص بالكامل للنساء فقط ♀️.</li>
            <li className="flex items-center gap-2">✨ عدم وجود مشاكل صحية حادة تمنع التمارين الرياضية.</li>
          </ul>
        </div>

        {/* Legal Terms */}
        <div 
          className="p-6 rounded-3xl border"
          style={{ background: 'rgba(31,8,17,0.8)', borderColor: 'rgba(186,120,92,0.3)' }}
        >
          <div className="flex items-center gap-2 mb-4 text-rose-300 font-bold text-base">
            <AlertTriangle size={20} />
            الشروط والأحكام القانونية
          </div>
          <ul className="space-y-2.5 text-xs md:text-sm text-taupe">
            <li className="flex items-start gap-2">
              <span>📌</span>
              <span>تمام الدفع يُعد موافقة رسمية من المشتركة على جميع الشروط والأحكام.</span>
            </li>
            <li className="flex items-start gap-2">
              <span>📌</span>
              <span>يُمنع منعاً باتاً مشاركة أو نشر النظام الخاص بالمشتركة؛ والمخالفة تعرض صاحبها للمساءلة.</span>
            </li>
            <li className="flex items-start gap-2">
              <span>📌</span>
              <span>الرجاء التأكد التام من صحة رقم الجوال/الواتساب وحساب الإنستجرام المكتوب.</span>
            </li>
          </ul>
        </div>

      </div>

      <div className="text-center pt-4 text-xs text-taupe/60 flex items-center justify-center gap-2">
        <FileText size={14} />
        منظومة المدربة د/ك حنان خالد — جميع الحقوق محفوظة
      </div>

    </div>
  );
}

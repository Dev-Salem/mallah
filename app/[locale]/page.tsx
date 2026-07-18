import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { Link } from "@/lib/i18n/routing";
import { ArrowRight, Compass, BriefcaseBusiness, Languages, Sparkles } from "lucide-react";
import { Logo, LogoText } from "@/components/ui/logo";
import { getTranslations, getLocale } from "next-intl/server";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { ThemeToggle } from "@/components/shared/theme-toggle";

export default async function LandingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const t = await getTranslations();
  const locale = await getLocale();

  const isArabic = locale.startsWith("ar");
  const ctaHref = user ? "/dashboard" : "/login";

  const navItems = [
    { key: "gap", id: "the-gap" },
    { key: "process", id: "process" },
    { key: "features", id: "features" },
    { key: "outcomes", id: "outcomes" },
  ];

  const featureCards = isArabic
    ? [
        {
          icon: Compass,
          title: "مسار واضح بدل العشوائية",
          body: "تبدأ من مكانك الحقيقي، ثم تمشي على خارطة تعلم مرتبة بدل ما تضيع بين مصادر متفرقة.",
          tone: "from-primary/20 via-primary/5 to-transparent",
        },
        {
          icon: BriefcaseBusiness,
          title: "مشاريع تبني ثقة وسوقية",
          body: "كل مرحلة مرتبطة بمشروع فعلي يثبت قدرتك، مو مجرد متابعة دروس ونظريات.",
          tone: "from-amber-500/20 via-amber-500/5 to-transparent",
        },
        {
          icon: Languages,
          title: "تجربة ثنائية اللغة من البداية",
          body: "ملاح يشرح لك ويقودك بالعربي والإنجليزي بدون ما تحس أنك مضطر تغيّر أسلوب تعلمك.",
          tone: "from-sky-500/20 via-sky-500/5 to-transparent",
        },
        {
          icon: Sparkles,
          title: "إرشاد ذكي بدون ضجيج",
          body: "بدل النصائح العامة، تحصل على توجيه يساعدك تعرف الخطوة التالية ولماذا هي المهمة الآن.",
          tone: "from-emerald-500/20 via-emerald-500/5 to-transparent",
        },
      ]
    : [
        {
          icon: Compass,
          title: "A roadmap instead of resource chaos",
          body: "Start from your actual level, then move through a curated path that removes guesswork and wasted study hours.",
          tone: "from-primary/20 via-primary/5 to-transparent",
        },
        {
          icon: BriefcaseBusiness,
          title: "Projects that turn effort into proof",
          body: "Every stage builds toward portfolio-grade work so employers can see more than motivation and theory.",
          tone: "from-amber-500/20 via-amber-500/5 to-transparent",
        },
        {
          icon: Languages,
          title: "Bilingual by default",
          body: "Learn in Arabic, English, or a mix, without sacrificing clarity, momentum, or professional vocabulary.",
          tone: "from-sky-500/20 via-sky-500/5 to-transparent",
        },
        {
          icon: Sparkles,
          title: "Guidance that feels specific",
          body: "Instead of generic inspiration, Mallah helps you understand the next move and why it matters right now.",
          tone: "from-emerald-500/20 via-emerald-500/5 to-transparent",
        },
      ];

  const outcomeCards = isArabic
    ? [
        {
          value: "01",
          title: "بورتفوليو مرتب",
          body: "مشاريع قابلة للعرض بدل محاولات متفرقة محفوظة في مجلدات منسية.",
        },
        {
          value: "02",
          title: "هوية مهنية أوضح",
          body: "تعرف أي مسار يناسبك، وما المهارات التي تثبت أنك جاهز له.",
        },
        {
          value: "03",
          title: "انطلاقة أسرع للتقديم",
          body: "تصل للسوق ومعك أمثلة، قصة واضحة، وثقة أعلى عند التقديم.",
        },
      ]
    : [
        {
          value: "01",
          title: "A portfolio with signal",
          body: "Not scattered practice files, but visible work that supports your story and skill level.",
        },
        {
          value: "02",
          title: "A clearer professional identity",
          body: "You know which track you are pursuing and what evidence proves you belong there.",
        },
        {
          value: "03",
          title: "Faster readiness for applications",
          body: "You reach the market with projects, narrative, and much less hesitation.",
        },
      ];

  const proofStrip = isArabic
    ? [
        "٤ مسارات مهنية متخصصة",
        "مشاريع فعلية تبني البورتفوليو",
        "تجربة عربية وإنجليزية",
      ]
    : [
        "4 specialized career tracks",
        "Real projects with portfolio value",
        "Arabic and English learning flow",
      ];

  const footerLinks = [
    { label: t("Navigation.gap"), href: "#the-gap" },
    { label: t("Navigation.process"), href: "#process" },
    { label: t("Navigation.features"), href: "#features" },
    { label: t("Navigation.outcomes"), href: "#outcomes" },
  ];

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background selection:bg-primary selection:text-primary-foreground">
      <div className="fixed inset-0 noise pointer-events-none mix-blend-overlay" />
      <div className="pointer-events-none fixed inset-0 opacity-30 [background:radial-gradient(circle_at_top,color-mix(in_oklch,var(--primary),transparent_75%),transparent_45%),radial-gradient(circle_at_80%_20%,color-mix(in_oklch,var(--foreground),transparent_92%),transparent_30%)]" />
      <div className="pointer-events-none fixed inset-0 hud-grid opacity-[0.18]" />

      <header className="fixed top-0 z-50 w-full px-4 pt-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-primary/10 bg-background/75 px-4 py-3 shadow-[0_20px_80px_-32px_color-mix(in_oklch,var(--foreground),transparent_80%)] backdrop-blur-2xl lg:px-6">
          <LogoText />
          <div className="flex items-center gap-3 lg:gap-5">
            <nav className="hidden items-center gap-5 lg:flex">
              {navItems.map((item) => (
                <a
                  key={item.key}
                  href={`#${item.id}`}
                  className={`text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground ${!isArabic ? "tracking-[0.18em] uppercase" : ""}`}
                >
                  {t(`Navigation.${item.key}`)}
                </a>
              ))}
            </nav>
            <ThemeToggle />
            <LanguageSwitcher />
            <Link href={ctaHref}>
              <Button className={`h-10 rounded-full px-5 text-[11px] font-semibold shadow-[0_20px_50px_-20px_var(--primary)] ${!isArabic ? "uppercase tracking-[0.18em]" : ""}`}>
                {user ? t("Navigation.dashboard") : t("Navigation.join")}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="w-full max-w-full overflow-x-hidden">
        <section className="relative px-6 pb-24 pt-32 md:pb-32 lg:px-12 lg:pb-40 lg:pt-44">
          <div className="mx-auto grid max-w-7xl items-end gap-16 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
            <div className="relative z-10">
              <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-primary/15 bg-primary/5 px-4 py-2 text-[11px] text-primary">
                <span className={`font-medium ${!isArabic ? "uppercase tracking-[0.22em]" : ""}`}>{t("Hero.navLog")}</span>
              </div>

              <h1
                className={`max-w-6xl text-[clamp(3.3rem,8vw,7rem)] font-black leading-[0.94] text-foreground ${!isArabic ? "tracking-[-0.05em]" : ""}`}
              >
                {t("Hero.title1")}{" "}
                <span className="mx-1 inline-flex h-[0.8em] w-[1.9em] translate-y-[-0.05em] items-center justify-center overflow-hidden rounded-full border border-primary/20 bg-gradient-to-br from-primary/30 via-primary/10 to-transparent align-middle shadow-[0_20px_60px_-30px_var(--primary)]">
                  <Logo size={54} />
                </span>{" "}
                <span className="text-primary">{t("Hero.title2")}</span>
              </h1>

              <div className="mt-10 max-w-2xl">
                <p className="text-lg leading-8 text-muted-foreground md:text-xl">
                  {t("Hero.subtitle")}
                </p>
              </div>

              <div className="mt-12 flex flex-wrap items-center gap-4">
                <Link href={ctaHref}>
                  <Button
                    size="lg"
                    className={`h-14 rounded-full px-8 text-sm font-semibold shadow-[0_24px_70px_-28px_var(--primary)] ${!isArabic ? "uppercase tracking-[0.16em]" : ""}`}
                  >
                    {t("Hero.initiate")}
                    <ArrowRight className={`ms-3 h-4 w-4 transition-transform group-hover:translate-x-1 ${isArabic ? "rotate-180" : ""}`} />
                  </Button>
                </Link>
                <div className="rounded-full border border-border/70 bg-card/80 px-5 py-3 text-sm text-muted-foreground backdrop-blur">
                  {t("Hero.statusDetail")}
                </div>
              </div>

              <div className="mt-16 grid gap-3 md:grid-cols-3">
                {proofStrip.map((item) => (
                  <div key={item} className="rounded-3xl border border-border/70 bg-card/80 px-5 py-5 backdrop-blur">
                    <p className={`text-sm text-foreground ${!isArabic ? "tracking-[0.04em]" : ""}`}>{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-primary/15 via-transparent to-primary/5 blur-3xl" />
              <div className="relative overflow-hidden rounded-[2rem] border border-primary/10 bg-card/85 p-6 shadow-[0_30px_100px_-40px_color-mix(in_oklch,var(--foreground),transparent_70%)] backdrop-blur">
                <div className="mb-6 flex items-center justify-between">
                  <span className={`text-[11px] text-primary ${!isArabic ? "uppercase tracking-[0.22em]" : ""}`}>{t("Process.label")}</span>
                  <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_18px_var(--primary)]" />
                </div>
                <div className="grid gap-4">
                  {[
                    { idx: "01", key: "step1Title", desc: "step1Desc" },
                    { idx: "02", key: "step2Title", desc: "step2Desc" },
                    { idx: "03", key: "step3Title", desc: "step3Desc" },
                    { idx: "04", key: "step4Title", desc: "step4Desc" },
                  ].map((step) => (
                    <div key={step.idx} className="group rounded-[1.6rem] border border-border/60 bg-background/70 p-5 transition-transform duration-500 hover:-translate-y-1">
                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-xs text-primary">{step.idx}</span>
                        <div className="h-px w-16 bg-gradient-to-r from-primary/70 to-transparent transition-all duration-500 group-hover:w-24" />
                      </div>
                      <h3 className="mb-2 text-lg font-semibold text-foreground">{t(`Process.${step.key}`)}</h3>
                      <p className="text-sm leading-7 text-muted-foreground">{t(`Process.${step.desc}`)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="the-gap" className="relative px-6 py-24 lg:px-12 lg:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="mb-14 max-w-3xl">
              <span className={`mb-5 inline-block rounded-full border border-primary/15 bg-primary/5 px-4 py-2 text-[11px] text-primary ${!isArabic ? "uppercase tracking-[0.2em]" : ""}`}>
                {t("Problem.label")}
              </span>
              <h2 className={`max-w-4xl text-4xl font-black leading-tight text-foreground md:text-6xl ${!isArabic ? "tracking-[-0.04em]" : ""}`}>
                {t("Problem.title")}
              </h2>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">{t("Problem.subtitle")}</p>
            </div>

            <div className="grid grid-flow-dense gap-5 lg:grid-cols-12">
              <div className="overflow-hidden rounded-[2rem] border border-border/70 bg-card/80 p-8 backdrop-blur lg:col-span-5">
                <div className="mb-10 flex items-center justify-between">
                  <span className={`text-[11px] text-primary ${!isArabic ? "uppercase tracking-[0.22em]" : ""}`}>01</span>
                  <div className="h-px w-20 bg-gradient-to-l from-primary/70 to-transparent" />
                </div>
                <h3 className="mb-4 text-2xl font-semibold text-foreground">{t("Problem.item1Title")}</h3>
                <p className="leading-8 text-muted-foreground">{t("Problem.item1Desc")}</p>
              </div>

              <div className="overflow-hidden rounded-[2rem] border border-border/70 bg-gradient-to-br from-primary/10 via-card/90 to-card/70 p-8 backdrop-blur lg:col-span-7">
                <div className="mb-16 flex items-center justify-between">
                  <span className={`text-[11px] text-primary ${!isArabic ? "uppercase tracking-[0.22em]" : ""}`}>02</span>
                  <div className="rounded-full border border-primary/15 px-4 py-2 text-xs text-primary">
                    {t("Navigation.features")}
                  </div>
                </div>
                <div className="max-w-2xl">
                  <h3 className="mb-4 text-3xl font-semibold text-foreground md:text-4xl">
                    {t("Problem.item2Title")}
                  </h3>
                  <p className="text-lg leading-8 text-muted-foreground">{t("Problem.item2Desc")}</p>
                </div>
              </div>

              <div className="overflow-hidden rounded-[2rem] border border-border/70 bg-card/80 p-8 backdrop-blur lg:col-span-7">
                <div className="mb-10 flex items-center justify-between">
                  <span className={`text-[11px] text-primary ${!isArabic ? "uppercase tracking-[0.22em]" : ""}`}>03</span>
                  <div className="h-px w-20 bg-gradient-to-r from-primary/70 to-transparent" />
                </div>
                <h3 className="mb-4 text-2xl font-semibold text-foreground">{t("Problem.item3Title")}</h3>
                <p className="max-w-2xl leading-8 text-muted-foreground">{t("Problem.item3Desc")}</p>
              </div>

              <div className="overflow-hidden rounded-[2rem] border border-border/70 bg-foreground p-8 text-background lg:col-span-5">
                <p className={`text-[11px] opacity-70 ${!isArabic ? "uppercase tracking-[0.22em]" : ""}`}>{t("Hero.navLog")}</p>
                <p className="mt-12 text-2xl font-semibold leading-tight md:text-3xl">
                  {isArabic
                    ? "الهدف مو إنك تدرس أكثر. الهدف إنك تعرف وش تبني، ومتى، وليه."
                    : "The goal is not to study more. The goal is to know what to build, when to build it, and why it matters."}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="process" className="relative px-6 py-24 lg:px-12 lg:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
              <div>
                <span className={`mb-5 inline-block text-[11px] text-primary ${!isArabic ? "uppercase tracking-[0.2em]" : ""}`}>
                  {t("Process.label")}
                </span>
                <h2 className={`text-4xl font-black leading-tight text-foreground md:text-6xl ${!isArabic ? "tracking-[-0.04em]" : ""}`}>
                  {t("Process.title")}
                </h2>
              </div>
              <div className="rounded-[2rem] border border-border/70 bg-card/80 p-8 backdrop-blur">
                <p className="text-lg leading-8 text-muted-foreground">{t("Process.quote")}</p>
              </div>
            </div>

            <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {[
                { key: "step1" },
                { key: "step2" },
                { key: "step3" },
                { key: "step4" },
              ].map((step, index) => (
                <div
                  key={step.key}
                  className="group rounded-[2rem] border border-border/70 bg-card/80 p-8 backdrop-blur transition-all duration-500 hover:-translate-y-2 hover:border-primary/20"
                >
                  <span className={`text-[11px] text-primary ${!isArabic ? "uppercase tracking-[0.22em]" : ""}`}>0{index + 1}</span>
                  <h3 className="mt-8 text-2xl font-semibold text-foreground">{t(`Process.${step.key}Title`)}</h3>
                  <div className="mt-5 h-px w-12 bg-primary/50 transition-all duration-500 group-hover:w-20" />
                  <p className="mt-5 leading-8 text-muted-foreground">{t(`Process.${step.key}Desc`)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="relative px-6 py-24 lg:px-12 lg:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="mb-14 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <span className={`mb-5 inline-block text-[11px] text-primary ${!isArabic ? "uppercase tracking-[0.2em]" : ""}`}>
                  {t("Navigation.features")}
                </span>
                <h2 className={`text-4xl font-black leading-tight text-foreground md:text-6xl ${!isArabic ? "tracking-[-0.04em]" : ""}`}>
                  {isArabic ? "تعلم منظم، لكن بطموح عملي." : "Structured learning, built for real career momentum."}
                </h2>
              </div>
              <p className="max-w-xl text-lg leading-8 text-muted-foreground">
                {isArabic
                  ? "المنصة الأفضل هنا ليست التي تعطيك أكثر محتوى. هي التي ترتب لك القرار، المشروع، والدليل على التقدم."
                  : "The strongest platform here is not the one with the most content. It is the one that organizes decisions, projects, and visible progress."}
              </p>
            </div>

            <div className="grid grid-flow-dense gap-5 lg:grid-cols-12">
              {featureCards.map((card, index) => {
                const Icon = card.icon;
                const spanClass =
                  index === 0
                    ? "lg:col-span-7"
                    : index === 1
                      ? "lg:col-span-5"
                      : index === 2
                        ? "lg:col-span-5"
                        : "lg:col-span-7";

                return (
                  <div
                    key={card.title}
                    className={`group relative overflow-hidden rounded-[2rem] border border-border/70 bg-card/80 p-8 backdrop-blur transition-transform duration-500 hover:-translate-y-1 ${spanClass}`}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${card.tone} opacity-80 transition-opacity duration-500 group-hover:opacity-100`} />
                    <div className="relative z-10">
                      <div className="mb-10 flex h-12 w-12 items-center justify-center rounded-2xl border border-border/60 bg-background/80">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="max-w-lg text-2xl font-semibold text-foreground md:text-3xl">{card.title}</h3>
                      <p className="mt-5 max-w-2xl leading-8 text-muted-foreground">{card.body}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section id="outcomes" className="relative px-6 py-24 lg:px-12 lg:py-32">
          <div className="mx-auto max-w-7xl rounded-[2.5rem] border border-primary/10 bg-gradient-to-br from-primary/8 via-card to-card p-8 shadow-[0_35px_120px_-60px_var(--primary)] md:p-12">
            <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
              <div>
                <span className={`mb-5 inline-block text-[11px] text-primary ${!isArabic ? "uppercase tracking-[0.2em]" : ""}`}>
                  {t("Navigation.outcomes")}
                </span>
                <h2 className={`text-4xl font-black leading-tight text-foreground md:text-6xl ${!isArabic ? "tracking-[-0.04em]" : ""}`}>
                  {isArabic ? "النتيجة ليست فقط التعلم. النتيجة أنك تصير قابل للتقديم." : "The outcome is not just learning. It is becoming legible to the market."}
                </h2>
                <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
                  {isArabic
                    ? "ملاح يجمع بين التعلّم، المشاريع، والسرد المهني حتى يصير عندك شيء حقيقي تقدمه."
                    : "Mallah connects study, projects, and professional narrative so you finish with something real to present."}
                </p>
              </div>

              <div className="grid gap-5">
                {outcomeCards.map((card) => (
                  <div key={card.value} className="rounded-[1.8rem] border border-border/70 bg-background/75 p-6 backdrop-blur">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <span className={`text-sm text-primary ${!isArabic ? "tracking-[0.22em]" : ""}`}>{card.value}</span>
                      <div className="max-w-xl">
                        <h3 className="text-2xl font-semibold text-foreground">{card.title}</h3>
                        <p className="mt-3 leading-8 text-muted-foreground">{card.body}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="relative px-6 pb-28 pt-10 lg:px-12 lg:pb-36">
          <div className="mx-auto max-w-6xl text-center">
            <span className={`mb-6 inline-block text-[11px] text-primary ${!isArabic ? "uppercase tracking-[0.2em]" : ""}`}>{t("CTA.label")}</span>
            <h2 className={`mx-auto max-w-5xl text-4xl font-black leading-[1.02] text-foreground md:text-6xl lg:text-7xl ${!isArabic ? "tracking-[-0.05em]" : ""}`}>
              {t("CTA.title")}
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">{t("CTA.subtitle")}</p>

            <div className="mt-12 flex flex-col items-center gap-5">
              <Link href={ctaHref}>
                <Button
                  size="lg"
                  className={`h-16 rounded-full px-10 text-sm font-semibold shadow-[0_28px_80px_-24px_var(--primary)] ${!isArabic ? "uppercase tracking-[0.18em]" : ""}`}
                >
                  {t("CTA.button")}
                </Button>
              </Link>
              {!user ? (
                <Link href="/login" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  {t("CTA.login")}
                </Link>
              ) : null}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/70 px-6 py-12 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div>
            <LogoText />
            <p className="mt-6 max-w-md text-sm leading-7 text-muted-foreground">{t("Footer.desc")}</p>
          </div>

          <div>
            <p className={`mb-4 text-[11px] text-primary ${!isArabic ? "uppercase tracking-[0.2em]" : ""}`}>{t("Footer.coords")}</p>
            <div className="flex flex-col gap-3">
              {footerLinks.map((link) => (
                <a key={link.href} href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className={`mb-4 text-[11px] text-primary ${!isArabic ? "uppercase tracking-[0.2em]" : ""}`}>{t("Footer.trans")}</p>
            <div className="flex flex-col gap-3 text-sm text-muted-foreground">
              <a href="#" className="transition-colors hover:text-foreground">
                {t("Footer.contact")}
              </a>
              <a href="#" className="transition-colors hover:text-foreground">
                {t("Footer.privacy")}
              </a>
              <p className="pt-6 text-xs text-muted-foreground/70">{t("Footer.copyright")}</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

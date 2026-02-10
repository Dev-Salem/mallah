import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowRight, 
  Target, 
  Rocket, 
  Map, 
  Layers, 
  FileText, 
  Search, 
  ShieldCheck, 
  GraduationCap, 
  Briefcase, 
  Cpu
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-min-h-screen flex-col overflow-x-hidden">
      {/* Navigation */}
      <header className="fixed top-0 z-50 w-full border-b border-white/10 glass">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-purple-600 flex items-center justify-center">
              <span className="font-bold text-white text-lg">M</span>
            </div>
            <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
              Mallah
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#problem" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">The Gap</a>
            <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Process</a>
            <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#outcomes" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Outcomes</a>
          </nav>
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="text-sm">Sign In</Button>
            <Button className="bg-emerald-600 hover:bg-emerald-500 text-white border-0 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              Get Started
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="relative px-4 pt-24 pb-32 md:pt-32 md:pb-48">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.1),transparent_50%)]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-20 h-[500px] w-[500px] bg-purple-600/10 blur-[120px]" />
          
          <div className="container mx-auto text-center max-w-4xl">
            <Badge variant="outline" className="mb-6 px-4 py-1 border-emerald-500/30 bg-emerald-500/5 text-emerald-400 font-medium">
              Career Preparation Platform
            </Badge>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
              Bridge the Gap Between Graduation and Employment
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              University gives you the degree. Mallah gives you the career. Structured roadmaps, project-based evidence, and AI-assisted optimization to make you job-ready from day one.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="h-12 px-8 bg-emerald-600 hover:bg-emerald-500 text-white text-base">
                Start Your Career Path <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg" className="h-12 px-8 border-white/10 glass hover:bg-white/5 text-base">
                View Roadmap Demo
              </Button>
            </div>
          </div>
        </section>

        {/* The Problem Section */}
        <section id="problem" className="py-24 border-t border-white/5 bg-black/20">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">The Academic Disconnect</h2>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="h-10 w-10 shrink-0 rounded-full bg-red-500/10 flex items-center justify-center">
                      <ShieldCheck className="h-5 w-5 text-red-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg text-white">Theory vs. Practice</h4>
                      <p className="text-muted-foreground">Classrooms focus on academic theory, leaving graduates without the hands-on project experience required by competitive tech firms.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="h-10 w-10 shrink-0 rounded-full bg-red-500/10 flex items-center justify-center">
                      <Search className="h-5 w-5 text-red-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg text-white">Information Overload</h4>
                      <p className="text-muted-foreground">The internet is full of scattered resources, making it impossible for beginners to know which skills are actually relevant in today's market.</p>
                    </div>
                  </div>
                </div>
              </div>
              <Card className="glass border-white/10 p-8">
                <blockquote className="text-xl italic text-white/80 leading-relaxed border-l-4 border-emerald-500 pl-6 mb-6">
                  "Most CS graduates feel qualified for a degree, but unqualified for a job. Mallah was built to solve this transition."
                </blockquote>
                <p className="text-sm text-muted-foreground">— The Mallah Philosophy</p>
              </Card>
            </div>
          </div>
        </section>

        {/* What is Mallah */}
        <section id="what-is" className="py-24 relative overflow-hidden">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">Precision Career Engineering</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-16 leading-relaxed">
              Mallah is not just another learning platform. It is a career preparation engine designed to turn your academic potential into professional reality through structured direction and skill validation.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="p-8 rounded-2xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors">
                <Target className="h-10 w-10 text-emerald-500 mb-6" />
                <h3 className="text-xl font-bold text-white mb-3">Structured Direction</h3>
                <p className="text-muted-foreground">No more guessing. Predefined roadmaps show exactly where you are and what step you need to take next.</p>
              </div>
              <div className="p-8 rounded-2xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors">
                <Rocket className="h-10 w-10 text-purple-500 mb-6" />
                <h3 className="text-xl font-bold text-white mb-3">Skill Evidence</h3>
                <p className="text-muted-foreground">Don't just claim skills. Build verified projects that serve as tangible proof of your technical capabilities.</p>
              </div>
              <div className="p-8 rounded-2xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors">
                <FileText className="h-10 w-10 text-blue-500 mb-6" />
                <h3 className="text-xl font-bold text-white mb-3">Job Readiness</h3>
                <p className="text-muted-foreground">Move beyond 'content consumption'. Our platform forces an outcome-focused approach to every topic you learn.</p>
              </div>
            </div>
          </div>
        </section>

        {/* How Mallah Works */}
        <section id="how-it-works" className="py-24 bg-emerald-500/5 border-y border-emerald-500/10">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Your Path to Preparation</h2>
              <p className="text-muted-foreground">A four-step process to transform your career prospects.</p>
            </div>
            <div className="grid md:grid-cols-4 gap-8">
              {[
                { title: "Onboarding", desc: "Define your background and career interests through guided assessment." },
                { title: "Recommendation", desc: "Select a specialized career path backed by real-world market demand." },
                { title: "Execution", desc: "Follow a structured roadmap through stages, topics, and practical projects." },
                { title: "Validation", desc: "Generate a skills-first resume and portfolio optimized for hiring managers." }
              ].map((step, idx) => (
                <div key={idx} className="relative">
                  <div className="mb-4 text-4xl font-extrabold text-emerald-500/20">{idx + 1}</div>
                  <h4 className="text-lg font-bold text-white mb-2">{step.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Core Features */}
        <section id="features" className="py-24">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-white">Integrated Career Suite</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="glass border-white/10 overflow-hidden group">
                <CardContent className="p-0 flex flex-col md:flex-row h-full">
                  <div className="p-8 flex-1">
                    <Map className="h-8 w-8 text-emerald-500 mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">Learning Roadmaps</h3>
                    <p className="text-muted-foreground mb-4">Granular, step-by-step paths from basics to advanced specialization. Never feel lost again with clear stages and actionable topics.</p>
                    <ul className="text-sm space-y-2 text-white/70">
                      <li className="flex items-center gap-2">• Interactive progress tracking</li>
                      <li className="flex items-center gap-2">• Curriculum aligned with job roles</li>
                      <li className="flex items-center gap-2">• Resource curation for every topic</li>
                    </ul>
                  </div>
                  <div className="md:w-1/3 bg-emerald-900/10 border-l border-white/5 flex items-center justify-center p-8">
                    <div className="h-full w-full rounded border border-emerald-500/20 bg-emerald-500/5 animate-pulse" />
                  </div>
                </CardContent>
              </Card>

              <Card className="glass border-white/10 overflow-hidden group">
                <CardContent className="p-0 flex flex-col md:flex-row h-full">
                  <div className="p-8 flex-1">
                    <Cpu className="h-8 w-8 text-purple-500 mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">Opportunity Analyzer</h3>
                    <p className="text-muted-foreground mb-4">Upload any job description and let AI map your current skills against market requirements. Identify gaps and generate action plans.</p>
                    <ul className="text-sm space-y-2 text-white/70">
                      <li className="flex items-center gap-2">• AI-driven skill gap detection</li>
                      <li className="flex items-center gap-2">• Automated action plan generation</li>
                      <li className="flex items-center gap-2">• Market demand scoring</li>
                    </ul>
                  </div>
                  <div className="md:w-1/3 bg-purple-900/10 border-l border-white/5 flex items-center justify-center p-8">
                    <div className="h-full w-full rounded border border-purple-500/20 bg-purple-500/5 animate-pulse" />
                  </div>
                </CardContent>
              </Card>

              <Card className="glass border-white/10 overflow-hidden">
                <CardContent className="p-0 flex flex-col md:flex-row h-full">
                  <div className="p-8 flex-1">
                    <Layers className="h-8 w-8 text-emerald-500 mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">Skills & Projects Hub</h3>
                    <p className="text-muted-foreground mb-4">A central repository for your technical evidence. Every project you complete is tagged with specific skills to build your professional profile.</p>
                  </div>
                  <div className="md:w-1/3 bg-emerald-900/10 border-l border-white/5 p-8 flex items-center justify-center">
                    <div className="grid grid-cols-2 gap-2 w-full">
                      {[1,2,3,4].map(i => <div key={i} className="h-8 rounded bg-emerald-500/10 border border-emerald-500/20" />)}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass border-white/10 overflow-hidden">
                <CardContent className="p-0 flex flex-col md:flex-row h-full">
                  <div className="p-8 flex-1">
                    <FileText className="h-8 w-8 text-purple-500 mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">Smart Resume Builder</h3>
                    <p className="text-muted-foreground mb-4">AI assistance that focuses on wording and impact. Turn basic descriptions into powerful professional statements that pass ATS systems.</p>
                  </div>
                  <div className="md:w-1/3 bg-purple-900/10 border-l border-white/5 p-8 flex flex-col gap-2 justify-center">
                    <div className="h-4 w-full bg-purple-500/20 rounded" />
                    <div className="h-4 w-3/4 bg-purple-500/10 rounded" />
                    <div className="h-4 w-full bg-purple-500/20 rounded" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Why Mallah is Different */}
        <section className="py-24 bg-zinc-950 border-y border-white/5">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-16 text-white">Why Mallah is Different</h2>
            <div className="grid md:grid-cols-2 gap-px bg-white/10 border border-white/10 rounded-2xl overflow-hidden">
              <div className="bg-zinc-950 p-10">
                <h4 className="text-lg font-bold text-muted-foreground mb-6 uppercase tracking-wider">Generic Platforms</h4>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3 text-muted-foreground/60"><ArrowRight className="h-4 w-4 rotate-180" /> Focus on content volume</li>
                  <li className="flex items-center gap-3 text-muted-foreground/60"><ArrowRight className="h-4 w-4 rotate-180" /> Generic "one-size-fits-all" tutorials</li>
                  <li className="flex items-center gap-3 text-muted-foreground/60"><ArrowRight className="h-4 w-4 rotate-180" /> Certificates without validation</li>
                  <li className="flex items-center gap-3 text-muted-foreground/60"><ArrowRight className="h-4 w-4 rotate-180" /> Passive consumption of information</li>
                </ul>
              </div>
              <div className="bg-zinc-900/50 p-10 relative">
                <div className="absolute top-0 right-0 p-4"><Badge className="bg-emerald-600">The Mallah Way</Badge></div>
                <h4 className="text-lg font-bold text-white mb-6 uppercase tracking-wider">Mallah Platform</h4>
                <ul className="space-y-4 text-white/90 font-medium">
                  <li className="flex items-center gap-3"><ArrowRight className="h-4 w-4 text-emerald-500" /> Focus on career readiness outcomes</li>
                  <li className="flex items-center gap-3"><ArrowRight className="h-4 w-4 text-emerald-500" /> Role-specific specialized paths</li>
                  <li className="flex items-center gap-3"><ArrowRight className="h-4 w-4 text-emerald-500" /> Evidence-based skill verification</li>
                  <li className="flex items-center gap-3"><ArrowRight className="h-4 w-4 text-emerald-500" /> Active preparation for job markets</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Who It's For */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-16 text-white">Built for the Next Generation of Tech</h2>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="flex flex-col items-center">
                <div className="h-16 w-16 rounded-full glass flex items-center justify-center mb-6">
                  <GraduationCap className="h-8 w-8 text-emerald-500" />
                </div>
                <h4 className="text-xl font-bold text-white mb-2">CS/IT Students</h4>
                <p className="text-muted-foreground text-sm px-4">Bridge the gap between your university degree and the fast-moving tech market requirements.</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="h-16 w-16 rounded-full glass flex items-center justify-center mb-6">
                  <Briefcase className="h-8 w-8 text-purple-500" />
                </div>
                <h4 className="text-xl font-bold text-white mb-2">Fresh Graduates</h4>
                <p className="text-muted-foreground text-sm px-4">Structure your first 6 months post-grad to land a competitive junior role at top firms.</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="h-16 w-16 rounded-full glass flex items-center justify-center mb-6">
                  <Rocket className="h-8 w-8 text-blue-500" />
                </div>
                <h4 className="text-xl font-bold text-white mb-2">Career Switchers</h4>
                <p className="text-muted-foreground text-sm px-4">Direct, focused learning that skips the fluff and gets you ready for your new technical field fast.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Outcome-Focused Section */}
        <section id="outcomes" className="py-24 bg-gradient-to-b from-transparent to-emerald-500/5">
          <div className="container mx-auto px-4 max-w-4xl">
            <Card className="glass border-emerald-500/20 p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-6">The Outcome: Total Readiness</h2>
                  <p className="text-muted-foreground mb-8">When you complete your Mallah journey, you don't just leave with knowledge. You leave with a professional identity.</p>
                  <div className="space-y-4">
                    {["Clarity and Direction", "A Verified Portfolio", "ATS-Optimized Resume", "Skill Market Awareness"].map(item => (
                      <div key={item} className="flex items-center gap-3 text-white/80">
                        <ShieldCheck className="h-5 w-5 text-emerald-500" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 bg-emerald-500/20 blur-[60px]" />
                  <div className="relative h-64 rounded-xl border border-white/10 glass bg-white/5 p-6 overflow-hidden">
                    <div className="space-y-4 animate-pulse">
                      <div className="h-2 w-full bg-white/10 rounded" />
                      <div className="h-2 w-3/4 bg-white/10 rounded" />
                      <div className="h-2 w-full bg-white/10 rounded" />
                      <div className="mt-8 border-t border-white/10 pt-4">
                        <div className="h-4 w-1/2 bg-emerald-500/20 rounded mb-2" />
                        <div className="h-10 w-full bg-white/5 rounded" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-32 relative overflow-hidden">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-[400px] w-[800px] bg-emerald-500/10 blur-[100px] rounded-full" />
           <div className="container mx-auto px-4 text-center">
             <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">Your preparation starts now.</h2>
             <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
               Stop consuming and start preparing. Join Mallah today and build the specialized technical profile for the career you want.
             </p>
             <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" className="h-14 px-10 bg-emerald-600 hover:bg-emerald-500 text-white text-lg shadow-[0_0_30px_rgba(16,185,129,0.4)]">
                  Start Your Career Path
                </Button>
                <Button variant="outline" size="lg" className="h-14 px-10 glass border-white/10 text-lg">
                  Learn More
                </Button>
             </div>
           </div>
        </section>
      </main>

      <footer className="py-12 border-t border-white/5">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-gradient-to-br from-emerald-500 to-purple-600" />
            <span className="text-lg font-bold text-white">Mallah</span>
          </div>
          <div className="flex gap-8 text-sm text-muted-foreground">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 Mallah. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

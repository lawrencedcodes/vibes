import { Book, Users, LineChart } from 'lucide-react';

export default function Home() {
  return (
    <div className="py-12">
      <section className="max-w-5xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
          Empowering Your Journey Into Tech
        </h1>
        <p className="text-xl mb-8 text-muted-foreground">
          Clear, actionable pathways into technology careers for individuals with diverse backgrounds
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium">
            Start Your Journey
          </button>
          <button className="px-6 py-3 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors font-medium">
            Explore Career Paths
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
          <div className="mb-4 text-primary">
            <Book className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Personalized Learning</h3>
          <p className="text-muted-foreground">Tailored career recommendations and step-by-step learning plans based on your unique interests and strengths.</p>
        </div>
        
        <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
          <div className="mb-4 text-primary">
            <Users className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Community Support</h3>
          <p className="text-muted-foreground">Connect with peers, mentors, and industry professionals to share experiences and get guidance.</p>
        </div>
        
        <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
          <div className="mb-4 text-primary">
            <LineChart className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Career Tracking</h3>
          <p className="text-muted-foreground">Track your progress, celebrate milestones, and stay motivated throughout your tech career journey.</p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto mb-16">
        <h2 className="text-3xl font-bold mb-6 text-center">How It Works</h2>
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="bg-primary/10 rounded-full p-4 flex items-center justify-center w-16 h-16 shrink-0">
              <span className="text-primary text-xl font-bold text-4xl">1</span>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Discover Your Interests</h3>
              <p className="text-muted-foreground">Complete interactive questionnaires to identify your areas of interest within technology and assess your existing skills.</p>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="bg-primary/10 rounded-full p-4 flex items-center justify-center w-16 h-16 shrink-0">
              <span className="text-primary text-xl font-bold text-4xl">2</span>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Get Personalized Recommendations</h3>
              <p className="text-muted-foreground">Receive tailored tech career recommendations based on your interests, strengths, and preferences.</p>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="bg-primary/10 rounded-full p-4 flex items-center justify-center w-16 h-16 shrink-0">
              <span className="text-primary text-xl font-bold text-4xl">3</span>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Follow Your Learning Plan</h3>
              <p className="text-muted-foreground">Access a structured, step-by-step learning plan with realistic timelines and curated resources.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-card p-8 rounded-xl border border-border mb-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Tech Career?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">Take the first step towards your new career in technology. Our personalized guidance will help you navigate your path with confidence.</p>
        </div>
        <div className="flex justify-center">
          <button className="px-8 py-4 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium text-lg">
            Begin Your Assessment
          </button>
        </div>
      </section>
    </div>
  );
}

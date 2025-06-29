import { ThemeToggle } from '@/components/ThemeToggle';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
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
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Personalized Learning</h3>
          <p className="text-muted-foreground">Tailored career recommendations and step-by-step learning plans based on your unique interests and strengths.</p>
        </div>
        
        <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
          <div className="mb-4 text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Community Support</h3>
          <p className="text-muted-foreground">Connect with peers, mentors, and industry professionals to share experiences and get guidance.</p>
        </div>
        
        <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
          <div className="mb-4 text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605" />
            </svg>
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
              <span className="text-primary text-xl font-bold">1</span>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Discover Your Interests</h3>
              <p className="text-muted-foreground">Complete interactive questionnaires to identify your areas of interest within technology and assess your existing skills.</p>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="bg-primary/10 rounded-full p-4 flex items-center justify-center w-16 h-16 shrink-0">
              <span className="text-primary text-xl font-bold">2</span>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Get Personalized Recommendations</h3>
              <p className="text-muted-foreground">Receive tailored tech career recommendations based on your interests, strengths, and preferences.</p>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="bg-primary/10 rounded-full p-4 flex items-center justify-center w-16 h-16 shrink-0">
              <span className="text-primary text-xl font-bold">3</span>
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

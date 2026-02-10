import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', textAlign: 'center' }}>
      <h1 className="text-4xl font-bold mb-6 text-primary">Master SaaS Principles</h1>
      <p className="text-xl mb-8 max-w-2xl text-secondary-foreground">
        A comprehensive, interactive guide to understanding the architecture, business models, and strategies behind successful Software as a Service.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 text-left w-full max-w-4xl" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', width: '100%' }}>
        <div className="p-6 border rounded-lg bg-card" style={{ border: '1px solid var(--color-border)', borderRadius: '0.5rem', padding: '1.5rem' }}>
          <h3 className="text-lg font-semibold mb-2">Business Models</h3>
          <p className="text-sm text-secondary-foreground">Understand recurring revenue, churn, and pricing strategies.</p>
        </div>
        <div className="p-6 border rounded-lg bg-card" style={{ border: '1px solid var(--color-border)', borderRadius: '0.5rem', padding: '1.5rem' }}>
          <h3 className="text-lg font-semibold mb-2">Architecture</h3>
          <p className="text-sm text-secondary-foreground">Deep dive into multitenancy, isolation, and control planes.</p>
        </div>
        <div className="p-6 border rounded-lg bg-card" style={{ border: '1px solid var(--color-border)', borderRadius: '0.5rem', padding: '1.5rem' }}>
          <h3 className="text-lg font-semibold mb-2">Service Levels</h3>
          <p className="text-sm text-secondary-foreground">Learn about SLAs, SLOs, and maintaining high availability.</p>
        </div>
      </div>

      <Link
        href="/modules/intro"
        className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary-hover transition-colors"
        style={{
          backgroundColor: 'var(--color-primary)',
          color: 'white',
          borderRadius: '9999px',
          padding: '0.75rem 1.5rem',
          fontWeight: 500,
          boxShadow: '0 4px 14px 0 rgba(0,118,255,0.39)',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}
      >
        Start Course <ArrowRight size={18} />
      </Link>
    </div>
  );
}

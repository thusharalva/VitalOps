import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-emerald-600 to-teal-700"></div>
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      
      {/* Floating Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-300/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>

      <div className="relative flex min-h-screen flex-col items-center justify-center p-8">
        <div className="text-center max-w-5xl">
          {/* Logo */}
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-white/20 backdrop-blur-lg shadow-2xl mb-8 animate-scale-in">
            <span className="text-7xl">🏥</span>
          </div>

          {/* Title */}
          <h1 className="text-7xl md:text-8xl font-black text-white mb-6 drop-shadow-2xl animate-fade-in">
            VitalOps
          </h1>
          
          <p className="text-2xl md:text-3xl text-primary-100 font-semibold mb-4 drop-shadow-lg animate-slide-up">
            Medical Equipment Rental Management
          </p>
          
          <p className="text-lg text-primary-50 mb-12 max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{animationDelay: '0.2s'}}>
            Complete solution for asset tracking, rental management, service jobs,
            and sleep study operations — All in one powerful platform
          </p>

          {/* CTA Buttons */}
          <div className="flex gap-6 justify-center mb-16 animate-slide-up" style={{animationDelay: '0.4s'}}>
            <Link
              href="/login"
              className="group px-10 py-5 bg-white text-primary-700 rounded-2xl hover:bg-primary-50 transition-all duration-300 font-bold text-lg shadow-2xl hover:shadow-glow transform hover:scale-105"
            >
              <span className="flex items-center gap-2">
                Login
                <span className="transform group-hover:translate-x-1 transition-transform">→</span>
              </span>
            </Link>
            <Link
              href="/register"
              className="px-10 py-5 bg-white/10 backdrop-blur-md text-white border-2 border-white/30 rounded-2xl hover:bg-white/20 transition-all duration-300 font-bold text-lg shadow-2xl transform hover:scale-105"
            >
              Register
            </Link>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto animate-fade-in" style={{animationDelay: '0.6s'}}>
            <FeatureCard icon="📦" title="Assets" subtitle="Track & manage" />
            <FeatureCard icon="🔑" title="Rentals" subtitle="Monthly billing" />
            <FeatureCard icon="😴" title="Sleep Studies" subtitle="Patient care" />
            <FeatureCard icon="💰" title="Billing" subtitle="Invoices & UPI" />
          </div>
        </div>
      </div>

      <style jsx>{`
        .bg-grid-pattern {
          background-image: 
            linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px);
          background-size: 60px 60px;
        }
      `}</style>
    </main>
  );
}

function FeatureCard({ icon, title, subtitle }: { icon: string; title: string; subtitle: string }) {
  return (
    <div className="group glass-card rounded-2xl p-6 text-center card-hover border-2 border-white/20">
      <div className="text-5xl mb-3 transform group-hover:scale-125 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="font-bold text-white text-lg mb-1">{title}</h3>
      <p className="text-primary-100 text-sm">{subtitle}</p>
    </div>
  );
}

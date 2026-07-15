export default function Footer() {
  return (
    <footer className="w-full py-8 px-6 md:px-10 flex flex-col md:flex-row justify-between items-center gap-4 bg-white border-t border-[#c2c8c5]/25 mt-auto">
      <div className="flex flex-col items-center md:items-start gap-1">
        <span className="text-xl font-bold tracking-tight text-[#051916]">RenoLens</span>
        <p className="text-[10px] text-gray-400 font-medium tracking-wide">
          &copy; 2026 RenoLens Architectural Intelligence. All rights reserved.
        </p>
      </div>

      <nav className="flex items-center gap-6 text-xs font-bold text-gray-400">
        <a href="#" className="hover:text-[#051916] transition-colors underline decoration-solid decoration-[#009bdc]/30 underline-offset-4">Privacy Policy</a>
        <a href="#" className="hover:text-[#051916] transition-colors underline decoration-solid decoration-[#009bdc]/30 underline-offset-4">Terms of Service</a>
        <a href="#" className="hover:text-[#051916] transition-colors underline decoration-solid decoration-[#009bdc]/30 underline-offset-4">Documentation</a>
        <a href="#" className="hover:text-[#051916] transition-colors underline decoration-solid decoration-[#009bdc]/30 underline-offset-4">Support</a>
      </nav>
    </footer>
  );
}

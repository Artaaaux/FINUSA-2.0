export default function HelpPage() {
  return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="text-center space-y-3">
        <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto">
          <span className="text-blue-400 text-xl font-bold">?</span>
        </div>
        <h1 className="text-xl font-bold text-white">Bantuan</h1>
        <p className="text-sm text-slate-500">Fitur ini sedang dalam pengembangan.</p>
      </div>
    </div>
  );
}

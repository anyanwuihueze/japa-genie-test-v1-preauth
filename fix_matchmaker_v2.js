const fs = require('fs');
const content = fs.readFileSync('src/app/visa-matchmaker/page.tsx', 'utf8');

// Find and replace the exact CTA section
const fixedContent = content.replace(
  /{\/\* Hidden Matches Teaser \*\/}[^]*?className="text-sm text-purple-200">[^]*?<\/button>[^]*?<\/div>/,
  `        {/* Hidden Matches Teaser - MOVED TO BOTTOM */}
        {!isPremium && hiddenMatchesCount > 0 && (
          <div className="bg-gradient-to-r from-purple-500 to-blue-600 rounded-2xl p-8 text-white text-center mt-8">
            <Lock className="w-16 h-16 mx-auto mb-4 opacity-80" />
            <h3 className="text-2xl font-bold mb-2">
              🔒 Unlock {hiddenMatchesCount} More Premium Matches
            </h3>
            <p className="text-purple-100 mb-6 max-w-md mx-auto">
              Get detailed analysis, personalized timelines, and expert strategies for all your matches
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
              <div className="bg-white/20 rounded-lg p-4">
                <div className="text-lg font-semibold">Full Analysis</div>
                <div className="text-purple-100 text-sm">Detailed requirements & costs</div>
              </div>
              <div className="bg-white/20 rounded-lg p-4">
                <div className="text-lg font-semibold">Timeline</div>
                <div className="text-purple-100 text-sm">Month-by-month plan</div>
              </div>
              <div className="bg-white/20 rounded-lg p-4">
                <div className="text-lg font-semibold">Strategy</div>
                <div className="text-purple-100 text-sm">Avoid common mistakes</div>
              </div>
            </div>
            <button 
              onClick={() => setShowUpgradeModal(true)}
              className="bg-white text-purple-600 px-8 py-4 rounded-xl font-bold hover:shadow-lg transition-all mb-4"
            >
              Upgrade to See All Matches
            </button>
            <div className="text-sm text-purple-200">
              Already premium? <button onClick={() => setIsPremium(true)} className="underline font-semibold">Restore access</button>
            </div>
          </div>
        )}`
);

fs.writeFileSync('src/app/visa-matchmaker/page.tsx', fixedContent);
console.log('✅ Fixed: Moved CTA to bottom with mt-8 margin');

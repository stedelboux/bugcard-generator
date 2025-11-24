import React, { useState } from 'react';
import { generateBugPersona, generateBugImage } from './services/geminiService';
import { BugPersona } from './types';
import BugCard from './components/BugCard';
import { Sparkles, Bug, Cpu, Share2 } from 'lucide-react';

const App: React.FC = () => {
  const [words, setWords] = useState<string[]>(['', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [persona, setPersona] = useState<BugPersona | null>(null);
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [step, setStep] = useState<number>(0); // 0: input, 1: generating text, 2: generating image, 3: done

  const handleInputChange = (index: number, value: string) => {
    const newWords = [...words];
    newWords[index] = value;
    setWords(newWords);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (words.some(w => !w.trim())) return;

    setLoading(true);
    setError(null);
    setStep(1);

    try {
      // 1. Generate Persona Text
      const generatedPersona = await generateBugPersona(words);
      setPersona(generatedPersona);
      setStep(2);

      // 2. Generate Image based on persona description
      try {
        const generatedImage = await generateBugImage(generatedPersona.aparenciaDescricao);
        setImageUrl(generatedImage);
      } catch (imgErr) {
        console.error("Image generation failed", imgErr);
        // We continue even if image fails, showing a placeholder in BugCard
      }
      
      setStep(3);
    } catch (err) {
      setError("Ops! O servidor caiu na daily. Tente novamente.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setWords(['', '', '']);
    setPersona(null);
    setImageUrl(undefined);
    setStep(0);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-bug-bg text-bug-text flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="scanline"></div>
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#444 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
      </div>

      <header className="mb-8 text-center z-10">
        <div className="inline-block border-2 border-bug-tertiary p-2 mb-4 hover:rotate-1 transition-transform cursor-default">
          <h1 className="text-4xl md:text-6xl font-pixel text-bug-tertiary bg-bug-bg px-4 glitch-effect" style={{ textShadow: '2px 2px 0px #000' }}>
             BUG <span className="text-white">PERSONA</span>
          </h1>
        </div>
        <p className="font-mono text-sm md:text-base text-bug-secondary uppercase tracking-widest mt-2">
          UX/UI Mood Test // v1.0.4-beta
        </p>
      </header>

      <main className="w-full max-w-4xl z-10 relative">
        {step === 0 && (
          <form onSubmit={handleSubmit} className="bg-opacity-20 bg-black backdrop-blur-sm p-8 rounded-xl border border-gray-800 shadow-2xl animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Como está o produto hoje?</h2>
              <p className="text-gray-400 text-sm">Digite 3 palavras que definem o vibe do time/projeto.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {words.map((word, index) => (
                <div key={index} className="relative group">
                  <span className="absolute -top-3 left-4 bg-bug-bg text-bug-primary text-xs px-2 font-mono border border-bug-primary">
                    WORD_0{index + 1}
                  </span>
                  <input
                    type="text"
                    maxLength={20}
                    value={word}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    placeholder={["Caos", "Prazo", "Café"][index]}
                    className="w-full bg-gray-900 border-2 border-gray-700 text-white p-4 text-lg font-mono focus:border-bug-primary focus:outline-none transition-colors rounded-none placeholder-gray-700"
                    required
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                disabled={loading || words.some(w => !w.trim())}
                className="bg-bug-secondary hover:bg-bug-tertiary disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-12 text-xl font-pixel retro-shadow transition-transform active:translate-y-1 active:shadow-none flex items-center gap-3"
              >
                {loading ? 'COMPILANDO...' : 'GERAR MEU BUG'} <Cpu />
              </button>
            </div>
          </form>
        )}

        {(step === 1 || step === 2) && (
          <div className="text-center p-12 bg-gray-900 rounded-lg border border-gray-800 shadow-xl">
             <div className="flex justify-center mb-6">
                <Bug className="animate-spin text-bug-primary w-16 h-16" />
             </div>
             <h2 className="text-2xl font-pixel text-white mb-2 animate-pulse">
               {step === 1 ? 'ANALISANDO JIRA...' : 'RENDERIZANDO PIXELS...'}
             </h2>
             <p className="font-mono text-bug-text text-sm">
               {step === 1 ? 'Traduzindo o caos em dados estruturados.' : 'O designer está ajustando o padding.'}
             </p>
          </div>
        )}

        {step === 3 && persona && (
          <BugCard data={persona} imageUrl={imageUrl} onReset={handleReset} />
        )}

        {error && (
          <div className="mt-8 p-4 bg-red-900/50 border border-red-500 text-red-200 text-center font-mono rounded">
            {error}
            <button onClick={() => setError(null)} className="block mx-auto mt-2 underline text-sm">Tentar de novo</button>
          </div>
        )}
      </main>

      <footer className="mt-12 text-center text-gray-600 text-xs font-mono z-10">
        <p>Feito por um dev que deveria estar corrigindo bugs.</p>
        <p className="opacity-50 mt-1">Powered by Gemini 2.5</p>
      </footer>
    </div>
  );
};

export default App;
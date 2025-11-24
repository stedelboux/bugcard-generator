import React, { useRef } from 'react';
import { BugPersona } from '../types';
import { Activity, Bandage, Zap, Twitter, Linkedin, Download, Camera, Hash } from 'lucide-react';
import html2canvas from 'html2canvas';

interface BugCardProps {
  data: BugPersona;
  imageUrl?: string;
  onReset: () => void;
}

const BugCard: React.FC<BugCardProps> = ({ data, imageUrl, onReset }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = `Meu mood de produto hoje virou um Bug: ${data.nome} (${data.tipo})! 🐛\n\n${data.comportamento}\n\nDescubra o seu personagem de design:`;

  const twitterLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(currentUrl)}`;
  const linkedinLink = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(shareText + ' ' + currentUrl)}`;

  const handleDownload = async () => {
    if (!cardRef.current) return;
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#0f0e17',
        scale: 2, // 2x resolution for retina/high quality
        logging: false,
        useCORS: true,
      });
      
      const image = canvas.toDataURL("image/png");
      const link = document.createElement('a');
      link.href = image;
      link.download = `bug-persona-${data.nome.replace(/\s+/g, '-').toLowerCase()}.png`;
      link.click();
    } catch (error) {
      console.error("Erro ao gerar imagem do card:", error);
      alert("Não foi possível salvar a imagem. Tente tirar um print!");
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-6 animate-fade-in-up pb-12">
      
      {/* --- AREA DE CAPTURA (CARD) --- */}
      <div 
        ref={cardRef}
        className="relative w-full max-w-md bg-bug-bg rounded-xl overflow-hidden border-4 border-gray-800 shadow-2xl flex flex-col"
      >
        {/* [HEADER] Nome e Tipo */}
        <div className="bg-bug-tertiary p-4 border-b-4 border-gray-900 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2 opacity-20">
             <Hash size={60} className="text-black rotate-12" />
          </div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-1">
              <span className="bg-black text-bug-primary text-xs font-mono px-2 py-0.5 rounded border border-bug-primary uppercase tracking-widest">
                {data.tipo}
              </span>
              <div className="flex gap-1">
                 <div className="w-2 h-2 rounded-full bg-red-500 border border-black"></div>
                 <div className="w-2 h-2 rounded-full bg-yellow-400 border border-black"></div>
              </div>
            </div>
            <h2 className="text-3xl font-pixel text-white leading-none uppercase tracking-wide drop-shadow-md">
              {data.nome}
            </h2>
          </div>
        </div>

        {/* [IMAGEM PRINCIPAL] 1:1 Aspect Ratio */}
        <div className="relative w-full aspect-square bg-gray-800 border-b-4 border-gray-900 group">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={data.nome} 
              className="w-full h-full object-cover rendering-pixelated" 
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 text-gray-600 font-pixel">
              <span className="animate-pulse text-2xl">NO SIGNAL</span>
            </div>
          )}
           
           {/* Log Sticker Overlay */}
           <div className="absolute bottom-4 left-4 max-w-[80%] transform -rotate-2">
             <div className="bg-yellow-300 text-black font-mono text-xs px-2 py-1 border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,0.5)] truncate">
               {`> ${data.logMessage}`}
             </div>
           </div>
        </div>

        {/* [DESCRIÇÃO] Texto curto */}
        <div className="p-5 bg-bug-card text-gray-900 border-b-2 border-gray-200">
           <p className="font-mono text-sm leading-relaxed font-medium">
             "{data.comportamento}"
           </p>
        </div>

        {/* [INFO RÁPIDA – GRID 2 COLUNAS] */}
        <div className="grid grid-cols-2 bg-gray-100 divide-x-2 divide-gray-200 border-b-4 border-gray-900">
          <div className="p-4 flex flex-col gap-1">
            <h3 className="font-bold text-red-600 text-[10px] uppercase tracking-wider flex items-center gap-1">
              <Activity size={12} /> Impacto
            </h3>
            <p className="text-xs font-mono text-gray-800 leading-tight">
              {data.impactoTime}
            </p>
          </div>
          <div className="p-4 flex flex-col gap-1 bg-blue-50/50">
            <h3 className="font-bold text-blue-600 text-[10px] uppercase tracking-wider flex items-center gap-1">
              <Bandage size={12} /> Patch
            </h3>
            <p className="text-xs font-mono text-gray-800 leading-tight">
              {data.patchTemporario}
            </p>
          </div>
        </div>

        {/* [FOOTER] Assinatura e Branding */}
        <div className="bg-gray-900 p-3 flex justify-between items-center text-gray-500 font-pixel text-lg">
          <span className="uppercase text-bug-text text-sm">SEV: {data.severidade}</span>
          <span className="text-bug-primary flex items-center gap-1 text-sm">
            DESIGN BUG PERSONA
          </span>
        </div>
      </div>

      {/* --- AÇÕES (FORA DO CARD) --- */}
      <div className="w-full max-w-md space-y-3">
        {/* Share Social */}
        <div className="grid grid-cols-2 gap-3">
           <a 
             href={twitterLink} 
             target="_blank" 
             rel="noopener noreferrer"
             className="flex items-center justify-center gap-2 bg-black text-white py-3 px-4 rounded text-xs font-bold uppercase hover:bg-gray-800 transition-colors border border-gray-700"
           >
             <Twitter size={16} /> Twitter
           </a>
           <a 
             href={linkedinLink} 
             target="_blank" 
             rel="noopener noreferrer"
             className="flex items-center justify-center gap-2 bg-[#0077b5] text-white py-3 px-4 rounded text-xs font-bold uppercase hover:bg-[#005e93] transition-colors border border-[#005e93]"
           >
             <Linkedin size={16} /> LinkedIn
           </a>
        </div>

        {/* Main Actions */}
        <div className="flex gap-3">
          <button 
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded border-b-4 border-black active:border-b-0 active:translate-y-1 transition-all font-pixel text-lg"
          >
            <Camera size={18} />
            SALVAR
          </button>
          <button 
            onClick={onReset}
            className="flex-1 flex items-center justify-center gap-2 bg-bug-primary hover:bg-orange-600 text-white font-bold py-3 px-4 rounded border-b-4 border-orange-800 active:border-b-0 active:translate-y-1 transition-all font-pixel text-lg"
          >
            <Zap size={18} />
            NOVO
          </button>
        </div>
      </div>
    </div>
  );
};

export default BugCard;
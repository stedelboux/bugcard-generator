export interface BugPersona {
  nome: string;
  tipo: string;
  comportamento: string;
  causaRaiz: string;
  impactoTime: string;
  patchTemporario: string;
  severidade: number;
  logMessage: string;
  aparenciaDescricao: string;
}

export interface GeneratedContent {
  persona: BugPersona;
  imageUrl?: string;
}
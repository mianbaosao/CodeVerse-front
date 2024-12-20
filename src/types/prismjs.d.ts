declare module 'prismjs' {
  const Prism: {
    highlightAll: () => void;
    highlight: (text: string, grammar: any, language: string) => string;
  };
  export default Prism;
} 
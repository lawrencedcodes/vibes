/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { InputForm } from './components/InputForm';
import { AnalysisView } from './components/AnalysisView';
import { ContentTabs } from './components/ContentTabs';
import { analyzeAndGenerate } from './lib/gemini';
import { motion } from 'motion/react';

interface AppState {
  status: 'idle' | 'loading' | 'success' | 'error';
  data: any | null;
  error: string | null;
}

export default function App() {
  const [state, setState] = useState<AppState>({
    status: 'idle',
    data: null,
    error: null,
  });

  const handleAnalyze = async (content: string, type: 'url' | 'text') => {
    setState({ status: 'loading', data: null, error: null });
    try {
      const result = await analyzeAndGenerate(content, type);
      setState({ status: 'success', data: result, error: null });
    } catch (err: any) {
      console.error(err);
      setState({ status: 'error', data: null, error: err.message || 'Something went wrong' });
    }
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            Turn Code into Content
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Generate high-quality, technically accurate distribution kits from your READMEs, blogs, or raw code.
          </p>
        </div>

        <InputForm onAnalyze={handleAnalyze} isLoading={state.status === 'loading'} />

        {state.status === 'error' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-center font-mono text-sm"
          >
            Error: {state.error}
          </motion.div>
        )}

        {state.status === 'success' && state.data && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-16"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px bg-zinc-800 flex-1" />
              <span className="text-zinc-500 font-mono text-xs uppercase tracking-widest">Analysis Complete</span>
              <div className="h-px bg-zinc-800 flex-1" />
            </div>

            <AnalysisView analysis={state.data.analysis} />
            
            <div className="flex items-center gap-4 mb-8 mt-12">
              <div className="h-px bg-zinc-800 flex-1" />
              <span className="text-zinc-500 font-mono text-xs uppercase tracking-widest">Generated Assets</span>
              <div className="h-px bg-zinc-800 flex-1" />
            </div>

            <ContentTabs assets={state.data.assets} />
          </motion.div>
        )}
      </div>
    </Layout>
  );
}


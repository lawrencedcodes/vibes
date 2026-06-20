'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Flex, Grid } from '@/components/ui/Layout';
import { ProgressBar, Badge } from '@/components/ui/Feedback';
import { Button } from '@/components/ui/Button';
import { CheckCircle, AlertCircle, BookOpen, ExternalLink, PlayCircle, Layers, Check } from 'lucide-react';
import { MicroResource } from '@/lib/skillGapAnalyzer';

interface SkillGapData {
  careerId: string;
  careerTitle: string;
  acquired: string[];
  missing: string[];
  microResources: Record<string, MicroResource[]>;
}

export default function SkillGapAnalyzer() {
  const [careerId, setCareerId] = useState<string>('frontend_developer');
  const [data, setData] = useState<SkillGapData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<Record<string, boolean>>({});

  const careerOptions = [
    { id: 'frontend_developer', name: 'Frontend Developer' },
    { id: 'data_analyst', name: 'Data Analyst' },
    { id: 'ux_designer', name: 'UX Designer' },
    { id: 'cybersecurity_analyst', name: 'Cybersecurity Analyst' },
    { id: 'mobile_developer', name: 'Mobile Developer' },
    { id: 'data_scientist', name: 'Data Scientist' },
    { id: 'devops_engineer', name: 'DevOps Engineer' }
  ];

  const fetchAnalysis = async (id: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/skills/gap-analysis?careerId=${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch gap analysis');
      }
      const result = await response.json();
      setData(result);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalysis(careerId);
  }, [careerId]);

  const toggleSkill = async (skillName: string, acquired: boolean) => {
    setSubmitting(prev => ({ ...prev, [skillName]: true }));
    try {
      const response = await fetch('/api/skills/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skillName, acquired })
      });
      if (!response.ok) {
        throw new Error('Failed to update skill status');
      }
      // Re-fetch analysis to calculate updated gaps
      await fetchAnalysis(careerId);
    } catch (err) {
      console.error('Error toggling skill:', err);
    } finally {
      setSubmitting(prev => ({ ...prev, [skillName]: false }));
    }
  };

  if (loading && !data) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Card variant="bordered" className="border-destructive/20 bg-destructive/5 p-6 mb-8 text-center">
        <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-destructive mb-2">Error Loading Analysis</h3>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button variant="primary" onClick={() => fetchAnalysis(careerId)}>Retry</Button>
      </Card>
    );
  }

  const totalSkills = (data?.acquired.length || 0) + (data?.missing.length || 0);
  const alignmentPercent = totalSkills > 0 ? Math.round(((data?.acquired.length || 0) / totalSkills) * 100) : 0;

  return (
    <div className="space-y-8">
      <Card variant="elevated">
        <CardHeader>
          <Flex justify="between" align="center" direction="col" mdDirection="row" className="gap-4">
            <div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent flex items-center gap-2">
                <Layers className="w-6 h-6 text-primary" />
                Dynamic Skill Gap Analyzer
              </CardTitle>
              <CardDescription>
                Compare your current skills directly with tech industry requirements and find quick-win resources.
              </CardDescription>
            </div>
            
            {/* Career Selector Dropdown */}
            <div className="w-full md:w-auto">
              <label htmlFor="career-select" className="sr-only">Select Career Path</label>
              <select
                id="career-select"
                value={careerId}
                onChange={(e) => setCareerId(e.target.value)}
                className="w-full md:w-64 px-4 py-2 rounded-lg border border-border bg-background text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {careerOptions.map(option => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>
          </Flex>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Progress / Alignment Summary */}
          <div className="p-5 bg-secondary/10 rounded-xl border border-border/40">
            <Flex justify="between" align="center" className="mb-2">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                Your Alignment with <span className="text-primary">{data?.careerTitle}</span>
              </h3>
              <Badge variant={alignmentPercent === 100 ? 'success' : 'primary'} size="md">
                {alignmentPercent}% Aligned
              </Badge>
            </Flex>
            <ProgressBar value={alignmentPercent} showLabel={false} color={alignmentPercent === 100 ? 'success' : 'primary'} />
            <p className="text-sm text-muted-foreground mt-3">
              {alignmentPercent === 100 
                ? 'Excellent work! You possess all the core required skills for this career path.' 
                : `You currently have ${data?.acquired.length} of the ${totalSkills} core skills required. Toggle your skills below to update your personalized list in real-time.`}
            </p>
          </div>

          <Grid cols={1} mdCols={2} gap="lg">
            {/* Left Col: Interactive Checklist */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold flex items-center gap-2 border-b border-border pb-2">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
                Your Core Skills Checklist
              </h3>
              
              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                {/* Acquired Skills */}
                {data?.acquired.map(skill => (
                  <div 
                    key={skill} 
                    className="flex items-center justify-between p-3.5 bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/10 rounded-xl transition-all duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-medium text-foreground">{skill}</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 px-2.5 h-8 text-xs font-semibold"
                      disabled={submitting[skill]}
                      onClick={() => toggleSkill(skill, false)}
                    >
                      {submitting[skill] ? 'Updating...' : 'Mark Unacquired'}
                    </Button>
                  </div>
                ))}

                {/* Missing Skills */}
                {data?.missing.map(skill => (
                  <div 
                    key={skill} 
                    className="flex items-center justify-between p-3.5 bg-secondary/10 hover:bg-secondary/20 border border-border/40 rounded-xl transition-all duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30 flex items-center justify-center shrink-0" />
                      <span className="font-medium text-muted-foreground">{skill}</span>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-primary/30 text-primary hover:bg-primary/10 px-2.5 h-8 text-xs font-semibold"
                      disabled={submitting[skill]}
                      onClick={() => toggleSkill(skill, true)}
                    >
                      {submitting[skill] ? 'Updating...' : 'Mark Acquired'}
                    </Button>
                  </div>
                ))}

                {totalSkills === 0 && (
                  <p className="text-muted-foreground text-center py-6">No core skills found for this career path.</p>
                )}
              </div>
            </div>

            {/* Right Col: Recommendations & Micro-Resources */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold flex items-center gap-2 border-b border-border pb-2">
                <BookOpen className="w-5 h-5 text-primary" />
                Targeted "Quick-Wins"
              </h3>

              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {data?.missing && data.missing.length > 0 ? (
                  data.missing.map(skill => {
                    const resources = data.microResources[skill] || [];
                    return (
                      <div key={skill} className="space-y-2 bg-secondary/5 border border-border/40 p-4 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold text-base text-foreground flex items-center gap-2">
                            <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-500" />
                            To Learn: {skill}
                          </h4>
                          <Badge variant="warning" size="sm">Skill Gap</Badge>
                        </div>
                        <div className="space-y-2">
                          {resources.map(res => (
                            <a
                              key={res.id}
                              href={res.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block p-3 bg-card hover:bg-primary/5 hover:border-primary/20 border border-border rounded-lg transition-all duration-200 group"
                            >
                              <Flex justify="between" align="center" className="gap-2">
                                <div className="space-y-1">
                                  <p className="font-semibold text-sm text-card-foreground group-hover:text-primary transition-colors flex items-center gap-1.5">
                                    {res.type === 'video' ? <PlayCircle className="w-4 h-4 text-primary shrink-0" /> : <BookOpen className="w-4 h-4 text-purple-500 shrink-0" />}
                                    {res.title}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {res.provider} &bull; {res.duration} &bull; <span className="capitalize">{res.cost}</span>
                                  </p>
                                </div>
                                <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary shrink-0 transition-colors" />
                              </Flex>
                            </a>
                          ))}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <Card variant="bordered" className="bg-emerald-500/5 border-emerald-500/20 text-center p-6">
                    <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                    <h4 className="font-semibold text-emerald-600 mb-1">Zero Skill Gaps!</h4>
                    <p className="text-sm text-muted-foreground">
                      You are 100% aligned with this career path. Ready to start exploring job postings!
                    </p>
                  </Card>
                )}
              </div>
            </div>
          </Grid>
        </CardContent>
      </Card>
    </div>
  );
}

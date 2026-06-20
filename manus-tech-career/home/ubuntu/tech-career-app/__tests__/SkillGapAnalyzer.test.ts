import { SkillGapAnalyzer } from '@/lib/skillGapAnalyzer';

describe('SkillGapAnalyzer Engine', () => {
  const requiredSkills = ['HTML', 'CSS', 'JavaScript', 'React', 'Responsive Design'];

  it('correctly calculates gap and acquired skills', () => {
    const acquiredSkills = ['HTML', 'CSS'];
    const analysis = SkillGapAnalyzer.analyze(requiredSkills, acquiredSkills);

    expect(analysis.acquired).toEqual(['HTML', 'CSS']);
    expect(analysis.missing).toEqual(['JavaScript', 'React', 'Responsive Design']);
  });

  it('correctly assigns quick-win resources for missing skills', () => {
    const acquiredSkills = ['HTML', 'CSS', 'JavaScript'];
    const analysis = SkillGapAnalyzer.analyze(requiredSkills, acquiredSkills);

    expect(analysis.resources).toHaveProperty('React');
    expect(analysis.resources.React.length).toBeGreaterThan(0);
    expect(analysis.resources.React[0].title).toContain('React JS Course');
  });

  it('uses fallback resource search if skill is unknown', () => {
    const requiredWithUnknown = ['HTML', 'SuperAdvancedCodingLanguage'];
    const acquiredSkills = ['HTML'];
    const analysis = SkillGapAnalyzer.analyze(requiredWithUnknown, acquiredSkills);

    expect(analysis.resources).toHaveProperty('SuperAdvancedCodingLanguage');
    expect(analysis.resources.SuperAdvancedCodingLanguage[0].id).toContain('fallback_');
    expect(analysis.resources.SuperAdvancedCodingLanguage[0].provider).toBe('YouTube Search');
  });
});

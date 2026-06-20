export interface MicroResource {
  id: string;
  title: string;
  type: 'video' | 'article' | 'tutorial' | 'course';
  provider: string;
  url: string;
  duration: string;
  cost: 'free' | 'paid';
}

export interface SkillGapReport {
  careerId: string;
  careerTitle: string;
  acquired: string[];
  missing: string[];
  microResources: Record<string, MicroResource[]>;
}

export class SkillGapAnalyzer {
  private static microResources: Record<string, MicroResource[]> = {
    'HTML': [
      { id: 'html_1', title: 'HTML Crash Course for Beginners', type: 'video', provider: 'Traversy Media', url: 'https://www.youtube.com/watch?v=UB1O30zR-EE', duration: '1 hour', cost: 'free' },
      { id: 'html_2', title: 'Learn HTML on MDN Web Docs', type: 'tutorial', provider: 'MDN', url: 'https://developer.mozilla.org/en-US/docs/Learn/HTML', duration: 'Self-paced', cost: 'free' }
    ],
    'CSS': [
      { id: 'css_1', title: 'CSS Tutorial - Zero to Hero', type: 'video', provider: 'FreeCodeCamp', url: 'https://www.youtube.com/watch?v=1Rs2ND1ryYc', duration: '11 hours', cost: 'free' },
      { id: 'css_2', title: 'Learn CSS Layout', type: 'tutorial', provider: 'Scrimba', url: 'https://scrimba.com/learn/css', duration: '2 hours', cost: 'free' }
    ],
    'JavaScript': [
      { id: 'js_1', title: 'JavaScript Basics for Beginners', type: 'video', provider: 'Programming with Mosh', url: 'https://www.youtube.com/watch?v=W6NZfCO5SIk', duration: '50 mins', cost: 'free' },
      { id: 'js_2', title: 'Modern JavaScript Tutorial', type: 'tutorial', provider: 'javascript.info', url: 'https://javascript.info/', duration: 'Self-paced', cost: 'free' }
    ],
    'React': [
      { id: 'react_1', title: 'React JS Course for Beginners', type: 'video', provider: 'FreeCodeCamp', url: 'https://www.youtube.com/watch?v=bMknfKXIFA8', duration: '12 hours', cost: 'free' },
      { id: 'react_2', title: 'Quick Start - React Docs', type: 'tutorial', provider: 'React Team', url: 'https://react.dev/learn', duration: '1 hour', cost: 'free' }
    ],
    'Responsive Design': [
      { id: 'resp_1', title: 'Responsive Web Design Tutorial', type: 'video', provider: 'Kevin Powell', url: 'https://www.youtube.com/watch?v=srvUrASg0MY', duration: '40 mins', cost: 'free' }
    ],
    'Version Control': [
      { id: 'vc_1', title: 'Git and GitHub for Beginners', type: 'video', provider: 'FreeCodeCamp', url: 'https://www.youtube.com/watch?v=RGOj5yH7evk', duration: '1 hour', cost: 'free' }
    ],
    'SQL': [
      { id: 'sql_1', title: 'SQL Tutorial for Beginners', type: 'video', provider: 'Programming with Mosh', url: 'https://www.youtube.com/watch?v=HXV3zeQKqGY', duration: '3 hours', cost: 'free' },
      { id: 'sql_2', title: 'SQLZoo Interactive SQL Tutorial', type: 'tutorial', provider: 'SQLZoo', url: 'https://sqlzoo.net/', duration: 'Self-paced', cost: 'free' }
    ],
    'Excel': [
      { id: 'excel_1', title: 'Excel Tutorial for Beginners', type: 'video', provider: 'Kevin Stratvert', url: 'https://www.youtube.com/watch?v=rwbho0CgEAE', duration: '30 mins', cost: 'free' }
    ],
    'Data Visualization': [
      { id: 'dataviz_1', title: 'Data Visualization Guide', type: 'article', provider: 'Tableau', url: 'https://www.tableau.com/learn/articles/data-visualization', duration: '15 mins', cost: 'free' }
    ],
    'Statistical Analysis': [
      { id: 'stats_1', title: 'Statistics for Data Science', type: 'video', provider: 'FreeCodeCamp', url: 'https://www.youtube.com/watch?v=xxpc-HPKN28', duration: '8 hours', cost: 'free' }
    ],
    'Python or R': [
      { id: 'py_1', title: 'Python for Beginners', type: 'video', provider: 'Programming with Mosh', url: 'https://www.youtube.com/watch?v=kqtD5dpn9C8', duration: '1 hour', cost: 'free' }
    ],
    'Python/R': [
      { id: 'py_2', title: 'Python for Data Science', type: 'video', provider: 'FreeCodeCamp', url: 'https://www.youtube.com/watch?v=LHBE6Q9XlzI', duration: '12 hours', cost: 'free' }
    ],
    'User Research': [
      { id: 'uxr_1', title: 'How to Do User Research', type: 'article', provider: 'Nielsen Norman Group', url: 'https://www.nngroup.com/articles/user-research-methods/', duration: '20 mins', cost: 'free' }
    ],
    'Wireframing': [
      { id: 'wire_1', title: 'Introduction to Wireframing', type: 'video', provider: 'Figma', url: 'https://www.youtube.com/watch?v=FqGgPSeT0H8', duration: '10 mins', cost: 'free' }
    ],
    'Prototyping': [
      { id: 'proto_1', title: 'Prototyping in Figma for Beginners', type: 'video', provider: 'Figma', url: 'https://www.youtube.com/watch?v=3qS9v3_yXhs', duration: '15 mins', cost: 'free' }
    ],
    'Network Security': [
      { id: 'netsec_1', title: 'Network Security Fundamentals', type: 'video', provider: 'PowerCert Animated Videos', url: 'https://www.youtube.com/watch?v=U_P23pq1L9M', duration: '15 mins', cost: 'free' }
    ],
    'CI/CD': [
      { id: 'cicd_1', title: 'CI/CD Pipelines Explained', type: 'video', provider: 'TechWorld with Nana', url: 'https://www.youtube.com/watch?v=scEDHsr3APg', duration: '20 mins', cost: 'free' }
    ]
  };

  public static analyze(requiredSkills: string[], acquiredSkills: string[]): {
    acquired: string[];
    missing: string[];
    resources: Record<string, MicroResource[]>;
  } {
    const acquired = requiredSkills.filter(skill => acquiredSkills.includes(skill));
    const missing = requiredSkills.filter(skill => !acquiredSkills.includes(skill));
    
    const resources: Record<string, MicroResource[]> = {};
    missing.forEach(skill => {
      resources[skill] = this.microResources[skill] || [
        {
          id: `fallback_${skill}`,
          title: `Learn ${skill} on YouTube`,
          type: 'video',
          provider: 'YouTube Search',
          url: `https://www.youtube.com/results?search_query=learn+${encodeURIComponent(skill)}`,
          duration: 'Varies',
          cost: 'free'
        }
      ];
    });

    return { acquired, missing, resources };
  }
}

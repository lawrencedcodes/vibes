'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  Users, 
  Search, 
  Radio, 
  BarChart3, 
  Settings as SettingsIcon, 
  AlertTriangle, 
  Trash2, 
  Plus, 
  RefreshCw, 
  Check, 
  Trash, 
  UserMinus, 
  Volume2, 
  ExternalLink,
  Info,
  Calendar,
  Layers,
  ThumbsUp,
  MessageSquare,
  Repeat,
  Eye,
  EyeOff,
  Send
} from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('auditor');
  const [config, setConfig] = useState({ configured: false, userId: null, envStatus: {} });
  const [loadingConfig, setLoadingConfig] = useState(true);
  
  // Auditor State
  const [auditorData, setAuditorData] = useState([]);
  const [loadingAuditor, setLoadingAuditor] = useState(false);
  const [auditorFilter, setAuditorFilter] = useState('all'); // all, spam, inactive, clean
  const [selectedUsers, setSelectedUsers] = useState([]);
  
  // Advanced Search State
  const [searchParams, setSearchParams] = useState({
    keyword: '',
    fromUser: '',
    minLikes: 0,
    minRetweets: 0,
    sinceDate: '',
    untilDate: ''
  });
  const [searchResults, setSearchResults] = useState([]);
  const [savedQueries, setSavedQueries] = useState([]);
  const [newQueryName, setNewQueryName] = useState('');
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [activeSearchQuery, setActiveSearchQuery] = useState('');

  // Social Listening State
  const [keywords, setKeywords] = useState([]);
  const [newKeyword, setNewKeyword] = useState('');
  const [matchFeed, setMatchFeed] = useState([]);
  const [loadingListening, setLoadingListening] = useState(false);
  const [hasNewMatches, setHasNewMatches] = useState(false);
  const [audioAlertEnabled, setAudioAlertEnabled] = useState(true);

  // Post Performance Analytics State
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  
  // Settings Form State
  const [settingsForm, setSettingsForm] = useState({
    TWITTER_CONSUMER_KEY: '',
    TWITTER_CONSUMER_SECRET: '',
    TWITTER_ACCESS_TOKEN: '',
    TWITTER_ACCESS_TOKEN_SECRET: '',
    TWITTER_BEARER_TOKEN: '',
    TWITTER_USER_ID: '',
    TWITTER_USER_HANDLE: ''
  });
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsMessage, setSettingsMessage] = useState('');

  const [showSecrets, setShowSecrets] = useState({
    consumerKey: false,
    consumerSecret: false,
    accessToken: false,
    accessSecret: false,
    bearerToken: false
  });

  const toggleSecretVisibility = (field) => {
    setShowSecrets(prev => ({ ...prev, [field]: !prev[field] }));
  };

  // Free Tier Composer State
  const [profileDetails, setProfileDetails] = useState({ username: '', name: '', profile_image_url: '' });
  const [postedTweets, setPostedTweets] = useState([]);
  const [newTweetText, setNewTweetText] = useState('');
  const [loadingTweets, setLoadingTweets] = useState(false);
  const [postingTweet, setPostingTweet] = useState(false);

  // 1. Fetch Configuration Status
  const fetchConfig = async () => {
    try {
      const res = await fetch('/api/config');
      const data = await res.json();
      setConfig(data);
      if (data.configured && data.envValues) {
        // Pre-fill settings form
        setSettingsForm({
          TWITTER_CONSUMER_KEY: data.envValues.TWITTER_CONSUMER_KEY || '',
          TWITTER_CONSUMER_SECRET: data.envValues.TWITTER_CONSUMER_SECRET || '',
          TWITTER_ACCESS_TOKEN: data.envValues.TWITTER_ACCESS_TOKEN || '',
          TWITTER_ACCESS_TOKEN_SECRET: data.envValues.TWITTER_ACCESS_TOKEN_SECRET || '',
          TWITTER_BEARER_TOKEN: data.envValues.TWITTER_BEARER_TOKEN || '',
          TWITTER_USER_ID: data.envValues.TWITTER_USER_ID || '',
          TWITTER_USER_HANDLE: data.envValues.TWITTER_USER_HANDLE || ''
        });
      }
    } catch (e) {
      console.error("Failed to load config", e);
    } finally {
      setLoadingConfig(false);
    }
  };

  // 2. Fetch Auditor Connections
  const fetchAuditorData = async (forceSync = false) => {
    setLoadingAuditor(true);
    try {
      const method = forceSync ? 'POST' : 'GET';
      const res = await fetch('/api/circle', { method });
      const data = await res.json();
      if (data.success) {
        setAuditorData(data.accounts || []);
        setSelectedUsers([]);
        if (data.sandboxFallback) {
          alert(`⚠️ X API returned "403 Forbidden" (Client Not Enrolled).\n\nThis indicates you are using the default "Free" Access Tier of the X Developer API, which blocks connection lookups.\n\nAuraX has gracefully activated Local Sandbox Mode with pre-seeded followers so you can still try the relationship auditor, filtering, and bulk actions!`);
        }
      } else {
        alert(`Auditor Error: ${data.error || 'Unknown error'}`);
      }
    } catch (e) {
      console.error("Failed to load circle data", e);
      alert(`Auditor Network Error: ${e.message}`);
    } finally {
      setLoadingAuditor(false);
    }
  };

  // 3. Fetch Advanced Search Saved Queries
  const fetchSavedQueries = async () => {
    try {
      const res = await fetch('/api/search?action=saved');
      const data = await res.json();
      if (data.success) {
        setSavedQueries(data.queries || []);
      }
    } catch (e) {
      console.error("Failed to fetch saved queries", e);
    }
  };

  // 4. Fetch Monitoring Data
  const fetchMonitoringData = async (isBackground = false) => {
    if (!isBackground) setLoadingListening(true);
    try {
      const res = await fetch('/api/monitoring');
      const data = await res.json();
      if (data.success) {
        setKeywords(data.keywords || []);
        
        // Detect if new items are added to trigger visual badge / browser notification
        if (isBackground && data.feed?.length > matchFeed.length) {
          const newItemsCount = data.feed.length - matchFeed.length;
          setHasNewMatches(true);
          
          if (audioAlertEnabled) {
            // Simple play synthesized audio alert
            try {
              const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
              const osc = audioCtx.createOscillator();
              const gain = audioCtx.createGain();
              osc.type = 'sine';
              osc.frequency.setValueAtTime(880, audioCtx.currentTime); // high ping
              gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
              osc.connect(gain);
              gain.connect(audioCtx.destination);
              osc.start();
              osc.stop(audioCtx.currentTime + 0.15);
            } catch (e) {
              console.warn("Audio Context beep failed", e);
            }
          }
          
          // Show browser notification if permitted
          if (Notification.permission === 'granted') {
            new Notification('AuraX Monitoring Alert', {
              body: `Found ${newItemsCount} new X matches for tracked keywords!`,
              icon: '/favicon.ico'
            });
          }
        }
        
        setMatchFeed(data.feed || []);
      }
    } catch (e) {
      console.error("Failed to fetch listening monitoring data", e);
    } finally {
      if (!isBackground) setLoadingListening(false);
    }
  };

  // 5. Fetch Post Performance Analytics
  const fetchAnalyticsData = async (isManual = false) => {
    setLoadingAnalytics(true);
    try {
      const res = await fetch('/api/analytics');
      const data = await res.json();
      if (data.success) {
        setAnalyticsData(data);
      } else if (isManual) {
        alert(`Analytics Error: ${data.error || 'Unknown error'}`);
      }
    } catch (e) {
      console.error("Failed to load analytics", e);
      if (isManual) alert(`Analytics Network Error: ${e.message}`);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  // 6. Fetch Profile and Local Logged Tweets (Free Tier)
  const fetchProfileAndTweets = async () => {
    setLoadingTweets(true);
    try {
      const res = await fetch('/api/tweets');
      const data = await res.json();
      if (data.success) {
        setPostedTweets(data.posts || []);
        if (data.profile) {
          setProfileDetails(data.profile);
        }
      }
    } catch (e) {
      console.error("Failed fetching profile/tweets", e);
    } finally {
      setLoadingTweets(false);
    }
  };

  const handlePostTweet = async (e) => {
    e.preventDefault();
    if (!newTweetText.trim()) return;
    if (newTweetText.trim().length > 280) {
      alert("Tweets cannot exceed 280 characters.");
      return;
    }
    setPostingTweet(true);
    try {
      const res = await fetch('/api/tweets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newTweetText.trim() })
      });
      const data = await res.json();
      if (data.success) {
        setNewTweetText('');
        fetchProfileAndTweets();
        if (data.demo) {
          alert("Tweet posted successfully! (Demo Sandbox Mode - Logged Locally)");
        } else {
          alert("Tweet posted successfully to live X!");
        }
      } else {
        alert(`Post failed: ${data.error}`);
      }
    } catch (err) {
      alert(`Post failed: ${err.message}`);
    } finally {
      setPostingTweet(false);
    }
  };

  const handleDeleteTweet = async (tweetId) => {
    if (!confirm("Are you sure you want to delete this tweet from X and your local log?")) return;
    try {
      const res = await fetch(`/api/tweets?id=${tweetId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchProfileAndTweets();
        if (data.demo) {
          alert("Tweet deleted locally! (Demo Sandbox)");
        } else {
          alert("Tweet deleted successfully from live X!");
        }
      } else {
        alert(`Delete failed: ${data.error}`);
      }
    } catch (err) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  // Run on mount
  useEffect(() => {
    fetchConfig();
    fetchAuditorData();
    fetchSavedQueries();
    fetchMonitoringData();
    fetchAnalyticsData();
    fetchProfileAndTweets();

    // Request Notification permission
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }
  }, []);

  // Poll for monitoring matches every 30 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      fetchMonitoringData(true);
    }, 30000);

    return () => clearInterval(timer);
  }, [matchFeed, audioAlertEnabled]);

  // Auditor filtering logic
  const filteredAuditorList = useMemo(() => {
    return auditorData.filter(user => {
      if (auditorFilter === 'spam') return user.is_spam === 1;
      if (auditorFilter === 'inactive') return user.is_inactive === 1;
      if (auditorFilter === 'clean') return user.is_spam === 0 && user.is_inactive === 0;
      return true;
    });
  }, [auditorData, auditorFilter]);

  // Handle Auditor Selection Checkboxes
  const handleSelectUser = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedUsers(filteredAuditorList.map(u => u.user_id));
    } else {
      setSelectedUsers([]);
    }
  };

  // Bulk Actions (Unfollow or Mute)
  const handleBulkAction = async (action) => {
    if (selectedUsers.length === 0) return;
    if (!confirm(`Are you sure you want to bulk ${action} ${selectedUsers.length} accounts?`)) return;

    setLoadingAuditor(true);
    try {
      const res = await fetch('/api/circle', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userIds: selectedUsers, action })
      });
      const data = await res.json();
      if (data.success) {
        alert(`Successfully ${action === 'unfollow' ? 'unfollowed' : 'muted'} selected accounts!`);
        // Refresh local cache
        fetchAuditorData();
      }
    } catch (e) {
      alert(`Bulk action failed: ${e.message}`);
    } finally {
      setLoadingAuditor(false);
    }
  };

  // Execute Advanced Search Query
  const compileQueryString = (params) => {
    const parts = [];
    if (params.keyword) parts.push(params.keyword);
    if (params.fromUser) parts.push(`from:${params.fromUser}`);
    if (params.minLikes > 0) parts.push(`min_faves:${params.minLikes}`);
    if (params.minRetweets > 0) parts.push(`min_retweets:${params.minRetweets}`);
    if (params.sinceDate) parts.push(`since:${params.sinceDate}`);
    if (params.untilDate) parts.push(`until:${params.untilDate}`);
    return parts.join(' ');
  };

  const handleRunSearch = async (compiledStr = null) => {
    const qStr = compiledStr || compileQueryString(searchParams);
    if (!qStr.trim()) {
      alert("Please configure at least one search criterion.");
      return;
    }

    setLoadingSearch(true);
    try {
      const res = await fetch(`/api/search?action=run&q=${encodeURIComponent(qStr)}`);
      const data = await res.json();
      if (data.success) {
        setSearchResults(data.tweets || []);
        setActiveSearchQuery(qStr);
      }
    } catch (e) {
      alert(`Search failed: ${e.message}`);
    } finally {
      setLoadingSearch(false);
    }
  };

  // Save Search Parameters
  const handleSaveQuery = async () => {
    const qStr = compileQueryString(searchParams);
    if (!qStr.trim()) {
      alert("No search query parameters set.");
      return;
    }

    const name = newQueryName.trim() || `Query: ${qStr.substring(0, 15)}...`;
    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, queryParams: searchParams })
      });
      const data = await res.json();
      if (data.success) {
        setNewQueryName('');
        fetchSavedQueries();
      }
    } catch (e) {
      alert(`Failed to save query: ${e.message}`);
    }
  };

  const handleDeleteSavedQuery = async (queryId) => {
    try {
      const res = await fetch(`/api/search?id=${queryId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchSavedQueries();
      }
    } catch (e) {
      alert(`Delete query failed: ${e.message}`);
    }
  };

  const handleLoadSavedQuery = (q) => {
    setSearchParams(q.query_params);
    // Auto-run search
    const compiled = compileQueryString(q.query_params);
    handleRunSearch(compiled);
  };

  // Listening: Add keyword
  const handleAddKeyword = async (e) => {
    e.preventDefault();
    if (!newKeyword.trim()) return;

    try {
      const res = await fetch('/api/monitoring', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword: newKeyword.trim() })
      });
      const data = await res.json();
      if (data.success) {
        setNewKeyword('');
        fetchMonitoringData();
      } else {
        alert(data.error || 'Failed to add keyword.');
      }
    } catch (e) {
      alert(`Failed to add keyword: ${e.message}`);
    }
  };

  const handleDeleteKeyword = async (id) => {
    try {
      const res = await fetch(`/api/monitoring?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchMonitoringData();
      }
    } catch (e) {
      alert(`Failed to delete keyword: ${e.message}`);
    }
  };

  const handleMarkFeedRead = async () => {
    try {
      const res = await fetch('/api/monitoring', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tweetIds: 'all' })
      });
      const data = await res.json();
      if (data.success) {
        setHasNewMatches(false);
        fetchMonitoringData(true);
      }
    } catch (e) {
      console.error("Mark read failed", e);
    }
  };

  // Settings: Save credentials
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    setSettingsMessage('');
    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settingsForm)
      });
      const data = await res.json();
      if (data.success) {
        setSettingsMessage('Credentials saved! ⚠️ PLEASE RESTART YOUR DEV SERVER: Stop the terminal process (Ctrl+C) and run "npm run dev" again to apply keys across all app modules.');
        fetchConfig();
      } else {
        setSettingsMessage(`Error: ${data.error}`);
      }
    } catch (err) {
      setSettingsMessage(`Failed to save settings: ${err.message}`);
    } finally {
      setSavingSettings(false);
    }
  };

  // SVGs Charting Generators
  const renderTrendChart = () => {
    if (!analyticsData || !analyticsData.dailyTrends || analyticsData.dailyTrends.length === 0) {
      return <div className="text-muted text-center" style={{padding: '100px 0'}}>No trend history available. Add analytics posts.</div>;
    }

    const data = analyticsData.dailyTrends;
    const padding = 40;
    const width = 800;
    const height = 220;
    
    // Find Max values to scale chart
    const maxImp = Math.max(...data.map(d => d.impressions)) || 1000;
    const maxEng = Math.max(...data.map(d => d.engagements)) || 100;

    // Scale function
    const getX = (index) => padding + (index / (data.length - 1)) * (width - 2 * padding);
    const getYImp = (val) => height - padding - (val / maxImp) * (height - 2 * padding);
    const getYEng = (val) => height - padding - (val / maxEng) * (height - 2 * padding);

    // Build SVG path strings
    const impPathPoints = data.map((d, i) => `${getX(i)},${getYImp(d.impressions)}`).join(' ');
    const engPathPoints = data.map((d, i) => `${getX(i)},${getYEng(d.engagements)}`).join(' ');

    const impAreaPoints = `${padding},${height - padding} ` + data.map((d, i) => `${getX(i)},${getYImp(d.impressions)}`).join(' ') + ` ${width - padding},${height - padding}`;
    const engAreaPoints = `${padding},${height - padding} ` + data.map((d, i) => `${getX(i)},${getYEng(d.engagements)}`).join(' ') + ` ${width - padding},${height - padding}`;

    return (
      <div className="chart-container">
        <svg className="chart-svg" viewBox={`0 0 ${width} ${height}`} width="100%" height="100%">
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((p, idx) => (
            <line 
              key={idx} 
              x1={padding} 
              y1={padding + p * (height - 2 * padding)} 
              x2={width - padding} 
              y2={padding + p * (height - 2 * padding)} 
              className="chart-grid" 
            />
          ))}

          {/* Area under charts */}
          <polygon points={impAreaPoints} fill="var(--primary)" className="chart-area" />
          <polygon points={engAreaPoints} fill="var(--accent-purple)" className="chart-area" />

          {/* Lines */}
          <polyline points={impPathPoints} stroke="var(--primary)" className="chart-line" />
          <polyline points={engPathPoints} stroke="var(--accent-purple)" className="chart-line" />

          {/* Data Nodes & Tooltips */}
          {data.map((d, i) => (
            <g key={i}>
              <circle 
                cx={getX(i)} 
                cy={getYImp(d.impressions)} 
                r="4" 
                fill="white" 
                stroke="var(--primary)" 
                strokeWidth="2" 
                style={{cursor: 'pointer'}}
              />
              <circle 
                cx={getX(i)} 
                cy={getYEng(d.engagements)} 
                r="4" 
                fill="white" 
                stroke="var(--accent-purple)" 
                strokeWidth="2" 
                style={{cursor: 'pointer'}}
              />
              {/* X Date Label */}
              <text x={getX(i)} y={height - 12} className="chart-text" style={{fontSize: '9px'}}>
                {d.date.substring(5)}
              </text>
            </g>
          ))}

          {/* Axis borders */}
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} className="chart-axis" />
          <line x1={padding} y1={padding} x2={padding} y2={height - padding} className="chart-axis" />
        </svg>

        {/* Legend */}
        <div style={{display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '10px', fontSize: '0.8rem'}}>
          <span style={{display: 'flex', alignItems: 'center', gap: '6px'}}>
            <span style={{width: '12px', height: '3px', background: 'var(--primary)', borderRadius: '2px'}} />
            Impressions (Max: {maxImp.toLocaleString()})
          </span>
          <span style={{display: 'flex', alignItems: 'center', gap: '6px'}}>
            <span style={{width: '12px', height: '3px', background: 'var(--accent-purple)', borderRadius: '2px'}} />
            Total Engagement (Max: {maxEng.toLocaleString()})
          </span>
        </div>
      </div>
    );
  };

  const renderHourlyChart = () => {
    if (!analyticsData || !analyticsData.hourlyAnalysis) return null;
    
    // Sort analysis by hour
    const data = [...analyticsData.hourlyAnalysis].sort((a, b) => a.hour - b.hour);
    const width = 800;
    const height = 200;
    const paddingLeft = 40;
    const paddingBottom = 30;
    const paddingTop = 20;
    const paddingRight = 20;

    const maxRate = Math.max(...data.map(d => d.engagementRate)) || 1;
    
    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;
    const barWidth = (chartWidth / 24) * 0.75;
    const gap = (chartWidth / 24) * 0.25;

    return (
      <div className="chart-container">
        <svg className="chart-svg" viewBox={`0 0 ${width} ${height}`} width="100%" height="100%">
          {/* Y Axis Grid Lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((p, idx) => (
            <line 
              key={idx} 
              x1={paddingLeft} 
              y1={paddingTop + p * chartHeight} 
              x2={width - paddingRight} 
              y2={paddingTop + p * chartHeight} 
              className="chart-grid" 
            />
          ))}

          {/* Bar rendering */}
          {data.map((d, i) => {
            const valHeight = (d.engagementRate / maxRate) * chartHeight;
            const x = paddingLeft + i * (barWidth + gap) + gap/2;
            const y = height - paddingBottom - valHeight;

            // Highlight top performing hours (e.g. rate > 4%)
            const color = d.engagementRate > (maxRate * 0.75) ? 'var(--accent-green)' : 'var(--primary)';

            return (
              <g key={i}>
                <rect 
                  x={x} 
                  y={y} 
                  width={barWidth} 
                  height={valHeight} 
                  fill={color} 
                  opacity="0.8"
                  className="chart-bar"
                />
                {/* Labels every 3 hours */}
                {d.hour % 3 === 0 && (
                  <text x={x + barWidth/2} y={height - 10} className="chart-text" style={{fontSize: '9px'}}>
                    {d.hour}:00
                  </text>
                )}
                <title>{`Hour ${d.hour}:00 - Rate: ${d.engagementRate}% (avg ${d.avgEngagement} eng)`}</title>
              </g>
            );
          })}

          {/* Base Axis line */}
          <line x1={paddingLeft} y1={height - paddingBottom} x2={width - paddingRight} y2={height - paddingBottom} className="chart-axis" />
          <line x1={paddingLeft} y1={paddingTop} x2={paddingLeft} y2={height - paddingBottom} className="chart-axis" />
        </svg>

        <div style={{textAlign: 'center', marginTop: '5px', fontSize: '0.8rem', color: 'var(--text-secondary)'}}>
          Average Engagement Rate (%) by Hour of Day. Green denotes peak traffic engagement window.
        </div>
      </div>
    );
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-logo">A</div>
          <div className="brand-name">AuraX</div>
          <span className="brand-badge">v2.0</span>
        </div>

        <nav className="nav-links">
          <li className="nav-item">
            <button 
              onClick={() => setActiveTab('auditor')}
              className={`nav-link ${activeTab === 'auditor' ? 'active' : ''}`}
            >
              <Users size={18} />
              Auditor & Circle
            </button>
          </li>
          <li className="nav-item">
            <button 
              onClick={() => setActiveTab('search')}
              className={`nav-link ${activeTab === 'search' ? 'active' : ''}`}
            >
              <Search size={18} />
              Advanced Search
            </button>
          </li>
          <li className="nav-item">
            <button 
              onClick={() => setActiveTab('listening')}
              className={`nav-link ${activeTab === 'listening' ? 'active' : ''}`}
              style={{ position: 'relative' }}
            >
              <Radio size={18} />
              Social Listening
              {hasNewMatches && (
                <span 
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '16px',
                    width: '8px',
                    height: '8px',
                    backgroundColor: 'var(--primary)',
                    borderRadius: '50%',
                    boxShadow: '0 0 10px var(--primary)'
                  }} 
                />
              )}
            </button>
          </li>
          <li className="nav-item">
            <button 
              onClick={() => setActiveTab('analytics')}
              className={`nav-link ${activeTab === 'analytics' ? 'active' : ''}`}
            >
              <BarChart3 size={18} />
              Post Performance
            </button>
          </li>
          <li className="nav-item">
            <button 
              onClick={() => setActiveTab('composer')}
              className={`nav-link ${activeTab === 'composer' ? 'active' : ''}`}
            >
              <Send size={18} />
              Tweet Composer
            </button>
          </li>
          <li className="nav-item">
            <button 
              onClick={() => setActiveTab('settings')}
              className={`nav-link ${activeTab === 'settings' ? 'active' : ''}`}
            >
              <SettingsIcon size={18} />
              Local Credentials
            </button>
          </li>
        </nav>

        <div className="sidebar-footer">
          <div className="config-indicator" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {profileDetails.profile_image_url ? (
              <img 
                src={profileDetails.profile_image_url} 
                alt={profileDetails.username} 
                style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)' }} 
              />
            ) : (
              <span className={`indicator-dot ${config.configured ? 'active' : 'inactive'}`} />
            )}
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '160px' }}>
                {config.configured ? (profileDetails.name || 'Connected User') : 'Demo Playground'}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                {config.configured ? `@${profileDetails.username || config.userId}` : 'Using local sandbox'}
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        
        {/* Playground / Demo Mode Banner */}
        {!config.configured && (
          <div className="alert-banner">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Info size={24} style={{ color: 'var(--primary)' }} />
              <div className="alert-message">
                <strong>AuraX is running in Demo Playground Mode.</strong> Local SQLite functions are loaded, but live calls to X are simulated. Add your credentials in the <strong>Local Credentials</strong> tab to connect to your live X Developer Account.
              </div>
            </div>
            <button className="btn btn-secondary" onClick={() => setActiveTab('settings')}>Configure Keys</button>
          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW 1: AUDITOR & TWITTER CIRCLE */}
        {/* ============================================================== */}
        {activeTab === 'auditor' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h2 style={{ fontSize: '1.75rem', marginBottom: '4px' }}>Circle Auditor & Relationship Manager</h2>
                <p style={{ color: 'var(--text-secondary)' }}>Identify inactive accounts, spam/bots, and manage relationships in bulk.</p>
              </div>
              
              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  className="btn btn-secondary" 
                  onClick={() => fetchAuditorData(false)}
                  disabled={loadingAuditor}
                >
                  <RefreshCw size={14} className={loadingAuditor ? 'spin' : ''} />
                  Reload Cached
                </button>
                <button 
                  className="btn btn-primary" 
                  onClick={() => fetchAuditorData(true)}
                  disabled={loadingAuditor}
                >
                  <RefreshCw size={14} className={loadingAuditor ? 'spin' : ''} />
                  Sync X Relationships
                </button>
              </div>
            </div>

            {/* Stat Cards */}
            <div className="grid-4" style={{ marginBottom: '24px' }}>
              <div className="stat-card">
                <div className="stat-label">Total Connections</div>
                <div className="stat-value">{auditorData.length}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Followers and Following merged</div>
              </div>
              <div className="stat-card">
                <div className="stat-label" style={{ color: 'var(--accent-red)' }}>Spam/Fake Flagged</div>
                <div className="stat-value" style={{ color: 'var(--accent-red)' }}>
                  {auditorData.filter(u => u.is_spam === 1).length}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Low followers ratio / spam words</div>
              </div>
              <div className="stat-card">
                <div className="stat-label" style={{ color: 'var(--accent-orange)' }}>Inactive Flagged</div>
                <div className="stat-value" style={{ color: 'var(--accent-orange)' }}>
                  {auditorData.filter(u => u.is_inactive === 1).length}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Zero tweets or old last-activity date</div>
              </div>
              <div className="stat-card">
                <div className="stat-label" style={{ color: 'var(--accent-green)' }}>Active & Clean</div>
                <div className="stat-value" style={{ color: 'var(--accent-green)' }}>
                  {auditorData.filter(u => u.is_spam === 0 && u.is_inactive === 0).length}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Healthy relationship profiles</div>
              </div>
            </div>

            {/* Controls panel */}
            <div className="panel" style={{ padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {['all', 'spam', 'inactive', 'clean'].map(filter => (
                    <button 
                      key={filter} 
                      onClick={() => { setAuditorFilter(filter); setSelectedUsers([]); }}
                      className={`btn btn-secondary`} 
                      style={{ 
                        padding: '6px 12px', 
                        fontSize: '0.8rem',
                        background: auditorFilter === filter ? 'rgba(29, 155, 240, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                        borderColor: auditorFilter === filter ? 'var(--primary)' : 'var(--panel-border)'
                      }}
                    >
                      {filter.toUpperCase()} ({
                        filter === 'all' ? auditorData.length :
                        filter === 'spam' ? auditorData.filter(u => u.is_spam === 1).length :
                        filter === 'inactive' ? auditorData.filter(u => u.is_inactive === 1).length :
                        auditorData.filter(u => u.is_spam === 0 && u.is_inactive === 0).length
                      })
                    </button>
                  ))}
                </div>

                {selectedUsers.length > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--primary)' }}>
                      {selectedUsers.length} Selected
                    </span>
                    <button 
                      className="btn btn-danger" 
                      onClick={() => handleBulkAction('unfollow')}
                      style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                    >
                      <UserMinus size={14} />
                      Bulk Unfollow
                    </button>
                    <button 
                      className="btn btn-danger" 
                      onClick={() => handleBulkAction('mute')}
                      style={{ padding: '6px 12px', fontSize: '0.8rem', backgroundColor: 'rgba(245, 158, 11, 0.15)', color: 'var(--accent-orange)', borderColor: 'rgba(245, 158, 11, 0.25)' }}
                    >
                      <AlertTriangle size={14} />
                      Bulk Mute
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Connections Datatable */}
            <div className="panel" style={{ padding: '0px', overflow: 'hidden' }}>
              {loadingAuditor ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '100px 0', gap: '12px' }}>
                  <div className="spinner" />
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Syncing relationships list from SQLite / X API...</div>
                </div>
              ) : filteredAuditorList.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '100px 0', color: 'var(--text-muted)' }}>
                  No accounts match this filter criteria.
                </div>
              ) : (
                <div className="table-wrapper">
                  <table className="datatable">
                    <thead>
                      <tr>
                        <th style={{ width: '40px', textAlign: 'center' }}>
                          <input 
                            type="checkbox" 
                            onChange={handleSelectAll} 
                            checked={selectedUsers.length === filteredAuditorList.length && filteredAuditorList.length > 0} 
                          />
                        </th>
                        <th>User Profile</th>
                        <th>Type</th>
                        <th>Metrics</th>
                        <th>Created At</th>
                        <th>Last Active</th>
                        <th>Auditor Rating</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAuditorList.map(user => (
                        <tr key={user.user_id}>
                          <td style={{ textAlign: 'center' }}>
                            <input 
                              type="checkbox" 
                              checked={selectedUsers.includes(user.user_id)} 
                              onChange={() => handleSelectUser(user.user_id)}
                            />
                          </td>
                          <td>
                            <div className="user-profile-cell">
                              <div className="avatar">
                                {user.name.charAt(0).toUpperCase()}
                              </div>
                              <div className="user-name-wrapper">
                                <span className="user-display-name">{user.name}</span>
                                <span className="user-handle">@{user.username}</span>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="badge badge-gray" style={{textTransform: 'capitalize'}}>
                              {user.connection_type}
                            </span>
                          </td>
                          <td>
                            <div style={{ fontSize: '0.8rem', display: 'flex', flexDirection: 'column' }}>
                              <span><strong>Followers:</strong> {user.followers_count.toLocaleString()}</span>
                              <span><strong>Following:</strong> {user.following_count.toLocaleString()}</span>
                              <span><strong>Tweets:</strong> {user.tweet_count.toLocaleString()}</span>
                            </div>
                          </td>
                          <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            {user.account_created_at ? new Date(user.account_created_at).toLocaleDateString() : 'N/A'}
                          </td>
                          <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            {user.last_tweet_at ? new Date(user.last_tweet_at).toLocaleDateString() : (user.is_inactive ? 'Legacy' : 'Recent')}
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                              {user.is_spam === 1 && <span className="badge badge-spam">Bot / Spam Heuristic</span>}
                              {user.is_inactive === 1 && <span className="badge badge-inactive">Inactive</span>}
                              {user.is_spam === 0 && user.is_inactive === 0 && <span className="badge badge-active">Active</span>}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW 2: ADVANCED TWITTER SEARCH */}
        {/* ============================================================== */}
        {activeTab === 'search' && (
          <div>
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.75rem', marginBottom: '4px' }}>Advanced Visual Search Builder</h2>
              <p style={{ color: 'var(--text-secondary)' }}>Design parameters using native query arguments, execute live fetches, and save templates.</p>
            </div>

            <div className="grid-2">
              {/* Form parameters */}
              <div className="panel">
                <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', borderBottom: '1px solid var(--panel-border)', paddingBottom: '10px' }}>
                  Query Builder Settings
                </h3>

                <div className="form-group">
                  <label className="form-label">Keyword or Phrase</label>
                  <input 
                    type="text" 
                    className="input-text" 
                    placeholder="e.g. nextjs server actions"
                    value={searchParams.keyword}
                    onChange={(e) => setSearchParams({ ...searchParams, keyword: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">From Twitter Account</label>
                  <input 
                    type="text" 
                    className="input-text" 
                    placeholder="e.g. vercel"
                    value={searchParams.fromUser}
                    onChange={(e) => setSearchParams({ ...searchParams, fromUser: e.target.value })}
                  />
                </div>

                <div className="grid-2" style={{ gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Minimum Likes</label>
                    <input 
                      type="number" 
                      className="input-text" 
                      min="0"
                      value={searchParams.minLikes}
                      onChange={(e) => setSearchParams({ ...searchParams, minLikes: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Minimum Retweets</label>
                    <input 
                      type="number" 
                      className="input-text" 
                      min="0"
                      value={searchParams.minRetweets}
                      onChange={(e) => setSearchParams({ ...searchParams, minRetweets: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>

                <div className="grid-2" style={{ gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Since Date</label>
                    <input 
                      type="date" 
                      className="input-text" 
                      value={searchParams.sinceDate}
                      onChange={(e) => setSearchParams({ ...searchParams, sinceDate: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Until Date</label>
                    <input 
                      type="date" 
                      className="input-text" 
                      value={searchParams.untilDate}
                      onChange={(e) => setSearchParams({ ...searchParams, untilDate: e.target.value })}
                    />
                  </div>
                </div>

                {/* Query Preview */}
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '8px', fontSize: '0.85rem', fontFamily: 'var(--font-mono)', border: '1px solid var(--panel-border)', marginBottom: '16px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Compiled Query:</span>{' '}
                  <span style={{ color: 'var(--primary)', wordBreak: 'break-all' }}>
                    {compileQueryString(searchParams) || '(empty parameters)'}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => handleRunSearch()} disabled={loadingSearch}>
                    {loadingSearch ? 'Executing...' : 'Run Search Query'}
                  </button>
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => {
                      setSearchParams({ keyword: '', fromUser: '', minLikes: 0, minRetweets: 0, sinceDate: '', untilDate: '' });
                      setSearchResults([]);
                      setActiveSearchQuery('');
                    }}
                  >
                    Clear Form
                  </button>
                </div>

                {/* Save query field */}
                <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--panel-border)', display: 'flex', gap: '8px' }}>
                  <input 
                    type="text" 
                    className="input-text" 
                    placeholder="Enter query template name..."
                    value={newQueryName}
                    onChange={(e) => setNewQueryName(e.target.value)}
                  />
                  <button className="btn btn-secondary" onClick={handleSaveQuery}>
                    Save Template
                  </button>
                </div>
              </div>

              {/* Saved Query List */}
              <div className="panel" style={{ display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', borderBottom: '1px solid var(--panel-border)', paddingBottom: '10px' }}>
                  Saved Templates (SQLite)
                </h3>

                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '350px' }}>
                  {savedQueries.length === 0 ? (
                    <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--text-muted)', padding: '40px 0' }}>
                      No saved templates yet. Build parameters and click "Save Template".
                    </div>
                  ) : (
                    savedQueries.map(q => (
                      <div 
                        key={q.id} 
                        style={{ 
                          padding: '12px', 
                          background: 'rgba(255,255,255,0.01)', 
                          border: '1px solid var(--panel-border)',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '12px'
                        }}
                      >
                        <div style={{ cursor: 'pointer', flex: 1 }} onClick={() => handleLoadSavedQuery(q)}>
                          <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{q.name}</div>
                          <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--primary)', wordBreak: 'break-all', marginTop: '2px' }}>
                            {compileQueryString(q.query_params)}
                          </div>
                        </div>
                        <button className="btn btn-danger" style={{ padding: '6px', borderRadius: '6px' }} onClick={() => handleDeleteSavedQuery(q.id)}>
                          <Trash size={14} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Results Output */}
            <div className="panel" style={{ padding: '0px', overflow: 'hidden' }}>
              <div className="panel-header" style={{ padding: '20px 24px 14px', marginBottom: '0px' }}>
                <h3 className="panel-title">
                  <Search size={18} style={{ color: 'var(--primary)' }} />
                  Search Results {activeSearchQuery && `for: "${activeSearchQuery}"`}
                </h3>
              </div>

              {loadingSearch ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0', gap: '12px' }}>
                  <div className="spinner" />
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Calling X API search index...</div>
                </div>
              ) : searchResults.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
                  No tweets fetched yet. Select or build a query and run.
                </div>
              ) : (
                <div className="table-wrapper" style={{ border: 'none' }}>
                  <table className="datatable">
                    <thead>
                      <tr>
                        <th>Account</th>
                        <th>Tweet Text</th>
                        <th style={{ width: '120px' }}>Published</th>
                        <th style={{ width: '150px' }}>Engagement</th>
                      </tr>
                    </thead>
                    <tbody>
                      {searchResults.map(tweet => (
                        <tr key={tweet.id}>
                          <td style={{ width: '220px' }}>
                            <div className="user-profile-cell">
                              {tweet.author.profile_image_url ? (
                                <img 
                                  src={tweet.author.profile_image_url} 
                                  alt={tweet.author.username} 
                                  style={{ width: '38px', height: '38px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)' }} 
                                />
                              ) : (
                                <div className="avatar">{tweet.author.name.charAt(0)}</div>
                              )}
                              <div className="user-name-wrapper">
                                <span className="user-display-name">{tweet.author.name}</span>
                                <span className="user-handle">@{tweet.author.username}</span>
                              </div>
                            </div>
                          </td>
                          <td style={{ fontSize: '0.9rem', lineHeight: '1.4', maxWidth: '400px', wordBreak: 'break-word' }}>
                            {tweet.text}
                          </td>
                          <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            {new Date(tweet.created_at).toLocaleString()}
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '12px', fontSize: '0.75rem' }}>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <ThumbsUp size={12} style={{ color: 'var(--primary)' }} />
                                {tweet.public_metrics.like_count.toLocaleString()}
                              </span>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Repeat size={12} style={{ color: 'var(--accent-purple)' }} />
                                {tweet.public_metrics.retweet_count.toLocaleString()}
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW 3: SOCIAL LISTENING */}
        {/* ============================================================== */}
        {activeTab === 'listening' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h2 style={{ fontSize: '1.75rem', marginBottom: '4px' }}>Social Listening & Real-Time Tracking</h2>
                <p style={{ color: 'var(--text-secondary)' }}>Set up persistent search streams that periodically query keywords in the background.</p>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  className="btn btn-secondary" 
                  onClick={() => setAudioAlertEnabled(!audioAlertEnabled)}
                  style={{ borderColor: audioAlertEnabled ? 'var(--primary)' : 'var(--panel-border)', background: audioAlertEnabled ? 'var(--primary-glow)' : '' }}
                >
                  <Volume2 size={16} />
                  {audioAlertEnabled ? 'Sound: ON' : 'Sound: MUTED'}
                </button>
                <button 
                  className="btn btn-primary" 
                  onClick={() => {
                    fetchMonitoringData();
                    setHasNewMatches(false);
                  }}
                  disabled={loadingListening}
                >
                  <RefreshCw size={14} className={loadingListening ? 'spin' : ''} />
                  Poll Now
                </button>
              </div>
            </div>

            <div className="grid-3" style={{ gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
              {/* Left Column: Keyword Management */}
              <div className="panel" style={{ alignSelf: 'start' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', borderBottom: '1px solid var(--panel-border)', paddingBottom: '10px' }}>
                  Tracked Keywords
                </h3>

                <form onSubmit={handleAddKeyword} style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                  <input 
                    type="text" 
                    className="input-text" 
                    placeholder="e.g. vercel OR nextjs" 
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                  />
                  <button type="submit" className="btn btn-primary" style={{ padding: '10px' }}>
                    <Plus size={16} />
                  </button>
                </form>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {keywords.length === 0 ? (
                    <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', padding: '20px 0' }}>
                      Not tracking any keywords. Add one above.
                    </div>
                  ) : (
                    keywords.map(kw => (
                      <div 
                        key={kw.id} 
                        style={{ 
                          padding: '10px 12px', 
                          background: 'rgba(0,0,0,0.2)', 
                          border: '1px solid var(--panel-border)',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          fontSize: '0.9rem'
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 'bold' }}>{kw.keyword}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                            Last polled:{' '}
                            {kw.last_polled_at ? new Date(kw.last_polled_at).toLocaleTimeString() : 'Pending first scan'}
                          </div>
                        </div>
                        <button className="btn btn-danger" style={{ padding: '4px', borderRadius: '4px' }} onClick={() => handleDeleteKeyword(kw.id)}>
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Right Column: Ingest Feed Matches */}
              <div className="panel">
                <div className="panel-header" style={{ marginBottom: '16px', paddingBottom: '10px' }}>
                  <h3 className="panel-title">
                    <Radio size={18} style={{ color: 'var(--primary)' }} />
                    Live Activity Ingestion Feed
                  </h3>
                  {matchFeed.some(t => t.is_read === 0) && (
                    <button className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem' }} onClick={handleMarkFeedRead}>
                      <Check size={12} /> Mark All Read
                    </button>
                  )}
                </div>

                {loadingListening ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '100px 0', gap: '12px' }}>
                    <div className="spinner" />
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Polling tracking keywords stream...</div>
                  </div>
                ) : matchFeed.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '100px 0', color: 'var(--text-muted)' }}>
                    No stream matches found. Add tracked keywords to compile ingestion.
                  </div>
                ) : (
                  <div className="match-feed">
                    {matchFeed.map(tweet => (
                      <div key={tweet.tweet_id} className={`match-card ${tweet.is_read === 0 ? 'unread' : ''}`}>
                        <div className="match-header">
                          <div className="match-meta">
                            <span className="avatar" style={{ width: '24px', height: '24px', fontSize: '0.7rem' }}>
                              {tweet.author_username.charAt(0).toUpperCase()}
                            </span>
                            <strong>{tweet.author_name}</strong>
                            <span>@{tweet.author_username}</span>
                            <span>•</span>
                            <span>{new Date(tweet.created_at).toLocaleTimeString()}</span>
                          </div>

                          <span className="badge badge-gray" style={{ background: 'rgba(29, 155, 240, 0.1)', color: 'var(--primary)', borderColor: 'rgba(29,155,240,0.2)' }}>
                            Match: "{tweet.keyword}"
                          </span>
                        </div>

                        <p className="match-text">{tweet.text}</p>

                        <div className="match-footer">
                          <div className="match-stat">
                            <ThumbsUp size={12} />
                            {tweet.likes.toLocaleString()}
                          </div>
                          <div className="match-stat">
                            <Repeat size={12} />
                            {tweet.retweets.toLocaleString()}
                          </div>
                          <div className="match-stat">
                            <MessageSquare size={12} />
                            {tweet.replies.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW 4: POST PERFORMANCE ANALYTICS */}
        {/* ============================================================== */}
        {activeTab === 'analytics' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h2 style={{ fontSize: '1.75rem', marginBottom: '4px' }}>Post Metrics & Engagement Visualizer</h2>
                <p style={{ color: 'var(--text-secondary)' }}>Monitor impression metrics, aggregate engagement rates, and map optimal scheduling timeframes.</p>
              </div>

              <button className="btn btn-primary" onClick={() => fetchAnalyticsData(true)} disabled={loadingAnalytics}>
                <RefreshCw size={14} className={loadingAnalytics ? 'spin' : ''} />
                Refresh Metric Logs
              </button>
            </div>

            {loadingAnalytics ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '120px 0', gap: '12px' }}>
                <div className="spinner" />
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Analyzing metric payloads...</div>
              </div>
            ) : !analyticsData ? (
              <div style={{ textAlign: 'center', padding: '100px 0', color: 'var(--text-muted)' }}>
                No performance records logged yet. Sync X or populate posts.
              </div>
            ) : (
              <div>
                {/* Stat cards summary */}
                <div className="grid-4" style={{ marginBottom: '24px' }}>
                  <div className="stat-card">
                    <div className="stat-label">
                      <Eye size={14} /> Total Impressions
                    </div>
                    <div className="stat-value">{analyticsData.summary.impressions.toLocaleString()}</div>
                    <div className="stat-change up">Across {analyticsData.summary.totalPosts} posts</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-label">
                      <ThumbsUp size={14} /> Total Engagements
                    </div>
                    <div className="stat-value">{analyticsData.summary.totalEngagement.toLocaleString()}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Likes, RTs, Replies combined</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-label">
                      <Layers size={14} /> Avg. Engagement Rate
                    </div>
                    <div className="stat-value">{analyticsData.summary.avgEngagementRate}%</div>
                    <div className="stat-change up">Industry baseline: 1.5%</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-label">
                      <ExternalLink size={14} /> Profile Clicks
                    </div>
                    <div className="stat-value">{analyticsData.summary.profile_clicks.toLocaleString()}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>CTR: {
                      analyticsData.summary.impressions > 0 
                        ? ((analyticsData.summary.profile_clicks / analyticsData.summary.impressions) * 100).toFixed(2)
                        : '0.00'
                    }%</div>
                  </div>
                </div>

                <div className="grid-2" style={{ gridTemplateColumns: '5fr 3fr', gap: '24px', marginBottom: '24px' }}>
                  {/* Daily Trend line chart */}
                  <div className="panel">
                    <h3 className="panel-title" style={{ fontSize: '1.1rem', marginBottom: '10px' }}>
                      Engagement & Impressions Trend Lines (Last 14 Days)
                    </h3>
                    {renderTrendChart()}
                  </div>

                  {/* Hourly Peak traffic bars */}
                  <div className="panel">
                    <h3 className="panel-title" style={{ fontSize: '1.1rem', marginBottom: '10px' }}>
                      Optimal Posting Time Analyzer
                    </h3>
                    {renderHourlyChart()}
                  </div>
                </div>

                {/* Top Tweets table */}
                <div className="panel" style={{ padding: '0' }}>
                  <div className="panel-header" style={{ padding: '20px 24px 14px', marginBottom: '0' }}>
                    <h3 className="panel-title">Top 5 Performing User-Authored Tweets</h3>
                  </div>

                  <div className="table-wrapper" style={{ border: 'none' }}>
                    <table className="datatable">
                      <thead>
                        <tr>
                          <th>Tweet Content</th>
                          <th>Impressions</th>
                          <th>Likes</th>
                          <th>Retweets</th>
                          <th>Profile Clicks</th>
                          <th>Engagement Rate</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analyticsData.topTweets.map(p => (
                          <tr key={p.tweet_id}>
                            <td style={{ fontSize: '0.85rem', maxWidth: '350px', lineBreak: 'strict' }}>
                              {p.text}
                            </td>
                            <td>{p.impressions.toLocaleString()}</td>
                            <td>{p.likes}</td>
                            <td>{p.retweets}</td>
                            <td>{p.profile_clicks}</td>
                            <td style={{ fontWeight: 'bold', color: 'var(--primary)' }}>
                              {p.impressions > 0 ? (((p.likes + p.retweets + p.replies) / p.impressions) * 100).toFixed(2) : 0}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW 5: TWEET COMPOSER (FREE TIER COMPLIANT) */}
        {/* ============================================================== */}
        {activeTab === 'composer' && (
          <div>
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.75rem', marginBottom: '4px' }}>Tweet Composer & Local Posted Logs</h2>
              <p style={{ color: 'var(--text-secondary)' }}>Compose and publish tweets directly to X v2 using OAuth 1.0a User Context (Free Tier Compliant).</p>
            </div>

            <div className="grid-2" style={{ gridTemplateColumns: '3.2fr 2.8fr', gap: '24px' }}>
              {/* Composer Box */}
              <div className="panel">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', borderBottom: '1px solid var(--panel-border)', paddingBottom: '14px' }}>
                  {profileDetails.profile_image_url ? (
                    <img 
                      src={profileDetails.profile_image_url} 
                      alt={profileDetails.username} 
                      style={{ width: '40px', height: '40px', borderRadius: '50%' }} 
                    />
                  ) : (
                    <div className="avatar" style={{ width: '40px', height: '40px' }}>
                      {profileDetails.name ? profileDetails.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                  <div>
                    <div style={{ fontWeight: 'bold' }}>{profileDetails.name || 'Account Details'}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>@{profileDetails.username || 'unknown'}</div>
                  </div>
                  <span className="badge badge-active" style={{ marginLeft: 'auto', fontSize: '0.7rem' }}>Free Tier Available</span>
                </div>

                <form onSubmit={handlePostTweet}>
                  <div className="form-group" style={{ marginBottom: '12px' }}>
                    <textarea
                      className="input-text"
                      style={{ height: '140px', resize: 'none', fontFamily: 'inherit', fontSize: '1.05rem', lineHeight: '1.5', padding: '14px' }}
                      placeholder="What's happening? (Post directly to your X timeline)"
                      maxLength={280}
                      value={newTweetText}
                      onChange={(e) => setNewTweetText(e.target.value)}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ 
                        fontSize: '0.8rem', 
                        fontWeight: '600', 
                        color: newTweetText.length > 260 ? 'var(--accent-red)' : newTweetText.length > 240 ? 'var(--accent-orange)' : 'var(--text-secondary)'
                      }}>
                        {280 - newTweetText.length} characters left
                      </span>
                    </div>

                    <button 
                      type="submit" 
                      className="btn btn-primary" 
                      disabled={postingTweet || !newTweetText.trim()}
                      style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '130px' }}
                    >
                      {postingTweet ? (
                        <>
                          <div className="spinner" style={{ width: '14px', height: '14px', borderWidth: '2px' }} />
                          <span>Publishing...</span>
                        </>
                      ) : (
                        <>
                          <Send size={14} />
                          <span>Post Tweet</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* History Log of posted tweets */}
              <div className="panel" style={{ display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', borderBottom: '1px solid var(--panel-border)', paddingBottom: '10px' }}>
                  Locally Logged Posted Feed
                </h3>

                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '400px' }}>
                  {loadingTweets ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 0', gap: '10px' }}>
                      <div className="spinner" style={{ width: '18px', height: '18px' }} />
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Loading feed logs...</span>
                    </div>
                  ) : postedTweets.length === 0 ? (
                    <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', padding: '40px 0' }}>
                      No tweets posted through AuraX yet. Write one on the left!
                    </div>
                  ) : (
                    postedTweets.map(p => (
                      <div 
                        key={p.tweet_id} 
                        style={{ 
                          padding: '14px', 
                          background: 'rgba(255,255,255,0.01)', 
                          border: '1px solid var(--panel-border)',
                          borderRadius: '8px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '8px'
                        }}
                      >
                        <div style={{ fontSize: '0.9rem', lineHeight: '1.4', wordBreak: 'break-word' }}>
                          {p.text}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                            ID: {p.tweet_id.substring(0, 12)}... • {new Date(p.created_at).toLocaleString()}
                          </span>
                          <button 
                            className="btn btn-danger" 
                            style={{ padding: '4px 8px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }} 
                            onClick={() => handleDeleteTweet(p.tweet_id)}
                          >
                            <Trash2 size={12} />
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW 6: SETTINGS & LOCAL CONFIGURATION */}
        {/* ============================================================== */}
        {activeTab === 'settings' && (
          <div className="panel" style={{ maxWidth: '750px', margin: '0 auto' }}>
            <div style={{ borderBottom: '1px solid var(--panel-border)', paddingBottom: '14px', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '4px' }}>Local Configuration Settings</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Configure Twitter Developer Credentials. This will write direct variables to the local <code>.env</code> file in the project folder.</p>
            </div>

            <form onSubmit={handleSaveSettings}>
              
              <div style={{ background: 'rgba(29, 155, 240, 0.05)', border: '1px solid rgba(29, 155, 240, 0.15)', borderRadius: '8px', padding: '16px', marginBottom: '24px' }}>
                <h4 style={{ fontSize: '0.9rem', marginBottom: '8px', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Info size={16} /> How to obtain X Developer Credentials:
                </h4>
                <ol style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', paddingLeft: '20px', lineHeight: '1.6' }}>
                  <li>Go to the <a href="https://developer.twitter.com/en/portal/dashboard" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>X Developer Portal</a> and create a Project.</li>
                  <li>Enable <strong>User authentication settings</strong> in your App settings (Required for unfollowing/muting):
                    <ul style={{ paddingLeft: '16px', listStyleType: 'circle' }}>
                      <li>App permissions: <strong>Read and Write</strong></li>
                      <li>Type of App: <strong>Web App, Automated App or Bot</strong></li>
                      <li>Callback URI: <code>http://localhost:3000</code></li>
                      <li>Website URL: <code>http://localhost:3000</code></li>
                    </ul>
                  </li>
                  <li>Generate and copy: <strong>API Key & Secret</strong> (Consumer Key/Secret), <strong>Access Token & Secret</strong> (OAuth 1.0a User Context), and the <strong>Bearer Token</strong> (OAuth 2.0 App Only).</li>
                  <li>Retrieve your account's numeric User ID (using an online converter tool like <code>tweeterid.com</code> or looking up your handle details).</li>
                </ol>
              </div>

              <div className="form-group">
                <label className="form-label">X API Key (Consumer Key)</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type={showSecrets.consumerKey ? "text" : "password"} 
                    className="input-text" 
                    style={{ paddingRight: '40px' }}
                    placeholder="Paste Consumer Key..."
                    value={settingsForm.TWITTER_CONSUMER_KEY}
                    onChange={(e) => setSettingsForm({ ...settingsForm, TWITTER_CONSUMER_KEY: e.target.value })}
                  />
                  <button 
                    type="button" 
                    onClick={() => toggleSecretVisibility('consumerKey')}
                    style={{ 
                      position: 'absolute', 
                      right: '12px', 
                      top: '50%', 
                      transform: 'translateY(-50%)', 
                      background: 'none', 
                      border: 'none', 
                      color: 'var(--text-secondary)', 
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '4px'
                    }}
                  >
                    {showSecrets.consumerKey ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">X API Secret (Consumer Secret)</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type={showSecrets.consumerSecret ? "text" : "password"} 
                    className="input-text" 
                    style={{ paddingRight: '40px' }}
                    placeholder="Paste Consumer Secret..."
                    value={settingsForm.TWITTER_CONSUMER_SECRET}
                    onChange={(e) => setSettingsForm({ ...settingsForm, TWITTER_CONSUMER_SECRET: e.target.value })}
                  />
                  <button 
                    type="button" 
                    onClick={() => toggleSecretVisibility('consumerSecret')}
                    style={{ 
                      position: 'absolute', 
                      right: '12px', 
                      top: '50%', 
                      transform: 'translateY(-50%)', 
                      background: 'none', 
                      border: 'none', 
                      color: 'var(--text-secondary)', 
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '4px'
                    }}
                  >
                    {showSecrets.consumerSecret ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">X Access Token (User Context)</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type={showSecrets.accessToken ? "text" : "password"} 
                    className="input-text" 
                    style={{ paddingRight: '40px' }}
                    placeholder="Paste Access Token..."
                    value={settingsForm.TWITTER_ACCESS_TOKEN}
                    onChange={(e) => setSettingsForm({ ...settingsForm, TWITTER_ACCESS_TOKEN: e.target.value })}
                  />
                  <button 
                    type="button" 
                    onClick={() => toggleSecretVisibility('accessToken')}
                    style={{ 
                      position: 'absolute', 
                      right: '12px', 
                      top: '50%', 
                      transform: 'translateY(-50%)', 
                      background: 'none', 
                      border: 'none', 
                      color: 'var(--text-secondary)', 
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '4px'
                    }}
                  >
                    {showSecrets.accessToken ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">X Access Token Secret (User Context)</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type={showSecrets.accessSecret ? "text" : "password"} 
                    className="input-text" 
                    style={{ paddingRight: '40px' }}
                    placeholder="Paste Access Token Secret..."
                    value={settingsForm.TWITTER_ACCESS_TOKEN_SECRET}
                    onChange={(e) => setSettingsForm({ ...settingsForm, TWITTER_ACCESS_TOKEN_SECRET: e.target.value })}
                  />
                  <button 
                    type="button" 
                    onClick={() => toggleSecretVisibility('accessSecret')}
                    style={{ 
                      position: 'absolute', 
                      right: '12px', 
                      top: '50%', 
                      transform: 'translateY(-50%)', 
                      background: 'none', 
                      border: 'none', 
                      color: 'var(--text-secondary)', 
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '4px'
                    }}
                  >
                    {showSecrets.accessSecret ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">X Bearer Token (App-Only Context)</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type={showSecrets.bearerToken ? "text" : "password"} 
                    className="input-text" 
                    style={{ paddingRight: '40px' }}
                    placeholder="Paste Bearer Token..."
                    value={settingsForm.TWITTER_BEARER_TOKEN}
                    onChange={(e) => setSettingsForm({ ...settingsForm, TWITTER_BEARER_TOKEN: e.target.value })}
                  />
                  <button 
                    type="button" 
                    onClick={() => toggleSecretVisibility('bearerToken')}
                    style={{ 
                      position: 'absolute', 
                      right: '12px', 
                      top: '50%', 
                      transform: 'translateY(-50%)', 
                      background: 'none', 
                      border: 'none', 
                      color: 'var(--text-secondary)', 
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '4px'
                    }}
                  >
                    {showSecrets.bearerToken ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Your X Account User ID (Numeric ID)</label>
                <input 
                  type="text" 
                  className="input-text" 
                  placeholder="e.g. 1234567890"
                  value={settingsForm.TWITTER_USER_ID}
                  onChange={(e) => setSettingsForm({ ...settingsForm, TWITTER_USER_ID: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Your X Handle (@username)</label>
                <input 
                  type="text" 
                  className="input-text" 
                  placeholder="e.g. twitter_dev (without the @)"
                  value={settingsForm.TWITTER_USER_HANDLE}
                  onChange={(e) => setSettingsForm({ ...settingsForm, TWITTER_USER_HANDLE: e.target.value })}
                />
              </div>

              {settingsMessage && (
                <div style={{ 
                  padding: '12px', 
                  borderRadius: '6px', 
                  fontSize: '0.85rem',
                  marginBottom: '16px',
                  backgroundColor: settingsMessage.startsWith('Error') ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                  color: settingsMessage.startsWith('Error') ? 'var(--accent-red)' : 'var(--accent-green)',
                  border: settingsMessage.startsWith('Error') ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid rgba(16, 185, 129, 0.2)'
                }}>
                  {settingsMessage}
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={savingSettings}>
                  {savingSettings ? 'Writing Env Settings...' : 'Save credentials & Connect'}
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => {
                    if (confirm("Are you sure you want to delete all local variables and reset the sandbox?")) {
                      setSettingsForm({ TWITTER_CONSUMER_KEY: '', TWITTER_CONSUMER_SECRET: '', TWITTER_ACCESS_TOKEN: '', TWITTER_ACCESS_TOKEN_SECRET: '', TWITTER_BEARER_TOKEN: '', TWITTER_USER_ID: '' });
                      fetch('/api/config', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({})
                      }).then(() => fetchConfig());
                    }
                  }}
                >
                  Reset Env
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

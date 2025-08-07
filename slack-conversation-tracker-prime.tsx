import { useState, useEffect } from 'react';
import { MessageSquare, Users, Clock, Hash, TrendingUp, Search, Filter, Download, Settings, Bot, Eye, BarChart3, MessageCircle, Calendar, ArrowRight, Zap, Activity, Brain, Network, AlertTriangle, Sparkles, Mic, Play, Pause, Share2, Bell, Shield, Cpu, GitBranch, Target, Lock, Flame, Star, Send, FileText, X, CheckCircle } from 'lucide-react';

const SlackConversationTracker = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedChannel, setSelectedChannel] = useState('all');
  const [timeRange, setTimeRange] = useState('7d');
  const [searchQuery, setSearchQuery] = useState('');
  const [isStreamingActive, setIsStreamingActive] = useState(true);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [chatQuery, setChatQuery] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isProcessingQuery, setIsProcessingQuery] = useState(false);
  
  // Real-time streaming simulation
  const [streamingData, setStreamingData] = useState({
    currentMessage: '',
    activeSpeaker: '',
    sentiment: 'neutral',
    confidence: 0,
    topics: []
  });

  // Process contextual query for selected conversation
  const processContextualQuery = async (query) => {
    if (!selectedConversation) return;
    
    setIsProcessingQuery(true);
    setChatQuery('');
    
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: query,
      timestamp: new Date().toISOString()
    };
    
    setChatHistory(prev => [...prev, userMessage]);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Check if query is relevant to the selected conversation
    const conversationTopics = selectedConversation.keyTopics.join(' ').toLowerCase();
    const queryWords = query.toLowerCase().split(' ');
    const conversationSummary = selectedConversation.aiSummary.toLowerCase();
    const conversationTitle = selectedConversation.title.toLowerCase();
    
    const hasTopicMatch = queryWords.some(word => conversationTopics.includes(word));
    const hasSummaryMatch = queryWords.some(word => conversationSummary.includes(word));
    const hasTitleMatch = queryWords.some(word => conversationTitle.includes(word));
    const hasContextKeywords = ['who', 'what', 'when', 'why', 'how', 'decision', 'rationale'].some(keyword => query.toLowerCase().includes(keyword));
    
    const isRelevant = hasTopicMatch || hasSummaryMatch || hasTitleMatch || hasContextKeywords;
    
    let aiResponse;
    
    if (!isRelevant) {
      aiResponse = {
        id: Date.now() + 1,
        type: 'ai',
        content: `I can only answer questions about "${selectedConversation.title}" discussion. Your query seems to be about something else. Please ask about topics related to: ${selectedConversation.keyTopics.join(', ')}.`,
        timestamp: new Date().toISOString(),
        responseType: 'context_violation',
        confidence: 0,
        conversationId: selectedConversation.id
      };
    } else {
      const responses = [
        {
          content: `Based on the "${selectedConversation.title}" discussion, ${selectedConversation.participants.join(' and ')} decided to proceed with ${selectedConversation.keyTopics[0]}. The main rationale was ${selectedConversation.aiSummary.split('.')[0].toLowerCase()}.`,
          confidence: 0.92
        },
        {
          content: `In this conversation, the team discussed ${selectedConversation.keyTopics.slice(0, 3).join(', ')}. ${selectedConversation.participants[0]} mentioned that the primary concern was about ${selectedConversation.keyTopics[0]}, which aligns with the ${selectedConversation.priority} priority level assigned to this discussion.`,
          confidence: 0.88
        }
      ];
      
      const selectedResponse = responses[Math.floor(Math.random() * responses.length)];
      
      aiResponse = {
        id: Date.now() + 1,
        type: 'ai',
        content: selectedResponse.content,
        timestamp: new Date().toISOString(),
        responseType: 'answer',
        confidence: selectedResponse.confidence,
        conversationId: selectedConversation.id,
        sources: [`${selectedConversation.channel} - ${formatTime(selectedConversation.startTime)}`],
        relatedTopics: selectedConversation.keyTopics.slice(0, 3)
      };
    }
    
    setChatHistory(prev => [...prev, aiResponse]);
    setIsProcessingQuery(false);
  };

  // Advanced AI insights
  const aiInsights = {
    trending: ['database migration', 'security audit', 'mobile performance'],
    actionItems: [
      { task: 'Update PostgreSQL schema', assignee: '@mike', deadline: '2024-08-10' },
      { task: 'Security vulnerability fix', assignee: '@sarah', deadline: '2024-08-09' },
      { task: 'Mobile app optimization', assignee: '@alex', deadline: '2024-08-12' }
    ],
    riskAlerts: [
      { level: 'high', message: 'Critical security discussion detected in #engineering', channel: '#engineering' },
      { level: 'medium', message: 'Deadline approaching for Q4 planning', channel: '#product' }
    ],
    teamDynamics: {
      collaborationScore: 8.5,
      responseTime: '12m',
      participationBalance: 'good',
      knowledgeSharing: 'active'
    }
  };

  // Industry-grade channels
  const channels = [
    { 
      id: 'engineering', 
      name: '#engineering', 
      memberCount: 12, 
      messageCount: 156, 
      active: true,
      aiEnabled: true,
      securityLevel: 'high',
      realtimeUsers: 4,
      threadCount: 23
    },
    { 
      id: 'product', 
      name: '#product', 
      memberCount: 8, 
      messageCount: 89, 
      active: true,
      aiEnabled: true,
      securityLevel: 'medium',
      realtimeUsers: 2,
      threadCount: 15
    }
  ];

  // Advanced conversation data
  const conversations = [
    {
      id: 1,
      channel: '#engineering',
      title: 'Database migration strategy discussion',
      participants: ['@sarah', '@mike', '@alex'],
      messageCount: 23,
      threadCount: 3,
      startTime: '2024-08-07T09:15:00Z',
      lastActivity: '2024-08-07T11:30:00Z',
      category: 'technical',
      priority: 'high',
      sentiment: { positive: 0.7, neutral: 0.2, negative: 0.1 },
      aiSummary: 'Team discussed migrating from PostgreSQL to MongoDB for better horizontal scaling. Decision made to proceed with gradual migration starting next sprint.',
      actionItems: 2,
      keyTopics: ['database', 'migration', 'postgresql', 'mongodb', 'scaling'],
      riskLevel: 'medium',
      aiConfidence: 0.92,
      businessImpact: 'high'
    },
    {
      id: 2,
      channel: '#product',
      title: 'Q4 Feature prioritization with stakeholder input',
      participants: ['@emma', '@david', '@lisa', '@john'],
      messageCount: 34,
      threadCount: 5,
      startTime: '2024-08-07T14:20:00Z',
      lastActivity: '2024-08-07T16:45:00Z',
      category: 'planning',
      priority: 'high',
      sentiment: { positive: 0.5, neutral: 0.4, negative: 0.1 },
      aiSummary: 'Product team aligned on Q4 feature priorities with stakeholder feedback. Mobile app improvements and security enhancements ranked highest.',
      actionItems: 4,
      keyTopics: ['roadmap', 'features', 'priorities', 'q4', 'mobile', 'security'],
      riskLevel: 'low',
      aiConfidence: 0.88,
      businessImpact: 'very high'
    }
  ];

  // Advanced stats
  const stats = {
    totalMessages: 1247,
    activeChannels: 5,
    participatingUsers: 47,
    conversationsTracked: 89,
    avgResponseTime: '12m',
    topChannel: '#engineering',
    aiProcessingRate: '99.2%',
    realTimeUsers: 7,
    activeThreads: 12,
    automatedInsights: 34,
    securityAlerts: 2
  };

  // Streaming data simulation
  useEffect(() => {
    if (isStreamingActive) {
      const interval = setInterval(() => {
        setStreamingData({
          currentMessage: `Real-time message processing... Topic: ${['database', 'security', 'features'][Math.floor(Math.random() * 3)]}`,
          activeSpeaker: ['@sarah', '@mike', '@alex', '@emma'][Math.floor(Math.random() * 4)],
          sentiment: ['positive', 'neutral', 'negative'][Math.floor(Math.random() * 3)],
          confidence: Math.random() * 0.3 + 0.7,
          topics: ['technical discussion', 'planning', 'feedback'][Math.floor(Math.random() * 3)]
        });
      }, 2000);
      
      return () => clearInterval(interval);
    }
  }, [isStreamingActive]);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const getSentimentColor = (sentiment) => {
    if (typeof sentiment === 'object') {
      const dominant = Object.keys(sentiment).reduce((a, b) => sentiment[a] > sentiment[b] ? a : b);
      switch(dominant) {
        case 'positive': return 'text-green-600 bg-green-100 border-green-200';
        case 'negative': return 'text-red-600 bg-red-100 border-red-200';
        default: return 'text-gray-600 bg-gray-100 border-gray-200';
      }
    }
    switch(sentiment) {
      case 'positive': return 'text-green-600 bg-green-100 border-green-200';
      case 'negative': return 'text-red-600 bg-red-100 border-red-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'text-red-600 bg-red-100 border-red-200';
      case 'medium': return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'low': return 'text-green-600 bg-green-100 border-green-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getRiskColor = (risk) => {
    switch(risk) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-orange-600 bg-orange-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Advanced Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-8 h-8 bg-gradient-to-r from-violet-500 via-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  {isStreamingActive && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse border-2 border-white"></div>
                  )}
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                    SlackTracker AI
                  </h1>
                  <div className="text-xs text-gray-500 flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${isStreamingActive ? 'bg-green-400' : 'bg-red-400'}`}></div>
                    <span>{isStreamingActive ? 'Live Processing' : 'Offline'}</span>
                    <span>•</span>
                    <span>{stats.realTimeUsers} active users</span>
                  </div>
                </div>
              </div>
              
              <nav className="hidden md:flex items-center space-x-1 bg-gray-100/80 rounded-xl p-1 backdrop-blur-sm">
                {[
                  { key: 'dashboard', label: 'Dashboard', icon: BarChart3 },
                  { key: 'conversations', label: 'Conversations', icon: MessageSquare },
                  { key: 'ai-insights', label: 'AI Insights', icon: Brain },
                  { key: 'security', label: 'Security', icon: Shield }
                ].map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                      activeTab === key 
                        ? 'bg-white text-gray-900 shadow-md ring-1 ring-purple-100' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{label}</span>
                  </button>
                ))}
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsStreamingActive(!isStreamingActive)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  isStreamingActive 
                    ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {isStreamingActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isStreamingActive ? 'Live' : 'Paused'}</span>
              </button>
              
              <div className="flex items-center space-x-2 px-3 py-2 bg-purple-100 text-purple-700 rounded-lg">
                <Cpu className="w-4 h-4" />
                <span className="text-sm font-medium">{stats.aiProcessingRate}</span>
              </div>
              
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
        
        {isStreamingActive && (
          <div className="bg-gradient-to-r from-violet-500 to-blue-500 h-1">
            <div className="h-full bg-gradient-to-r from-white/20 to-white/40 animate-pulse"></div>
          </div>
        )}
      </header>

      {/* Real-time Status Banner */}
      {isStreamingActive && (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border-b border-green-200 px-4 py-2">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="font-medium text-green-700">Processing: {streamingData.currentMessage}</span>
              </div>
              <div className="text-gray-600">
                Speaker: <span className="font-medium">{streamingData.activeSpeaker}</span>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${getSentimentColor(streamingData.sentiment)}`}>
                {streamingData.sentiment} ({Math.round(streamingData.confidence * 100)}%)
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Enhanced Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {[
                { icon: MessageCircle, label: 'Messages', value: stats.totalMessages, color: 'blue', trend: '+12%' },
                { icon: Users, label: 'Active Users', value: stats.realTimeUsers, color: 'green', trend: '+3' },
                { icon: Brain, label: 'AI Insights', value: stats.automatedInsights, color: 'purple', trend: '+8' },
                { icon: Network, label: 'Active Threads', value: stats.activeThreads, color: 'orange', trend: '+5' },
                { icon: Shield, label: 'Security Alerts', value: stats.securityAlerts, color: 'red', trend: '-2' },
                { icon: Zap, label: 'Processing Rate', value: stats.aiProcessingRate, color: 'indigo', trend: '+0.1%' }
              ].map(({ icon: Icon, label, value, color, trend }, index) => (
                <div key={index} className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-lg hover:shadow-xl transition-all">
                  <div className="flex items-center justify-between">
                    <div className={`w-10 h-10 bg-${color}-100 rounded-lg flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 text-${color}-600`} />
                    </div>
                    <div className={`text-xs font-medium ${trend.startsWith('+') ? 'text-green-600' : trend.startsWith('-') ? 'text-red-600' : 'text-gray-600'}`}>
                      {trend}
                    </div>
                  </div>
                  <div className="mt-3">
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                    <p className="text-xs text-gray-600">{label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* AI Risk Alerts */}
            {aiInsights.riskAlerts.length > 0 && (
              <div className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-400 rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                  <h3 className="text-lg font-semibold text-red-800">AI Risk Detection</h3>
                </div>
                <div className="space-y-3">
                  {aiInsights.riskAlerts.map((alert, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white/60 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${alert.level === 'high' ? 'bg-red-500' : 'bg-orange-500'}`}></div>
                        <span className="text-gray-800">{alert.message}</span>
                        <span className="text-xs text-gray-500">{alert.channel}</span>
                      </div>
                      <button className="text-xs bg-white px-3 py-1 rounded-lg hover:bg-gray-50">
                        Review
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Conversations */}
            <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Recent Conversations</h2>
                <p className="text-sm text-gray-600 mt-1">Latest tracked discussions with AI analysis</p>
              </div>
              
              <div className="divide-y divide-gray-100">
                {conversations.map(conv => (
                  <div key={conv.id} className="p-6 hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-sm font-medium text-indigo-600">{conv.channel}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(conv.priority)}`}>
                            {conv.priority} priority
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(conv.riskLevel)}`}>
                            {conv.riskLevel} risk
                          </span>
                        </div>
                        
                        <h3 className="text-base font-medium text-gray-900 mb-2">{conv.title}</h3>
                        <p className="text-sm text-gray-600 mb-3">{conv.aiSummary}</p>
                        
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <Users className="w-3 h-3" />
                              <span>{conv.participants.join(', ')}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MessageSquare className="w-3 h-3" />
                              <span>{conv.messageCount} messages</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{formatTime(conv.startTime)}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={() => setSelectedConversation(conv)}
                              className="text-purple-600 hover:text-purple-800 flex items-center space-x-1"
                            >
                              <MessageCircle className="w-4 h-4" />
                              <span>Open Chat</span>
                            </button>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-1">
                          {conv.keyTopics.map(topic => (
                            <span key={topic} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs">
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'conversations' && (
          <div className="space-y-6">
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div className="flex-1 max-w-2xl">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search conversations with AI..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-11 pr-4 py-3 w-full border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <button className="flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <Filter className="w-4 h-4" />
                    <span>Filter</span>
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg">
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {conversations.map(conv => (
                <div key={conv.id} className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg hover:shadow-xl transition-all p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                        <MessageSquare className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{conv.title}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-sm font-medium text-indigo-600">{conv.channel}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(conv.priority)}`}>
                            {conv.priority}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <div>AI Confidence: {Math.round(conv.aiConfidence * 100)}%</div>
                      <div>Impact: {conv.businessImpact}</div>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4">{conv.aiSummary}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      {conv.keyTopics.map(topic => (
                        <span key={topic} className="px-3 py-1 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 rounded-full text-xs font-medium">
                          {topic}
                        </span>
                      ))}
                    </div>
                    <button 
                      onClick={() => setSelectedConversation(conv)}
                      className="flex items-center space-x-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Open Chat</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'ai-insights' && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                AI-Powered Insights
              </h2>
              <p className="text-gray-600">Advanced analysis of team communication patterns</p>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Trending Topics</h3>
                <Flame className="w-6 h-6 text-orange-500" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {aiInsights.trending.map((topic, index) => (
                  <div key={index} className="p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border border-orange-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-900 capitalize">{topic}</span>
                      <div className="flex items-center space-x-1 text-orange-600">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-sm">+{Math.floor(Math.random() * 50) + 10}</span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      {Math.floor(Math.random() * 20) + 5} mentions today
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border border-purple-200 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Sparkles className="w-6 h-6 text-purple-600" />
                <h3 className="text-xl font-semibold text-purple-900">AI Recommendations</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/60 p-4 rounded-xl">
                  <div className="flex items-center space-x-2 mb-2">
                    <Target className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-gray-900">Improve Response Times</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Consider automated acknowledgments to improve 15-minute average response time.
                  </p>
                </div>
                <div className="bg-white/60 p-4 rounded-xl">
                  <div className="flex items-center space-x-2 mb-2">
                    <Users className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-gray-900">Balance Participation</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Encourage broader participation as 3 members contribute 70% of messages.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Security Dashboard</h2>
              <p className="text-gray-600">Monitor sensitive discussions and compliance</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: Shield, label: 'Security Level', value: 'High', status: 'success' },
                { icon: Lock, label: 'Encrypted Channels', value: '3/5', status: 'warning' },
                { icon: AlertTriangle, label: 'Risk Alerts', value: '2', status: 'error' },
                { icon: Eye, label: 'Monitored Channels', value: '5/5', status: 'success' }
              ].map(({ icon: Icon, label, value, status }, index) => (
                <div key={index} className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      status === 'success' ? 'bg-green-100' : 
                      status === 'warning' ? 'bg-orange-100' : 'bg-red-100'
                    }`}>
                      <Icon className={`w-5 h-5 ${
                        status === 'success' ? 'text-green-600' : 
                        status === 'warning' ? 'text-orange-600' : 'text-red-600'
                      }`} />
                    </div>
                  </div>
                  <div className="mt-3">
                    <p className="text-lg font-bold text-gray-900">{value}</p>
                    <p className="text-xs text-gray-600">{label}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Security Alerts</h3>
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <div className="space-y-3">
                {aiInsights.riskAlerts.map((alert, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${alert.level === 'high' ? 'bg-red-500' : 'bg-orange-500'}`}></div>
                      <div>
                        <p className="font-medium text-gray-900">{alert.message}</p>
                        <p className="text-sm text-gray-500">{alert.channel}</p>
                      </div>
                    </div>
                    <button className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm">
                      Investigate
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Context-Locked Chat Modal */}
      {selectedConversation && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col">
            {/* Chat Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50 rounded-t-2xl">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Chat: {selectedConversation.title}
                  </h3>
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <span>{selectedConversation.channel}</span>
                    <span>•</span>
                    <div className="flex items-center space-x-1">
                      <Lock className="w-3 h-3" />
                      <span>Context-locked</span>
                    </div>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => {
                  setSelectedConversation(null);
                  setChatHistory([]);
                  setChatQuery('');
                }}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Context Info Bar */}
            <div className="px-6 py-3 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-blue-100">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-green-600" />
                    <span className="text-green-700 font-medium">Context Protected</span>
                  </div>
                  <div className="text-gray-600">
                    Topics: {selectedConversation.keyTopics.slice(0, 3).join(', ')}
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Brain className="w-4 h-4" />
                  <span>AI Confidence: {Math.round(selectedConversation.aiConfidence * 100)}%</span>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {chatHistory.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-8 h-8 text-purple-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    Ask about this conversation
                  </h4>
                  <p className="text-gray-600 max-w-md mx-auto mb-6">
                    I can only answer questions related to "{selectedConversation.title}". 
                    Ask about decisions, participants, timeline, or technical details.
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {[
                      "What was the main decision?",
                      "Who were the key participants?",
                      "What were the action items?",
                      "Why was this approach chosen?"
                    ].map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => setChatQuery(suggestion)}
                        className="px-3 py-2 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 rounded-lg hover:from-purple-200 hover:to-blue-200 transition-all text-sm"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {chatHistory.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.type === 'user'
                        ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                        : message.responseType === 'context_violation'
                        ? 'bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 text-orange-800'
                        : 'bg-gray-50 border border-gray-200 text-gray-900'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    {message.type === 'ai' && message.responseType === 'answer' && (
                      <div className="mt-3 pt-3 border-t border-gray-200/50">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-1">
                              <Brain className="w-3 h-3" />
                              <span>Confidence: {Math.round(message.confidence * 100)}%</span>
                            </div>
                            {message.sources && (
                              <div className="flex items-center space-x-1">
                                <FileText className="w-3 h-3" />
                                <span>Source: {message.sources[0]}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        {message.relatedTopics && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {message.relatedTopics.map((topic, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs"
                              >
                                {topic}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                    {message.type === 'ai' && message.responseType === 'context_violation' && (
                      <div className="mt-3 pt-3 border-t border-orange-200">
                        <div className="flex items-center space-x-2 text-xs text-orange-700">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Context protection active</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isProcessingQuery && (
                <div className="flex justify-start">
                  <div className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 max-w-[80%]">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                      <span className="text-sm text-gray-600">Analyzing conversation context...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="p-6 border-t border-gray-200 bg-gray-50/50">
              <div className="flex items-center space-x-4">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={chatQuery}
                    onChange={(e) => setChatQuery(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !isProcessingQuery && chatQuery.trim()) {
                        processContextualQuery(chatQuery.trim());
                      }
                    }}
                    placeholder={`Ask about "${selectedConversation.title}"...`}
                    disabled={isProcessingQuery}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                    <Lock className="w-4 h-4 text-gray-400" />
                    <Brain className="w-4 h-4 text-purple-500" />
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (chatQuery.trim() && !isProcessingQuery) {
                      processContextualQuery(chatQuery.trim());
                    }
                  }}
                  disabled={!chatQuery.trim() || isProcessingQuery}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 transition-all flex items-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Ask</span>
                </button>
              </div>
              <div className="text-xs text-gray-500 mt-2 text-center">
                🔒 This chat is context-locked to prevent information leakage between conversations
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SlackConversationTracker;
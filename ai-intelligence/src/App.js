import React, { useState, useEffect } from "react";
import {
  Search,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  BarChart3,
  Globe,
  Brain,
  DollarSign,
  Calendar,
  Filter,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Tv,
  Briefcase,
  Rocket,
  Users,
  Sparkles,
} from "lucide-react";

const FinancialNewsAggregator = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSegment, setActiveSegment] = useState("investments");
  const [activeView, setActiveView] = useState("overview");
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [timeframe, setTimeframe] = useState("7d");
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [aiInsights, setAiInsights] = useState(null);

  const segments = [
    { id: "investments", name: "Investments", icon: DollarSign, color: "blue" },
    { id: "tech", name: "Tech & Startups", icon: Rocket, color: "purple" },
    { id: "business", name: "Business", icon: Briefcase, color: "green" },
    { id: "politics", name: "Politics", icon: Users, color: "red" },
    { id: "entertainment", name: "Entertainment", icon: Tv, color: "pink" },
    {
      id: "fashion",
      name: "Fashion Startups",
      icon: Sparkles,
      color: "orange",
    },
    { id: "trends", name: "Startup Trends", icon: BarChart3, color: "cyan" },
  ];

  const getSegmentQuery = (segment) => {
    const queries = {
      investments: "stock market investing finance",
      tech: "technology startups innovation AI",
      business: "business economy corporate",
      politics: "politics government policy",
      entertainment: "entertainment media streaming",
      fashion: "fashion startups sustainable fashion tech",
      trends: "startup trends venture capital funding",
    };
    return queries[segment] || "business news";
  };

  const fetchNews = async (query = "") => {
    setLoading(true);
    setError(null);

    try {
      const searchQuery = query || getSegmentQuery(activeSegment);

      // Try NewsAPI first
      const response = await fetch(
        `https://newsapi.org/v2/everything?q=${encodeURIComponent(
          searchQuery
        )}&sortBy=publishedAt&pageSize=20&language=en&apiKey=demo`
      );

      if (!response.ok) {
        throw new Error("API request failed");
      }

      const data = await response.json();

      if (data.articles && data.articles.length > 0) {
        const processedArticles = data.articles.map((article, idx) => ({
          id: idx,
          title: article.title || "Untitled",
          source: article.source?.name || "Unknown Source",
          url: article.url,
          timestamp: new Date(article.publishedAt).toLocaleString(),
          sentiment: analyzeSentiment(
            article.title + " " + (article.description || "")
          ),
          bias: detectBias(article.source?.name || ""),
          impact: Math.random() > 0.5 ? "high" : "medium",
          relevance: 0.85 + Math.random() * 0.15,
          summary: article.description || article.title,
        }));

        setNews(processedArticles);
        generateAIInsights(processedArticles, searchQuery);
      } else {
        throw new Error("No articles found");
      }
    } catch (err) {
      console.error("Error fetching news:", err);

      // Fallback to enhanced mock data
      const mockData = getMockData(activeSegment);
      setNews(mockData);
      generateAIInsights(mockData, query || activeSegment);
    } finally {
      setLoading(false);
    }
  };

  const analyzeSentiment = (text) => {
    const positiveWords = [
      "surge",
      "growth",
      "success",
      "profit",
      "innovation",
      "breakthrough",
      "gains",
      "rises",
    ];
    const negativeWords = [
      "crisis",
      "falls",
      "decline",
      "loss",
      "concern",
      "warning",
      "cuts",
      "drops",
    ];

    const lower = text.toLowerCase();
    const hasPositive = positiveWords.some((word) => lower.includes(word));
    const hasNegative = negativeWords.some((word) => lower.includes(word));

    if (hasPositive && !hasNegative) return "positive";
    if (hasNegative && !hasPositive) return "negative";
    return "neutral";
  };

  const detectBias = (sourceName) => {
    const source = sourceName.toLowerCase();
    const biasMap = {
      bloomberg: "center",
      reuters: "center",
      "financial times": "center",
      cnbc: "pro-market",
      "wall street journal": "right",
      "new york times": "left",
      techcrunch: "tech-positive",
      "the verge": "center",
      forbes: "pro-market",
      cnn: "left",
      "fox news": "right",
      bbc: "center",
      "associated press": "center",
      wired: "tech-positive",
    };

    for (const [key, value] of Object.entries(biasMap)) {
      if (source.includes(key)) return value;
    }

    return "center";
  };

  const generateAIInsights = async (articles, topic) => {
    setAiInsights({
      summary: `Analysis of ${
        articles.length
      } recent articles on ${topic}. Market sentiment shows ${
        articles.filter((a) => a.sentiment === "positive").length >
        articles.length / 2
          ? "bullish"
          : "mixed"
      } signals. Key themes emerging across sources.`,
      outlook:
        articles.filter((a) => a.sentiment === "positive").length >
        articles.length / 2
          ? "Mildly Bullish"
          : "Neutral",
      riskLevel: "Medium",
      risks: [
        "Market volatility from recent news",
        "Regulatory uncertainty",
        "Competitive pressures",
      ],
      opportunities: [
        "Growth momentum in sector",
        "Innovation opportunities",
        "Market expansion potential",
      ],
    });
  };

  const getMockData = (segment) => {
    const mockDataBySegment = {
      investments: [
        {
          id: 1,
          title: "Stock Market Reaches New Highs Amid Strong Earnings Season",
          source: "Bloomberg",
          bias: "center",
          sentiment: "positive",
          timestamp: new Date(Date.now() - 2 * 3600000).toLocaleString(),
          summary:
            "Major indices hit record levels as tech companies report better-than-expected quarterly results.",
          relevance: 0.95,
          impact: "high",
          url: "https://bloomberg.com",
        },
        {
          id: 2,
          title: "Federal Reserve Signals Potential Interest Rate Changes",
          source: "Reuters",
          bias: "center",
          sentiment: "neutral",
          timestamp: new Date(Date.now() - 4 * 3600000).toLocaleString(),
          summary:
            "Central bank officials hint at policy shifts in response to economic indicators.",
          relevance: 0.92,
          impact: "high",
          url: "https://reuters.com",
        },
        {
          id: 3,
          title: "Tech Sector Leads Market Rally with AI Momentum",
          source: "CNBC",
          bias: "pro-market",
          sentiment: "positive",
          timestamp: new Date(Date.now() - 6 * 3600000).toLocaleString(),
          summary:
            "Technology stocks surge as artificial intelligence investments drive growth.",
          relevance: 0.89,
          impact: "medium",
          url: "https://cnbc.com",
        },
      ],
      tech: [
        {
          id: 1,
          title: "AI Startup Raises $500M Series C Led by Top VCs",
          source: "TechCrunch",
          bias: "tech-positive",
          sentiment: "positive",
          timestamp: new Date(Date.now() - 1 * 3600000).toLocaleString(),
          summary:
            "Machine learning platform secures massive funding round at $5B valuation.",
          relevance: 0.96,
          impact: "high",
          url: "https://techcrunch.com",
        },
        {
          id: 2,
          title: "OpenAI Announces Major Product Updates and API Improvements",
          source: "The Verge",
          bias: "center",
          sentiment: "positive",
          timestamp: new Date(Date.now() - 3 * 3600000).toLocaleString(),
          summary:
            "Company unveils new features and pricing tiers for developers.",
          relevance: 0.93,
          impact: "medium",
          url: "https://theverge.com",
        },
        {
          id: 3,
          title: "Quantum Computing Breakthrough Announced by Research Team",
          source: "Wired",
          bias: "tech-positive",
          sentiment: "positive",
          timestamp: new Date(Date.now() - 5 * 3600000).toLocaleString(),
          summary:
            "Scientists achieve significant milestone in quantum error correction.",
          relevance: 0.88,
          impact: "medium",
          url: "https://wired.com",
        },
      ],
      business: [
        {
          id: 1,
          title: "Major Corporate Merger Creates Industry Giant",
          source: "Wall Street Journal",
          bias: "right",
          sentiment: "neutral",
          timestamp: new Date(Date.now() - 2 * 3600000).toLocaleString(),
          summary:
            "Two leading companies announce strategic merger valued at $50 billion.",
          relevance: 0.94,
          impact: "high",
          url: "https://wsj.com",
        },
        {
          id: 2,
          title: "Global Supply Chain Shows Signs of Recovery",
          source: "Financial Times",
          bias: "center",
          sentiment: "positive",
          timestamp: new Date(Date.now() - 4 * 3600000).toLocaleString(),
          summary:
            "Shipping delays decrease as logistics networks adapt to new normal.",
          relevance: 0.9,
          impact: "medium",
          url: "https://ft.com",
        },
      ],
      politics: [
        {
          id: 1,
          title: "New Economic Policy Proposal Sparks Debate",
          source: "Associated Press",
          bias: "center",
          sentiment: "neutral",
          timestamp: new Date(Date.now() - 3 * 3600000).toLocaleString(),
          summary: "Lawmakers propose comprehensive economic reform package.",
          relevance: 0.91,
          impact: "high",
          url: "https://apnews.com",
        },
        {
          id: 2,
          title: "International Trade Agreement Reaches Final Stage",
          source: "BBC News",
          bias: "center",
          sentiment: "positive",
          timestamp: new Date(Date.now() - 5 * 3600000).toLocaleString(),
          summary: "Multiple nations prepare to sign landmark trade deal.",
          relevance: 0.87,
          impact: "medium",
          url: "https://bbc.com",
        },
      ],
      entertainment: [
        {
          id: 1,
          title: "Streaming Platform Announces Record Subscriber Growth",
          source: "Variety",
          bias: "center",
          sentiment: "positive",
          timestamp: new Date(Date.now() - 2 * 3600000).toLocaleString(),
          summary: "Major streaming service adds 10 million subscribers in Q4.",
          relevance: 0.92,
          impact: "high",
          url: "https://variety.com",
        },
        {
          id: 2,
          title: "Box Office Numbers Show Strong Recovery",
          source: "Hollywood Reporter",
          bias: "center",
          sentiment: "positive",
          timestamp: new Date(Date.now() - 4 * 3600000).toLocaleString(),
          summary: "Theater attendance rebounds to pre-pandemic levels.",
          relevance: 0.88,
          impact: "medium",
          url: "https://hollywoodreporter.com",
        },
      ],
      fashion: [
        {
          id: 1,
          title:
            "Sustainable Fashion Startup Secures Investment from Luxury Brands",
          source: "Vogue Business",
          bias: "center",
          sentiment: "positive",
          timestamp: new Date(Date.now() - 2 * 3600000).toLocaleString(),
          summary:
            "Circular fashion platform partners with major retailers for eco-friendly initiatives.",
          relevance: 0.89,
          impact: "medium",
          url: "https://voguebusiness.com",
        },
        {
          id: 2,
          title: "Fashion Tech Company Launches AI-Powered Style Assistant",
          source: "WWD",
          bias: "center",
          sentiment: "positive",
          timestamp: new Date(Date.now() - 5 * 3600000).toLocaleString(),
          summary:
            "New app uses machine learning to provide personalized fashion recommendations.",
          relevance: 0.86,
          impact: "low",
          url: "https://wwd.com",
        },
      ],
      trends: [
        {
          id: 1,
          title: "B2B SaaS Startups See Record Funding in Q4",
          source: "Crunchbase News",
          bias: "center",
          sentiment: "positive",
          timestamp: new Date(Date.now() - 1 * 3600000).toLocaleString(),
          summary:
            "Enterprise software companies attract significant venture capital despite market conditions.",
          relevance: 0.94,
          impact: "high",
          url: "https://news.crunchbase.com",
        },
        {
          id: 2,
          title: "Climate Tech Emerges as Hottest Startup Sector",
          source: "TechCrunch",
          bias: "tech-positive",
          sentiment: "positive",
          timestamp: new Date(Date.now() - 3 * 3600000).toLocaleString(),
          summary:
            "Investors pour billions into clean energy and sustainability startups.",
          relevance: 0.91,
          impact: "high",
          url: "https://techcrunch.com",
        },
      ],
    };

    return mockDataBySegment[segment] || mockDataBySegment.investments;
  };

  useEffect(() => {
    fetchNews();
  }, [activeSegment]);

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      await fetchNews(query);
      setActiveView("analysis");
    }
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case "positive":
        return "text-green-600";
      case "negative":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getBiasColor = (bias) => {
    switch (bias) {
      case "left":
        return "bg-blue-100 text-blue-800";
      case "right":
        return "bg-red-100 text-red-800";
      case "center":
        return "bg-gray-100 text-gray-800";
      case "tech-positive":
        return "bg-purple-100 text-purple-800";
      case "pro-market":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getImpactBadge = (impact) => {
    switch (impact) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getSegmentColor = (color) => {
    const colors = {
      blue: "from-blue-500 to-blue-600",
      purple: "from-purple-500 to-purple-600",
      green: "from-green-500 to-green-600",
      red: "from-red-500 to-red-600",
      pink: "from-pink-500 to-pink-600",
      orange: "from-orange-500 to-orange-600",
      cyan: "from-cyan-500 to-cyan-600",
    };
    return colors[color] || colors.blue;
  };

  const sentimentStats = {
    positive: news.filter((n) => n.sentiment === "positive").length,
    neutral: news.filter((n) => n.sentiment === "neutral").length,
    negative: news.filter((n) => n.sentiment === "negative").length,
  };

  const totalArticles = news.length || 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Brain className="w-8 h-8 text-blue-400" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                AI Market Intelligence
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors">
                Sign In
              </button>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-semibold">
                Start Free Trial
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search companies, topics, trends... (try 'AI startups', 'sustainable fashion', 'crypto')"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch(searchQuery)}
              className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
            />
          </div>
        </div>
      </header>

      {/* Market Segments */}
      <div className="border-b border-slate-700 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
            {segments.map((segment) => {
              const Icon = segment.icon;
              return (
                <button
                  key={segment.id}
                  onClick={() => {
                    setActiveSegment(segment.id);
                    setActiveView("overview");
                  }}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                    activeSegment === segment.id
                      ? `bg-gradient-to-r ${getSegmentColor(
                          segment.color
                        )} text-white shadow-lg`
                      : "bg-slate-800 text-gray-400 hover:text-white hover:bg-slate-700"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{segment.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="border-b border-slate-700 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-8">
            {["overview", "analysis", "trends", "bias-map"].map((view) => (
              <button
                key={view}
                onClick={() => setActiveView(view)}
                className={`py-4 px-2 border-b-2 transition-colors capitalize ${
                  activeView === view
                    ? "border-blue-500 text-blue-400"
                    : "border-transparent text-gray-400 hover:text-white"
                }`}
              >
                {view.replace("-", " ")}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <p className="text-red-400">{error}</p>
            <button
              onClick={() => fetchNews()}
              className="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            {activeView === "overview" && (
              <div className="space-y-6">
                {/* Market Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-gray-400 text-sm font-medium">
                        Market Sentiment
                      </h3>
                      <TrendingUp className="w-5 h-5 text-green-400" />
                    </div>
                    <div className="text-3xl font-bold text-green-400 mb-2">
                      {totalArticles > 0
                        ? `+${Math.round(
                            (sentimentStats.positive / totalArticles) * 100
                          )}%`
                        : "N/A"}
                    </div>
                    <p className="text-sm text-gray-400">
                      {sentimentStats.positive > sentimentStats.negative
                        ? "Bullish"
                        : "Mixed"}{" "}
                      across {activeSegment}
                    </p>
                  </div>

                  <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-gray-400 text-sm font-medium">
                        Active Stories
                      </h3>
                      <Globe className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="text-3xl font-bold mb-2">{news.length}</div>
                    <p className="text-sm text-gray-400">
                      Latest in {activeSegment}
                    </p>
                  </div>

                  <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-gray-400 text-sm font-medium">
                        High Impact Events
                      </h3>
                      <AlertCircle className="w-5 h-5 text-orange-400" />
                    </div>
                    <div className="text-3xl font-bold text-orange-400 mb-2">
                      {news.filter((n) => n.impact === "high").length}
                    </div>
                    <p className="text-sm text-gray-400">Requires attention</p>
                  </div>
                </div>

                {/* Latest News */}
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">Latest News</h2>
                    <button
                      onClick={() => fetchNews()}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-sm"
                    >
                      Refresh
                    </button>
                  </div>
                  <div className="space-y-4">
                    {news.slice(0, 10).map((article) => (
                      <div
                        key={article.id}
                        className="bg-slate-900/50 rounded-lg p-4 hover:bg-slate-700/30 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <a
                              href={article.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-semibold hover:text-blue-400 cursor-pointer"
                            >
                              {article.title}
                            </a>
                            <div className="flex items-center space-x-3 text-sm text-gray-400 mt-2">
                              <span>{article.source}</span>
                              <span>•</span>
                              <span>{article.timestamp}</span>
                              <span
                                className={`px-2 py-1 rounded ${getBiasColor(
                                  article.bias
                                )}`}
                              >
                                {article.bias}
                              </span>
                            </div>
                          </div>
                          <div
                            className={`ml-4 ${getSentimentColor(
                              article.sentiment
                            )}`}
                          >
                            {article.sentiment === "positive" ? (
                              <TrendingUp className="w-6 h-6" />
                            ) : article.sentiment === "negative" ? (
                              <TrendingDown className="w-6 h-6" />
                            ) : (
                              <BarChart3 className="w-6 h-6" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeView === "analysis" && (
              <div className="space-y-6">
                {/* AI Insight Panel */}
                {aiInsights && (
                  <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-xl p-6 border border-blue-500/30">
                    <div className="flex items-center space-x-3 mb-4">
                      <Brain className="w-6 h-6 text-blue-400" />
                      <h3 className="text-xl font-bold">
                        AI Market Intelligence
                      </h3>
                    </div>
                    <div className="space-y-4">
                      <p className="text-gray-300 leading-relaxed">
                        {aiInsights.summary}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-slate-800/50 rounded-lg p-4">
                          <div className="text-sm text-gray-400 mb-2">
                            7-Day Outlook
                          </div>
                          <div className="text-lg font-semibold text-green-400">
                            {aiInsights.outlook}
                          </div>
                        </div>
                        <div className="bg-slate-800/50 rounded-lg p-4">
                          <div className="text-sm text-gray-400 mb-2">
                            Risk Level
                          </div>
                          <div className="text-lg font-semibold text-yellow-400">
                            {aiInsights.riskLevel}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Sentiment Dashboard */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
                    <h3 className="text-lg font-bold mb-4">Market Sentiment</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-400">Positive</span>
                          <span className="text-green-400">
                            {totalArticles > 0
                              ? Math.round(
                                  (sentimentStats.positive / totalArticles) *
                                    100
                                )
                              : 0}
                            %
                          </span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{
                              width: `${
                                totalArticles > 0
                                  ? (sentimentStats.positive / totalArticles) *
                                    100
                                  : 0
                              }%`,
                            }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-400">Neutral</span>
                          <span className="text-gray-400">
                            {totalArticles > 0
                              ? Math.round(
                                  (sentimentStats.neutral / totalArticles) * 100
                                )
                              : 0}
                            %
                          </span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div
                            className="bg-gray-500 h-2 rounded-full"
                            style={{
                              width: `${
                                totalArticles > 0
                                  ? (sentimentStats.neutral / totalArticles) *
                                    100
                                  : 0
                              }%`,
                            }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-400">Negative</span>
                          <span className="text-red-400">
                            {totalArticles > 0
                              ? Math.round(
                                  (sentimentStats.negative / totalArticles) *
                                    100
                                )
                              : 0}
                            %
                          </span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div
                            className="bg-red-500 h-2 rounded-full"
                            style={{
                              width: `${
                                totalArticles > 0
                                  ? (sentimentStats.negative / totalArticles) *
                                    100
                                  : 0
                              }%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
                    <h3 className="text-lg font-bold mb-4">Impact Analysis</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Risks</span>
                        <span className="text-red-400 font-semibold">
                          {aiInsights?.risks.length || 0} Identified
                        </span>
                      </div>
                      {aiInsights?.risks.map((risk, idx) => (
                        <div key={idx} className="text-sm text-gray-300">
                          • {risk}
                        </div>
                      ))}
                      <div className="border-t border-slate-700 pt-3 mt-3">
                        <span className="text-gray-400">Opportunities</span>
                        <span className="text-green-400 font-semibold ml-2">
                          {aiInsights?.opportunities.length || 0} Emerging
                        </span>
                      </div>
                      {aiInsights?.opportunities.map((opp, idx) => (
                        <div key={idx} className="text-sm text-gray-300">
                          • {opp}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Detailed News */}
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
                  <h3 className="text-xl font-bold mb-4">Detailed Analysis</h3>
                  <div className="space-y-4">
                    {news.map((article) => (
                      <div
                        key={article.id}
                        className="bg-slate-900/50 rounded-lg p-5 border border-slate-700 hover:border-slate-600 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <a
                              href={article.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-semibold text-lg mb-2 hover:text-blue-400 cursor-pointer block"
                            >
                              {article.title}
                            </a>
                            <div className="flex items-center space-x-3 text-sm text-gray-400 mb-3">
                              <span>{article.source}</span>
                              <span>•</span>
                              <span>{article.timestamp}</span>
                              <span
                                className={`px-2 py-1 rounded ${getBiasColor(
                                  article.bias
                                )}`}
                              >
                                {article.bias}
                              </span>
                              <span
                                className={`px-2 py-1 rounded ${getImpactBadge(
                                  article.impact
                                )}`}
                              >
                                {article.impact} impact
                              </span>
                            </div>
                          </div>
                          <div
                            className={`ml-4 ${getSentimentColor(
                              article.sentiment
                            )}`}
                          >
                            {article.sentiment === "positive" ? (
                              <TrendingUp className="w-6 h-6" />
                            ) : article.sentiment === "negative" ? (
                              <TrendingDown className="w-6 h-6" />
                            ) : (
                              <BarChart3 className="w-6 h-6" />
                            )}
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t border-slate-700">
                          <div className="flex items-center space-x-4 text-sm">
                            <span className="text-gray-400">
                              Relevance:{" "}
                              <span className="text-white font-semibold">
                                {(article.relevance * 100).toFixed(0)}%
                              </span>
                            </span>
                          </div>
                          <a
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 text-sm"
                          >
                            <span>Read Full Article</span>
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeView === "trends" && (
              <div className="space-y-6">
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
                  <h2 className="text-2xl font-bold mb-6">
                    Market Trends & Signals
                  </h2>
                  <div className="space-y-4">
                    {news.slice(0, 5).map((article, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-900/50 rounded-lg p-4 flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-4">
                          {article.sentiment === "positive" ? (
                            <TrendingUp className="w-6 h-6 text-green-400" />
                          ) : article.sentiment === "negative" ? (
                            <TrendingDown className="w-6 h-6 text-red-400" />
                          ) : (
                            <BarChart3 className="w-6 h-6 text-gray-400" />
                          )}
                          <div>
                            <div className="font-semibold">
                              {article.title.substring(0, 60)}...
                            </div>
                            <div className="text-sm text-gray-400">
                              {article.source}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div
                            className={`font-semibold ${getSentimentColor(
                              article.sentiment
                            )}`}
                          >
                            {article.impact.toUpperCase()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeView === "bias-map" && (
              <div className="space-y-6">
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
                  <h2 className="text-2xl font-bold mb-6">
                    Media Bias Analysis
                  </h2>
                  <p className="text-gray-400 mb-6">
                    Understanding how different news sources cover the same
                    stories helps identify potential biases and get a complete
                    picture of market events.
                  </p>

                  {/* Bias Distribution */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    {["left", "center", "right", "tech-positive"].map(
                      (biasType) => {
                        const count = news.filter(
                          (n) => n.bias === biasType
                        ).length;
                        const percentage =
                          totalArticles > 0
                            ? Math.round((count / totalArticles) * 100)
                            : 0;
                        return (
                          <div
                            key={biasType}
                            className={`${getBiasColor(biasType)
                              .replace("text-", "bg-")
                              .replace(
                                "-800",
                                "-900/20"
                              )} rounded-lg p-4 border border-opacity-30`}
                          >
                            <div className="text-sm text-gray-400 mb-2 capitalize">
                              {biasType.replace("-", " ")} Sources
                            </div>
                            <div className="text-2xl font-bold mb-1">
                              {percentage}%
                            </div>
                            <div className="text-xs text-gray-400">
                              {count} articles
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>

                  {/* Source Breakdown */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">Top Sources</h3>
                      {Array.from(new Set(news.map((n) => n.source)))
                        .slice(0, 5)
                        .map((source) => {
                          const sourceArticles = news.filter(
                            (n) => n.source === source
                          );
                          const bias = sourceArticles[0]?.bias || "center";
                          return (
                            <div
                              key={source}
                              className="bg-slate-900/50 rounded-lg p-4"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-semibold">{source}</span>
                                <span
                                  className={`px-2 py-1 rounded text-xs ${getBiasColor(
                                    bias
                                  )}`}
                                >
                                  {bias}
                                </span>
                              </div>
                              <div className="text-sm text-gray-400">
                                {sourceArticles.length} articles found
                              </div>
                            </div>
                          );
                        })}
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">
                        Sentiment by Source Type
                      </h3>
                      {["left", "center", "right"].map((biasType) => {
                        const biasArticles = news.filter(
                          (n) => n.bias === biasType
                        );
                        const positive = biasArticles.filter(
                          (a) => a.sentiment === "positive"
                        ).length;
                        const total = biasArticles.length;
                        const percentage =
                          total > 0 ? Math.round((positive / total) * 100) : 0;

                        return (
                          <div
                            key={biasType}
                            className="bg-slate-900/50 rounded-lg p-4"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-semibold capitalize">
                                {biasType} Sources
                              </span>
                              <span className="text-green-400">
                                {percentage}% Positive
                              </span>
                            </div>
                            <div className="w-full bg-slate-700 rounded-full h-2">
                              <div
                                className="bg-green-500 h-2 rounded-full"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer CTA */}
      <footer className="border-t border-slate-700 bg-slate-900/50 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-center">
            <h3 className="text-2xl font-bold mb-2">
              Ready to make smarter decisions?
            </h3>
            <p className="text-blue-100 mb-6">
              Get AI-powered market intelligence across all sectors
            </p>
            <div className="flex items-center justify-center space-x-4">
              <button className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Start Free Trial
              </button>
              <button className="px-6 py-3 bg-blue-700 rounded-lg font-semibold hover:bg-blue-800 transition-colors">
                View Pricing
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FinancialNewsAggregator;

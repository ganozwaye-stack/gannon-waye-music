// @ts-nocheck
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { Play, AlertCircle, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';
import { runPlatformHealthCheck, TEST_RESULTS } from '@/lib/platformTesting';
import { base44 } from '@/api/base44Client';

const normalizeBackendHealth = (payload) => {
  const data = payload?.data || payload || {};
  const checks = [
    ...Object.entries(data.entities || {}).map(([name, value]) => ({
      name: `Entity: ${name}`,
      suite: 'core',
      result: value.status === 'error' ? TEST_RESULTS.FAIL : TEST_RESULTS.PASS,
      details: {
        status: value.status === 'error' ? value.message : `${value.count ?? 0} records accessible`,
        ...value,
      },
    })),
    ...Object.entries(data.functions || {}).map(([name, value]) => ({
      name: `Function: ${name}`,
      suite: 'automation',
      result: value.status === 'error' ? TEST_RESULTS.FAIL : value.status === 'info' ? TEST_RESULTS.WARN : TEST_RESULTS.PASS,
      details: {
        status: value.note || value.message || value.status,
        ...value,
      },
    })),
    ...Object.entries(data.connections || {}).map(([name, value]) => ({
      name: `Connector: ${name}`,
      suite: 'integration',
      result: (value.status === 'error' || value.status === 'needs_credential') ? TEST_RESULTS.WARN : TEST_RESULTS.PASS,
      details: {
        status: (value.status === 'error' || value.status === 'needs_credential') ? (value.message || `Action required: connect ${name === 'gmail' ? 'Gmail' : name === 'googlesheets' ? 'Google Sheets' : name}`) : 'Connected',
        ...value,
      },
    })),
  ];

  if (data.stripe) {
    checks.push({
      name: 'Stripe Configuration',
      suite: 'integration',
      result: data.stripe.status === 'error' ? TEST_RESULTS.FAIL : TEST_RESULTS.PASS,
      details: {
        status: data.stripe.message || 'Stripe configured and active',
        ...data.stripe,
      },
    });
  }

  if (data.productsHealth) {
    checks.push({
      name: 'Product Calculations',
      suite: 'commerce',
      result: data.productsHealth.status === 'error' ? TEST_RESULTS.FAIL : data.productsHealth.status === 'warn' ? TEST_RESULTS.WARN : TEST_RESULTS.PASS,
      details: {
        status: data.productsHealth.summary || 'All calculations present',
        ...data.productsHealth,
      },
    });
  }

  const failed = checks.filter(t => t.result === TEST_RESULTS.FAIL).length;
  const warnings = checks.filter(t => t.result === TEST_RESULTS.WARN).length;
  const passed = checks.filter(t => t.result === TEST_RESULTS.PASS).length;

  return {
    timestamp: data.timestamp || data.health?.timestamp || new Date().toISOString(),
    source: 'backend',
    healthScore: data.health?.score ?? Math.round(((passed + warnings * 0.5) / Math.max(checks.length, 1)) * 100),
    status: data.health?.status || (failed > 0 ? 'critical' : warnings > 0 ? 'needs attention' : 'healthy'),
    totalTests: checks.length,
    passed,
    failed,
    warnings,
    skipped: 0,
    tests: checks,
    raw: data,
  };
};

export default function SiteHealthDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTestClick = (test) => {
    const name = test.name.toLowerCase();
    if (name.includes('product calculations') || name.includes('product')) {
      navigate('/admin/merch');
    } else if (name.includes('gmail') || name.includes('sheets') || name.includes('connector')) {
      navigate('/admin/api-setup');
    } else if (name.includes('stripe') || name.includes('stripe configuration')) {
      navigate('/admin/stripe-command-centre');
    } else if (name.includes('webhook') || name.includes('webhooks')) {
      navigate('/admin/webhook-health');
    }
  };

  const runTests = async () => {
    setLoading(true);
    try {
      let healthResults;
      try {
        const backendHealth = await base44.functions.invoke('runSiteHealthCheck', {});
        healthResults = normalizeBackendHealth(backendHealth);
      } catch (backendError) {
        const fallbackResults = await runPlatformHealthCheck();
        healthResults = {
          ...fallbackResults,
          source: 'frontend-fallback',
          backendError: backendError?.message || String(backendError),
        };
      }
      setResults(healthResults);

      if (healthResults.healthScore === 100) {
        toast({ title: 'All tests passed! ✅' });
      } else if (healthResults.healthScore >= 80) {
        toast({ title: 'Tests passed with warnings ⚠️' });
      } else {
        toast({ title: 'Some tests failed ❌', variant: 'destructive' });
      }
    } catch (e) {
      toast({ title: 'Test run failed', variant: 'destructive' });
    }
    setLoading(false);
  };

  const getStatusIcon = (status) => {
    if (status === TEST_RESULTS.PASS) return <CheckCircle2 className="w-4 h-4 text-green-500" />;
    if (status === TEST_RESULTS.WARN) return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    return <AlertCircle className="w-4 h-4 text-red-500" />;
  };

  const getHealthColor = (score) => {
    if (score === 100) return 'text-green-500';
    if (score >= 80) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getSuiteColor = (suite) => {
    const colors = {
      core: 'text-blue-500',
      commerce: 'text-primary',
      automation: 'text-purple-500',
      integration: 'text-green-500',
      security: 'text-red-500',
    };
    return colors[suite] || 'text-muted-foreground';
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-foreground">Site Health Dashboard</h1>
          <p className="font-body text-sm text-muted-foreground mt-1">Real operational testing & verification</p>
        </div>
        <Button
          onClick={runTests}
          disabled={loading}
          className="rounded-full gap-2 gradient-gold-button border-0 font-body text-sm tracking-wider uppercase"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" /> Running...
            </>
          ) : (
            <>
              <Play className="w-4 h-4" /> Run Tests
            </>
          )}
        </Button>
      </div>

      {results && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Overall Health */}
          <div className="bg-card border border-border/40 rounded-2xl p-6">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-2">Health Score</p>
                <p className={`font-display text-4xl ${getHealthColor(results.healthScore || 0)}`}>
                  {results.healthScore || 0}%
                </p>
              </div>
              <div>
                <p className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-2">Tests Passed</p>
                <p className="font-display text-3xl text-foreground">
                  {results.passed}/{results.totalTests}
                </p>
              </div>
              <div>
                <p className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-2">Status</p>
                <p className="font-display text-lg text-foreground capitalize">
                  {results.status || (results.failed === 0 ? 'operational' : results.failed > 2 ? 'critical' : 'warnings')}
                </p>
                {results.source && (
                  <p className="font-body text-[10px] text-muted-foreground uppercase tracking-wider mt-1">
                    Source: {results.source === 'backend' ? 'Backend health function' : 'Browser fallback'}
                  </p>
                )}
              </div>
            </div>
          </div>

          {results.backendError && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
              <p className="font-display text-sm text-yellow-600 mb-1">Backend health function unavailable</p>
              <p className="font-body text-xs text-muted-foreground">
                Fallback browser-side tests ran instead. Backend error: {results.backendError}
              </p>
            </div>
          )}

          {/* Summary Stats */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-card border border-border/40 rounded-xl p-4">
              <p className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-1">Total</p>
              <p className="font-display text-2xl text-foreground">{results.totalTests}</p>
            </div>
            <div className="bg-card border border-green-500/30 rounded-xl p-4">
              <p className="font-body text-xs tracking-widest uppercase text-green-500/70 mb-1">Passed</p>
              <p className="font-display text-2xl text-green-500">{results.passed}</p>
            </div>
            <div className="bg-card border border-yellow-500/30 rounded-xl p-4">
              <p className="font-body text-xs tracking-widest uppercase text-yellow-500/70 mb-1">Warnings</p>
              <p className="font-display text-2xl text-yellow-500">{results.warnings}</p>
            </div>
            <div className="bg-card border border-red-500/30 rounded-xl p-4">
              <p className="font-body text-xs tracking-widest uppercase text-red-500/70 mb-1">Failed</p>
              <p className="font-display text-2xl text-red-500">{results.failed}</p>
            </div>
          </div>

          {/* Tests by Suite */}
          <div className="space-y-4">
            {['core', 'commerce', 'automation', 'integration'].map(suite => {
              const suiteTests = results.tests.filter(t => t.suite === suite);
              if (suiteTests.length === 0) return null;
              
              const suitePassed = suiteTests.filter(t => t.result === TEST_RESULTS.PASS).length;
              
              return (
                <div key={suite} className="bg-card border border-border/40 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className={`font-display text-sm uppercase tracking-wider ${getSuiteColor(suite)}`}>
                      {suite}
                    </h3>
                    <Badge variant="outline" className="text-xs">
                      {suitePassed}/{suiteTests.length} passed
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    {suiteTests.map((test, i) => (
                      <div 
                        key={i} 
                        onClick={() => handleTestClick(test)}
                        className="flex items-start gap-3 py-2 px-2 -mx-2 rounded-lg border border-transparent transition-all first:border-t-0 hover:bg-secondary/40 hover:border-border/10 cursor-pointer group"
                      >
                        <div className="mt-0.5 flex-shrink-0">
                          {getStatusIcon(test.result)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-body text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                            {test.name}
                          </p>
                          {test.details && (
                            <p className="font-body text-xs text-muted-foreground mt-1">
                              {test.details.status || test.details.summary || JSON.stringify(test.details)}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Items */}
          {(results.failed > 0 || results.warnings > 0) ? (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
              <p className="font-display text-sm text-yellow-600 mb-3">⚠️ Action Required</p>
              <ul className="space-y-2 font-body text-sm text-foreground/70">
                {results.tests.filter(t => t.result === TEST_RESULTS.FAIL).map((test, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-red-500">•</span>
                    <span><strong className="text-foreground">{test.name}:</strong> {test.details?.error || 'Failed'}</span>
                  </li>
                ))}
                {results.tests.filter(t => t.result === TEST_RESULTS.WARN).map((test, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-yellow-500">•</span>
                    <span><strong className="text-foreground">{test.name}:</strong> {test.details?.summary || test.details?.status}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
              <p className="font-display text-sm text-green-600">✅ All systems operational. Platform ready for production.</p>
            </div>
          )}

          {/* Last Run */}
          <p className="font-body text-xs text-muted-foreground text-center">
            Last run: {new Date(results.timestamp).toLocaleString()}
          </p>
        </motion.div>
      )}

      {!results && !loading && (
        <div className="text-center py-16">
          <AlertCircle className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
          <p className="font-body text-muted-foreground">Click "Run Tests" to execute comprehensive platform health check</p>
        </div>
      )}
    </div>
  );
}

function Badge({ children, variant, className }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
      variant === 'outline' ? 'border border-border/40' : 'bg-primary/10 text-primary'
    } ${className || ''}`}>
      {children}
    </span>
  );
}

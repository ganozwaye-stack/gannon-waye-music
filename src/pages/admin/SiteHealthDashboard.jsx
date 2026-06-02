import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { Play, AlertCircle, CheckCircle2, AlertTriangle, RefreshCw, KeyRound, ExternalLink, Info } from 'lucide-react';
import { runPlatformHealthCheck, TEST_RESULTS } from '@/lib/platformTesting';

export default function SiteHealthDashboard() {
  const { toast } = useToast();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const runTests = async () => {
    setLoading(true);
    try {
      const healthResults = await runPlatformHealthCheck();
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

  const getStatusIcon = (test) => {
    if (test.result === TEST_RESULTS.PASS) return <CheckCircle2 className="w-4 h-4 text-green-500" />;
    if (test.result === TEST_RESULTS.WARN && test.details?.isCredentialGate) return <KeyRound className="w-4 h-4 text-blue-400" />;
    if (test.result === TEST_RESULTS.WARN) return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    return <AlertCircle className="w-4 h-4 text-red-500" />;
  };

  const getStatusBadge = (test) => {
    if (test.result === TEST_RESULTS.PASS && test.details?.isCredentialGate === false) {
      return null; // no badge needed
    }
    if (test.result === TEST_RESULTS.PASS) return null;
    if (test.result === TEST_RESULTS.WARN && test.details?.isCredentialGate) {
      return <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30">Needs Credential</span>;
    }
    if (test.result === TEST_RESULTS.WARN) {
      return <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-yellow-500/15 text-yellow-500 border border-yellow-500/30">Needs Attention</span>;
    }
    return <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-red-500/15 text-red-500 border border-red-500/30">Failed</span>;
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
                  {results.failed === 0 ? 'operational' : results.failed > 2 ? 'critical' : 'warnings'}
                </p>
              </div>
            </div>
          </div>

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
                      <div key={i} className="flex items-start gap-3 py-2 border-t border-border/30 first:border-0">
                        <div className="mt-0.5 flex-shrink-0">
                          {getStatusIcon(test)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center flex-wrap gap-1">
                            <p className="font-body text-sm font-medium text-foreground">{test.name}</p>
                            {getStatusBadge(test)}
                          </div>
                          {test.details && (
                            <p className="font-body text-xs text-muted-foreground mt-1">
                              {test.details.status || test.details.summary || ''}
                            </p>
                          )}
                          {test.details?.action && (
                            <p className="font-body text-xs text-blue-400 mt-1 flex items-center gap-1">
                              <KeyRound className="w-3 h-3 flex-shrink-0" />
                              {test.details.action}
                            </p>
                          )}
                          {test.details?.gmailAction && (
                            <p className="font-body text-xs text-blue-400 mt-1 flex items-center gap-1">
                              <KeyRound className="w-3 h-3 flex-shrink-0" />
                              {test.details.gmailAction}
                            </p>
                          )}
                          {test.details?.note && (
                            <p className="font-body text-xs text-muted-foreground/70 mt-1 italic">
                              {test.details.note}
                            </p>
                          )}
                          {test.details?.issues && test.details.issues.length > 0 && (
                            <ul className="mt-1 space-y-0.5">
                              {test.details.issues.slice(0, 5).map((issue, j) => (
                                <li key={j} className="font-body text-xs text-yellow-500">• {issue}</li>
                              ))}
                            </ul>
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
          {(() => {
            const failures = results.tests.filter(t => t.result === TEST_RESULTS.FAIL);
            const credGates = results.tests.filter(t => t.result === TEST_RESULTS.WARN && t.details?.isCredentialGate);
            const warnings = results.tests.filter(t => t.result === TEST_RESULTS.WARN && !t.details?.isCredentialGate);
            if (failures.length === 0 && credGates.length === 0 && warnings.length === 0) {
              return (
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                  <p className="font-display text-sm text-green-600">✅ All systems operational. Platform ready for production.</p>
                </div>
              );
            }
            return (
              <div className="space-y-3">
                {failures.length > 0 && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                    <p className="font-display text-sm text-red-500 mb-2">❌ System Failures — Fix Required</p>
                    <ul className="space-y-1 font-body text-sm text-foreground/70">
                      {failures.map((test, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-red-500 flex-shrink-0">•</span>
                          <span><strong className="text-foreground">{test.name}:</strong> {test.details?.error || 'Failed'}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {warnings.length > 0 && (
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                    <p className="font-display text-sm text-yellow-500 mb-2">⚠️ Needs Attention</p>
                    <ul className="space-y-1 font-body text-sm text-foreground/70">
                      {warnings.map((test, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-yellow-500 flex-shrink-0">•</span>
                          <span><strong className="text-foreground">{test.name}:</strong> {test.details?.status || test.details?.summary}</span>
                          {test.details?.issues?.map((issue, j) => (
                            <span key={j} className="block text-xs text-yellow-400 ml-4">— {issue}</span>
                          ))}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {credGates.length > 0 && (
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                    <p className="font-display text-sm text-blue-400 mb-2 flex items-center gap-2">
                      <KeyRound className="w-4 h-4" /> Needs Credential — Human Action Required
                    </p>
                    <p className="font-body text-xs text-muted-foreground mb-2">These are external OAuth connections. They do not affect core platform health.</p>
                    <ul className="space-y-1 font-body text-sm text-foreground/70">
                      {credGates.map((test, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-blue-400 flex-shrink-0">•</span>
                          <div>
                            <strong className="text-foreground">{test.name}:</strong>{' '}
                            {test.details?.action || test.details?.status}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })()}

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
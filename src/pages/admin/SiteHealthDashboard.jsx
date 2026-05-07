import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { Play, AlertCircle, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';

export default function SiteHealthDashboard() {
  const { toast } = useToast();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const runTests = async () => {
    setLoading(true);
    try {
      const res = await base44.functions.invoke('automatedSiteTests', {});
      setResults(res);

      if (res.health.score === 100) {
        toast({ title: 'All tests passed! ✅' });
      } else if (res.health.score >= 80) {
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
    if (status === 'pass') return <CheckCircle2 className="w-4 h-4 text-green-500" />;
    if (status === 'warning') return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    return <AlertCircle className="w-4 h-4 text-red-500" />;
  };

  const getHealthColor = (score) => {
    if (score === 100) return 'text-green-500';
    if (score >= 80) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-foreground">Site Health Dashboard</h1>
          <p className="font-body text-sm text-muted-foreground mt-1">Automated testing & verification system</p>
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

      {results && results.health && (
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
                <p className={`font-display text-4xl ${getHealthColor(results.health?.score || 0)}`}>
                  {results.health?.score || 0}%
                </p>
              </div>
              <div>
                <p className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-2">Status</p>
                <p className="font-display text-lg text-foreground capitalize">{results.health?.status || 'unknown'}</p>
              </div>
              <div>
                <p className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-2">Passed/Total</p>
                <p className="font-display text-lg text-foreground">
                  {results.summary?.passed || 0}/{results.tests?.length || 0}
                </p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-border/30">
              <p className="font-body text-sm text-foreground/70">{results.health?.recommendation || 'Review results'}</p>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-card border border-green-500/30 rounded-xl p-4">
              <p className="font-body text-xs tracking-widest uppercase text-green-500/70 mb-1">Passed</p>
              <p className="font-display text-3xl text-green-500">{results.summary?.passed || 0}</p>
            </div>
            <div className="bg-card border border-yellow-500/30 rounded-xl p-4">
              <p className="font-body text-xs tracking-widest uppercase text-yellow-500/70 mb-1">Warnings</p>
              <p className="font-display text-3xl text-yellow-500">{results.summary?.warnings || 0}</p>
            </div>
            <div className="bg-card border border-red-500/30 rounded-xl p-4">
              <p className="font-body text-xs tracking-widest uppercase text-red-500/70 mb-1">Failed</p>
              <p className="font-display text-3xl text-red-500">{results.summary?.failed || 0}</p>
            </div>
          </div>

          {/* Detailed Results */}
          <div className="space-y-3">
            <h3 className="font-display text-lg text-foreground">Test Results</h3>
            {results.tests?.map((test, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-card border border-border/40 rounded-xl p-4 flex items-start gap-3"
              >
                <div className="mt-1 flex-shrink-0">{getStatusIcon(test.status)}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-body font-medium text-foreground">{test.name}</p>
                  <p className="font-body text-sm text-muted-foreground mt-1">
                    {test.detail || test.error}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <span className={`font-body text-xs font-medium capitalize px-2 py-1 rounded-full 
                    ${test.status === 'pass' ? 'bg-green-500/10 text-green-600' : test.status === 'warning' ? 'bg-yellow-500/10 text-yellow-600' : 'bg-red-500/10 text-red-600'}`}>
                    {test.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Recommendations */}
          {(results.summary?.failed || 0) > 0 || (results.summary?.warnings || 0) > 0 ? (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
              <p className="font-display text-sm text-yellow-600 mb-3">⚠️ Action Items</p>
              <ul className="space-y-2 font-body text-sm text-foreground/70">
                {(results.summary?.warnings || 0) > 0 && (
                  <li>• Fill in cost/delivery fields for all products in Merch Management</li>
                )}
                {(results.summary?.failed || 0) > 0 && (
                  <li>• Check function permissions and ensure all backend functions are properly configured</li>
                )}
                <li>• Create test orders and contributions to validate order flow</li>
                <li>• Run tests again after making changes</li>
              </ul>
            </div>
          ) : (
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
              <p className="font-display text-sm text-green-600">✅ All systems operational. Ready for launch!</p>
            </div>
          )}

          {/* Last Run */}
          <p className="font-body text-xs text-muted-foreground text-center">
            Last run: {results.timestamp ? new Date(results.timestamp).toLocaleString() : 'N/A'}
          </p>
        </motion.div>
      )}

      {!results && !loading && (
        <div className="text-center py-16">
          <AlertCircle className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
          <p className="font-body text-muted-foreground">Click "Run Tests" to start system health check</p>
        </div>
      )}
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { FileText, Search, Filter, Calendar, User, ArrowLeftRight, Clock, Shield, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';

export default function AuditLog() {
  const [entityFilter, setEntityFilter] = useState('all');
  const [actionFilter, setActionFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: logs, isLoading } = useQuery({
    queryKey: ['auditLogs', entityFilter, actionFilter],
    queryFn: () => {
      const query = {};
      if (entityFilter !== 'all') query.entity_name = entityFilter;
      if (actionFilter !== 'all') query.action = actionFilter;
      return base44.entities.AuditLog.list('-timestamp', 100);
    },
    initialData: [],
  });

  const filteredLogs = logs.filter(log => {
    const searchMatch = !searchTerm || 
      log.entity_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return searchMatch;
  });

  const getActionColor = (action) => {
    const colors = {
      create: 'bg-green-500/20 text-green-500',
      update: 'bg-blue-500/20 text-blue-500',
      delete: 'bg-red-500/20 text-red-500',
    };
    return colors[action] || 'bg-gray-500/20 text-gray-500';
  };

  const getEntityIcon = (entityName) => {
    return <FileText className="w-4 h-4" />;
  };

  const exportLogs = () => {
    const csv = [
      ['Timestamp', 'Entity', 'ID', 'Action', 'User', 'Role', 'Description'].join(','),
      ...filteredLogs.map(log => [
        log.timestamp,
        log.entity_name,
        log.entity_id,
        log.action,
        log.user_email,
        log.user_role,
        log.description,
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-log-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-foreground">Audit Log</h1>
          <p className="font-body text-sm text-muted-foreground mt-1">Track all changes across the platform</p>
        </div>
        <Button onClick={exportLogs} variant="outline" className="gap-2">
          <Download className="w-4 h-4" /> Export CSV
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="font-body text-xs text-muted-foreground">Total Logs</p>
            <p className="font-display text-2xl text-foreground">{logs.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="font-body text-xs text-muted-foreground">Creates</p>
            <p className="font-display text-2xl text-green-500">{logs.filter(l => l.action === 'create').length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="font-body text-xs text-muted-foreground">Updates</p>
            <p className="font-display text-2xl text-blue-500">{logs.filter(l => l.action === 'update').length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="font-body text-xs text-muted-foreground">Deletes</p>
            <p className="font-display text-2xl text-red-500">{logs.filter(l => l.action === 'delete').length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <Input
            placeholder="Search logs..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="bg-secondary/50"
          />
        </div>
        <select
          value={entityFilter}
          onChange={e => setEntityFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border border-border/40 bg-card text-sm"
        >
          <option value="all">All Entities</option>
          <option value="MerchProduct">Products</option>
          <option value="MerchOrder">Orders</option>
          <option value="EmailSubscriber">Subscribers</option>
          <option value="SupportContribution">Donations</option>
          <option value="GiftRequirementTracker">Gift Claims</option>
        </select>
        <select
          value={actionFilter}
          onChange={e => setActionFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border border-border/40 bg-card text-sm"
        >
          <option value="all">All Actions</option>
          <option value="create">Create</option>
          <option value="update">Update</option>
          <option value="delete">Delete</option>
        </select>
      </div>

      {/* Logs List */}
      <div className="space-y-3">
        {filteredLogs.map((log, i) => (
          <motion.div
            key={log.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.02 }}
            className="bg-card border border-border/40 rounded-xl p-5"
          >
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div className="flex items-start gap-4 flex-1">
                <div className={`p-2 rounded-lg ${getActionColor(log.action)}`}>
                  {getEntityIcon(log.entity_name)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge className={`text-[10px] tracking-widest uppercase ${getActionColor(log.action)}`}>
                      {log.action}
                    </Badge>
                    <p className="font-display text-sm text-foreground">{log.entity_name}</p>
                    <p className="font-body text-xs text-muted-foreground">#{log.entity_id?.slice(-6)}</p>
                  </div>
                  <p className="font-body text-sm text-foreground/70 mb-2">{log.description}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {log.user_email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      {log.user_role}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {format(new Date(log.timestamp), 'PP p')}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Changes Summary */}
              {log.changes && log.changes.length > 0 && (
                <div className="w-full md:w-auto">
                  <div className="bg-secondary/30 rounded-lg p-3 max-h-32 overflow-y-auto text-xs">
                    <p className="font-body text-xs text-muted-foreground mb-2">Changes:</p>
                    {log.changes.slice(0, 5).map((change, j) => (
                      <div key={j} className="flex items-center gap-2 mb-1">
                        <ArrowLeftRight className="w-3 h-3 text-muted-foreground" />
                        <span className="font-mono">{change.field}:</span>
                        <span className="text-red-500 line-through">{change.old_value?.toString() || '—'}</span>
                        <span className="text-green-500">→ {change.new_value?.toString() || '—'}</span>
                      </div>
                    ))}
                    {log.changes.length > 5 && (
                      <p className="font-body text-[10px] text-muted-foreground mt-2">
                        +{log.changes.length - 5} more changes
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
        
        {filteredLogs.length === 0 && (
          <div className="text-center py-24 bg-card border border-border/40 rounded-2xl">
            <FileText className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
            <p className="font-body text-muted-foreground">No audit logs found</p>
          </div>
        )}
      </div>
    </div>
  );
}
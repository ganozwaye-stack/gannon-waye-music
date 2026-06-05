import React, { useState, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Gift, Calendar, Mail, Users, DollarSign, Clock, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format, parseISO } from 'date-fns';

export default function BirthdayDiscounts() {
  const queryClient = useQueryClient();
  const [selectedSubscriber, setSelectedSubscriber] = useState(null);

  const { data: subscribers } = useQuery({
    queryKey: ['subscribersWithDOB'],
    queryFn: () => base44.entities.EmailSubscriber.list(),
    initialData: [],
  });

  const { data: promoCodes } = useQuery({
    queryKey: ['promoCodes'],
    queryFn: () => base44.entities.PromoCode.list(),
    initialData: [],
  });

  const sendBirthdayMutation = useMutation({
    mutationFn: async () => {
      const result = await base44.functions.invoke('sendBirthdayDiscount', {});
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promoCodes'] });
      queryClient.invalidateQueries({ queryKey: ['subscribersWithDOB'] });
    },
  });

  // Get today's date in Sydney timezone
  const getSydneyDate = () => {
    return new Date().toLocaleString('en-AU', { timeZone: 'Australia/Sydney' });
  };

  // Calculate upcoming birthdays (next 30 days)
  const upcomingBirthdays = useMemo(() => {
    const today = new Date(getSydneyDate());
    const thirtyDaysFromNow = new Date(today);
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    return subscribers
      .filter(sub => sub.date_of_birth)
      .map(sub => {
        const birthDate = parseISO(sub.date_of_birth);
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        const adjustedAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()) 
          ? age - 1 
          : age;

        // Calculate next birthday
        const nextBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
        if (nextBirthday < today) {
          nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
        }

        const daysUntil = Math.floor((nextBirthday - today) / (1000 * 60 * 60 * 24));

        return {
          ...sub,
          age: adjustedAge + 1, // Age on next birthday
          nextBirthday,
          daysUntil,
          discountPercent: Math.min(adjustedAge + 1, 30),
        };
      })
      .filter(sub => sub.daysUntil <= 30)
      .sort((a, b) => a.daysUntil - b.daysUntil);
  }, [subscribers]);

  // Stats
  const stats = useMemo(() => {
    const totalWithDOB = subscribers.filter(s => s.date_of_birth).length;
    const birthdaysThisMonth = upcomingBirthdays.filter(s => s.daysUntil <= 30).length;
    const birthdayCodesUsed = promoCodes.filter(c => c.code?.startsWith('BDAY')).length;
    const totalDiscountGiven = promoCodes
      .filter(c => c.code?.startsWith('BDAY'))
      .reduce((sum, c) => sum + (c.times_used || 0), 0);

    return {
      totalWithDOB,
      birthdaysThisMonth,
      birthdayCodesUsed,
      totalDiscountGiven,
    };
  }, [subscribers, upcomingBirthdays, promoCodes]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl text-foreground">Birthday Discount Manager</h1>
          <p className="font-body text-sm text-muted-foreground mt-1">
            Automated birthday discounts & subscriber celebrations
          </p>
        </div>
        <Button 
          onClick={() => sendBirthdayMutation.mutate()} 
          disabled={sendBirthdayMutation.isPending}
          className="gap-2 rounded-full"
        >
          <RefreshCw className={`w-4 h-4 ${sendBirthdayMutation.isPending ? 'animate-spin' : ''}`} />
          {sendBirthdayMutation.isPending ? 'Processing...' : 'Check Birthdays Now'}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-5">
            <Users className="w-4 h-4 text-primary mb-2" />
            <p className="font-display text-2xl text-foreground">{stats.totalWithDOB}</p>
            <p className="font-body text-xs text-muted-foreground uppercase tracking-wider">Subscribers with DOB</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <Calendar className="w-4 h-4 text-primary mb-2" />
            <p className="font-display text-2xl text-foreground">{stats.birthdaysThisMonth}</p>
            <p className="font-body text-xs text-muted-foreground uppercase tracking-wider">Birthdays (30 days)</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <Gift className="w-4 h-4 text-primary mb-2" />
            <p className="font-display text-2xl text-foreground">{stats.birthdayCodesUsed}</p>
            <p className="font-body text-xs text-muted-foreground uppercase tracking-wider">Codes Generated</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <DollarSign className="w-4 h-4 text-primary mb-2" />
            <p className="font-display text-2xl text-foreground">{stats.totalDiscountGiven}</p>
            <p className="font-body text-xs text-muted-foreground uppercase tracking-wider">Discounts Used</p>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Birthdays */}
      <div>
        <h2 className="font-display text-xl text-foreground mb-4 flex items-center gap-2">
          <Gift className="w-5 h-5 text-primary" />
          Upcoming Birthdays (Next 30 Days)
        </h2>
        <div className="space-y-3">
          {upcomingBirthdays.map((sub, i) => (
            <motion.div
              key={sub.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <Card className={sub.daysUntil <= 3 ? 'border-primary/40 bg-primary/5' : ''}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-display text-base text-foreground">{sub.name}</h3>
                        {sub.daysUntil <= 3 && (
                          <Badge className="bg-primary text-primary-foreground text-[10px]">
                            {sub.daysUntil === 0 ? 'Today!' : `${sub.daysUntil} days`}
                          </Badge>
                        )}
                      </div>
                      <p className="font-body text-xs text-muted-foreground">{sub.email}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          Turning {sub.age} on {format(sub.nextBirthday, 'MMM d')}
                        </span>
                        <span className="flex items-center gap-1 text-primary">
                          <Gift className="w-3 h-3" />
                          {sub.discountPercent}% discount
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedSubscriber(sub)}
                        className="gap-1"
                      >
                        <Mail className="w-3 h-3" /> View
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {upcomingBirthdays.length === 0 && (
            <div className="text-center py-12 bg-card border border-border/40 rounded-2xl">
              <Calendar className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
              <p className="font-body text-muted-foreground">No upcoming birthdays in the next 30 days.</p>
              <p className="font-body text-xs text-muted-foreground/60 mt-2">
                Encourage subscribers to add their date of birth!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* How It Works */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-display text-lg text-foreground mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            How Birthday Discounts Work
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-display text-sm">1</div>
              <p className="font-body text-sm text-foreground">System checks for birthdays daily (or click "Check Birthdays Now")</p>
            </div>
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-display text-sm">2</div>
              <p className="font-body text-sm text-foreground">Personalized discount code generated (age-based, up to 30% off)</p>
            </div>
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-display text-sm">3</div>
              <p className="font-body text-sm text-foreground">Automated birthday email sent with discount code valid for 7 days</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
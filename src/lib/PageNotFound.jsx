import { useLocation } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';


export default function PageNotFound({}) {
    const location = useLocation();
    const pageName = location.pathname.substring(1);

    const shouldCheckAdminUser = location.pathname.startsWith('/admin');

    const { data: authData, isFetched } = useQuery({
        queryKey: ['user'],
        queryFn: async () => {
            try {
                const user = await base44.auth.me();
                return { user, isAuthenticated: true };
            } catch (error) {
                return { user: null, isAuthenticated: false };
            }
        },
        enabled: shouldCheckAdminUser,
    });
    
    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-background">
            <div className="max-w-md w-full">
                <div className="text-center space-y-6">
                    <div className="space-y-2">
                        <h1 className="text-7xl font-display text-muted-foreground/30">404</h1>
                        <div className="h-px w-16 bg-border mx-auto"></div>
                    </div>
                    <div className="space-y-3">
                        <h2 className="text-2xl font-display text-foreground">Page Not Found</h2>
                        <p className="font-body text-muted-foreground leading-relaxed">
                            The page <span className="font-medium text-foreground">"{pageName}"</span> could not be found.
                        </p>
                    </div>
                    {isFetched && authData?.isAuthenticated && authData?.user?.role === 'admin' && (
                        <div className="mt-8 p-4 bg-secondary/50 rounded-lg border border-border/40">
                            <p className="text-sm font-body text-muted-foreground">Admin: This page may not be implemented yet.</p>
                        </div>
                    )}
                    <div className="pt-6">
                        <button 
                            onClick={() => window.location.href = '/'} 
                            className="inline-flex items-center px-6 py-3 text-sm font-body tracking-wider uppercase text-foreground bg-card border border-border/40 rounded-full hover:border-primary/30 hover:text-primary transition-colors"
                        >
                            Go Home
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
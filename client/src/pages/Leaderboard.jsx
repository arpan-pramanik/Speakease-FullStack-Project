import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { getLeaderboard } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Leaderboard = () => {
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const observer = useRef();

    const lastUserRef = (node) => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasMore) {
                setPage((prev) => prev + 1);
            }
        });
        if (node) observer.current.observe(node);
    };

    useEffect(() => {
        const fetchLeaderboard = async () => {
            setLoading(true);
            try {
                const res = await getLeaderboard();
                const allUsers = res.data;
                const sorted = [...allUsers].sort((a, b) => (b.totalXP || 0) - (a.totalXP || 0));
                const pageSize = 10;
                const start = (page - 1) * pageSize;
                const nextBatch = sorted.slice(start, start + pageSize);
                if (page === 1) setUsers(nextBatch);
                else setUsers((prev) => [...prev, ...nextBatch]);
                setHasMore(start + pageSize < sorted.length);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchLeaderboard();
    }, [page]);

    const getRankDisplay = (index) => {
        if (index === 0) return { label: 'P1', color: '#D2FF00' };
        if (index === 1) return { label: 'P2', color: '#E0E0E0' };
        if (index === 2) return { label: 'P3', color: '#CD7F32' };
        return { label: `P${index + 1}`, color: 'var(--text-secondary)' };
    };

    return (
        <div className="page-container">
            <div style={{ maxWidth: '800px', width: '100%', margin: '0 auto' }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{ marginBottom: '40px', borderLeft: '4px solid var(--accent-primary)', paddingLeft: '16px' }}
                >
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 800, letterSpacing: '0.1em' }}>GLOBAL NETWORK</span>
                    <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: '#fff' }}>LEADERBOARD</h1>
                </motion.div>

                {users.length === 0 && !loading ? (
                    <div className="panel" style={{ padding: '60px', textAlign: 'center' }}>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', fontWeight: 800 }}>NO OPERATIVES DETECTED.</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {/* Table Header */}
                        <div style={{ display: 'flex', padding: '0 24px', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 800 }}>
                            <div style={{ width: '60px' }}>POS</div>
                            <div style={{ flex: 1 }}>OPERATIVE</div>
                            <div style={{ width: '100px', textAlign: 'right' }}>STREAK</div>
                            <div style={{ width: '120px', textAlign: 'right' }}>XP</div>
                        </div>

                        {users.map((u, i) => {
                            const isCurrentUser = user && (u._id === user._id || u.email === user.email);
                            const rank = getRankDisplay(i);
                            return (
                                <motion.div
                                    ref={i === users.length - 1 ? lastUserRef : null}
                                    key={u._id || i}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: (i % 10) * 0.05 }}
                                    className="panel"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        padding: '24px',
                                        border: isCurrentUser ? '1px solid var(--accent-primary)' : 'var(--border-sharp)',
                                        background: isCurrentUser ? 'rgba(210, 255, 0, 0.05)' : undefined,
                                    }}
                                >
                                    {/* Rank */}
                                    <div style={{ width: '60px', fontSize: '1.2rem', fontWeight: 900, color: rank.color }}>
                                        {rank.label}
                                    </div>

                                    {/* Name */}
                                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        <div style={{ fontWeight: 800, fontSize: '1.2rem', color: '#fff' }}>
                                            {u.name || 'UNKNOWN'}
                                        </div>
                                        {isCurrentUser && <span style={{ color: '#000', background: 'var(--accent-primary)', padding: '2px 6px', fontSize: '0.7rem', fontWeight: 800 }}>YOU</span>}
                                    </div>

                                    {/* Streak */}
                                    <div style={{ width: '100px', textAlign: 'right', fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                                        {u.streakDays || 0} D
                                    </div>

                                    {/* XP */}
                                    <div style={{ width: '120px', textAlign: 'right', fontWeight: 900, color: 'var(--accent-primary)', fontSize: '1.5rem' }}>
                                        {u.totalXP || 0}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}

                {loading && (
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                        <div style={{ color: 'var(--accent-primary)', fontWeight: 800, fontSize: '1.2rem' }}>SYNCING...</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Leaderboard;
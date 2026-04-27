import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { getLeaderboard } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useAIMode } from '../context/AIModeContext';
import { IconTrophy, IconXP, IconFire, IconGold, IconSilver, IconBronze, IconSparkles } from '../components/Icons';

const Leaderboard = () => {
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const { isAIMode } = useAIMode();
    const observer = useRef();

    const lastUserRef = (node) => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prevPage => prevPage + 1);
            }
        });
        if (node) observer.current.observe(node);
    };

    useEffect(() => {
        const fetchLeaderboard = async () => {
            setLoading(true);
            try {
                const res = await getLeaderboard();
                // Simulation of pagination since the current mock API returns all users
                const allUsers = res.data;
                const pageSize = 10;
                const startIndex = (page - 1) * pageSize;
                const nextBatch = allUsers.slice(startIndex, startIndex + pageSize);

                if (page === 1) {
                    setUsers(nextBatch);
                } else {
                    setUsers(prev => [...prev, ...nextBatch]);
                }
                setHasMore(startIndex + pageSize < allUsers.length);
            }
            catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        fetchLeaderboard();
    }, [page]);

    const getRankIcon = (index) => {
        if (index === 0) return <IconGold size={28} />;
        if (index === 1) return <IconSilver size={28} />;
        if (index === 2) return <IconBronze size={28} />;
        return <span style={{ width: 28, textAlign: 'center', display: 'inline-block', color: 'var(--text-muted)', fontWeight: 700 }}>{index + 1}</span>;
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, filter: 'blur(10px)', transition: { duration: 0.8 } }}
            className="page-section" style={{ justifyContent: 'flex-start', paddingTop: '8vh' }}
        >
            <div style={{ padding: '5vw', maxWidth: '1000px', margin: '0', width: '100%' }}>
                <h3 style={{ color: 'var(--accent-color)', fontSize: '1rem', letterSpacing: '0.2em', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <IconTrophy size={18} color="var(--accent-color)" /> THE NETWORK
                    {isAIMode && <IconSparkles size={14} color="var(--accent-color)" />}
                </h3>
                <h1 style={{ fontSize: '8vw', lineHeight: 0.85, marginBottom: '3rem' }}>LEADERBOARD</h1>

                {users.length === 0 && !loading ? (
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>No travelers found yet.</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                        {users.map((u, i) => {
                            const isCurrentUser = user && (u._id === user._id || u.email === user.email);
                            return (
                                <motion.div
                                    ref={i === users.length - 1 ? lastUserRef : null}
                                    key={u._id || i}
                                    initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: (i % 10) * 0.06 }}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '1.2rem',
                                        padding: '1.2rem 1.5rem',
                                        background: isCurrentUser ? (isAIMode ? 'rgba(196,240,0,0.06)' : 'rgba(196,240,0,0.04)') : 'rgba(255,255,255,0.02)',
                                        border: `1px solid ${isCurrentUser ? 'rgba(196,240,0,0.2)' : 'rgba(255,255,255,0.06)'}`,
                                        borderRadius: '15px', transition: 'all 0.3s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent-color)'}
                                    onMouseLeave={(e) => e.currentTarget.style.borderColor = isCurrentUser ? 'rgba(196,240,0,0.2)' : 'rgba(255,255,255,0.06)'}
                                >
                                    {getRankIcon(i)}
                                    <div style={{
                                        width: 40, height: 40, borderRadius: '50%',
                                        background: isAIMode ? 'linear-gradient(135deg, rgba(196,240,0,0.2), rgba(0,255,200,0.1))' : 'rgba(255,255,255,0.1)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '1rem', fontWeight: 700, color: 'var(--accent-color)', flexShrink: 0,
                                    }}>
                                        {(u.name || 'U').charAt(0).toUpperCase()}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.2rem' }}>
                                            {u.name || 'Unknown'} {isCurrentUser && <span style={{ color: 'var(--accent-color)', fontSize: '0.8rem' }}>(you)</span>}
                                        </h3>
                                        <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                                <IconFire size={12} color="#ff6b35" /> {u.streakDays || 0} streak
                                            </span>
                                        </div>
                                    </div>
                                    <div style={{ color: 'var(--accent-color)', fontWeight: 800, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                        <IconXP size={18} color="var(--accent-color)" /> {u.totalXP || 0}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
                {loading && (
                    <div style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--accent-color)', fontFamily: 'var(--font-display)', letterSpacing: '0.1em', fontSize: '0.8rem' }}>
                        SYNCING NETWORK DATA...
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default Leaderboard;

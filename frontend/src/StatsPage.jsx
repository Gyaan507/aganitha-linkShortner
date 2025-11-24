import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchLinks } from './apiService'; 


const fetchLinkStats = async (code) => {
    const API_URL = `http://localhost:5000/api/links/${code}`;
    const response = await fetch(API_URL);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || `Failed to fetch stats for code ${code}`);
    }
    return data;
};

const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString();
};

function StatsPage() {
    const { code } = useParams();
    const [linkStats, setLinkStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadStats = async () => {
            setLoading(true);
            setError(null);
            try {
                const stats = await fetchLinkStats(code);
                setLinkStats(stats);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadStats();
    }, [code]);

   

    if (loading) {
        return (
            <div className="dashboard-container" style={{ padding: '50px', textAlign: 'center' }}>
                <h1 style={{ color: 'white' }}>Loading Stats...</h1>
            </div>
        );
    }

    if (error || !linkStats) {
        return (
            <div className="dashboard-container" style={{ padding: '50px', textAlign: 'center' }}>
                <h1 style={{ color: 'white' }}>Stats Not Found</h1>
                <p className="subtitle" style={{ color: '#ff502f' }}>Error: {error}</p>
                <Link to="/" className="btn btn-primary" style={{ textDecoration: 'none' }}>
                    Go to Dashboard
                </Link>
            </div>
        );
    }

    const shortUrl = `http://localhost:5000/${linkStats.short_code}`;

    return (
        <div className="dashboard-container">
            <h1 style={{ textAlign: 'left', borderBottom: '2px solid white', paddingBottom: '10px' }}>
                Link Statistics
            </h1>

            <div className="card" style={{ padding: '30px' }}>
                <h3 style={{ marginTop: 0, color: '#1f2a41', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
                    Code: <span style={{ color: '#ff502f' }}>/{linkStats.short_code}</span>
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
                    
                
                    <div>
                        <p style={{ fontWeight: 'bold', color: '#4a5568' }}>Original URL:</p>
                        <p style={{ wordWrap: 'break-word' }}>
                            <a href={linkStats.target_url} target="_blank" rel="noopener noreferrer">
                                {linkStats.target_url}
                            </a>
                        </p>
                        
                        <p style={{ fontWeight: 'bold', color: '#4a5568', marginTop: '15px' }}>Short Link:</p>
                        <p>
                            <a href={shortUrl} target="_blank" rel="noopener noreferrer">{shortUrl}</a>
                        </p>
                    </div>

                  
                    <div>
                        <div style={{ border: '1px solid #ff502f', padding: '15px', borderRadius: '8px', marginBottom: '15px', textAlign: 'center', backgroundColor: '#fff7f7' }}>
                            <p style={{ margin: 0, fontSize: '2.5rem', fontWeight: 'bold', color: '#ff502f' }}>
                                {linkStats.total_clicks}
                            </p>
                            <p style={{ margin: 0, color: '#4a5568' }}>TOTAL CLICKS</p>
                        </div>

                        <p style={{ color: '#4a5568' }}>
                            **Created At:** {formatDate(linkStats.created_at)}
                        </p>
                        <p style={{ color: '#4a5568' }}>
                            **Last Clicked:** {formatDate(linkStats.last_clicked_at)}
                        </p>
                    </div>
                </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: '30px' }}>
                <Link to="/" className="btn btn-primary" style={{ textDecoration: 'none' }}>
                    ← Back to Dashboard
                </Link>
            </div>
        </div>
    );
}

export default StatsPage;
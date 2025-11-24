import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link as RouterLink } from 'react-router-dom';
import { fetchLinks, createLink, deleteLink } from './apiService';
import StatsPage from './StatsPage'; 

// Link Creation Form ---
function LinkCreationForm({ onLinkCreated }) {
    const [targetUrl, setTargetUrl] = useState('');
    const [customCode, setCustomCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const validateUrl = (url) => url.startsWith('http://') || url.startsWith('https://');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        if (!validateUrl(targetUrl)) {
            setError('Please enter a valid URL starting with http:// or https://.');
            return;
        }

        if (customCode && !/^[A-Za-z0-9]{6,8}$/.test(customCode)) {
            setError('Custom code must be 6 to 8 alphanumeric characters.');
            return;
        }

        setLoading(true);
        try {
            await createLink(targetUrl, customCode);
            setSuccess(true);
            setTargetUrl('');
            setCustomCode('');
            onLinkCreated(); 
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="tab-content">
            <h4 style={{ color: '#1f2a41', margin: '0 0 10px' }}>Shorten a long link</h4>
            <p style={{ color: '#4a5568', margin: '0 0 20px', fontSize: '0.9rem' }}>No credit card required.</p>
            
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Paste your long link here</label>
                    <input
                        type="url"
                        className="form-control"
                        placeholder="https://example.com/my-long-url"
                        value={targetUrl}
                        onChange={(e) => setTargetUrl(e.target.value)}
                        disabled={loading}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Custom Short Code (Optional, 6-8 chars)</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="e.g., mylink01"
                        value={customCode}
                        onChange={(e) => setCustomCode(e.target.value)}
                        disabled={loading}
                        maxLength={8}
                    />
                </div>

                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">Link created successfully!</p>}
                
                <button 
                    type="submit" 
                    className="btn btn-primary" 
                    disabled={loading || !targetUrl}
                    style={{ marginTop: '20px', width: '100%' }}
                >
                    {loading ? 'Shortening...' : 'Shorten'}
                </button>
            </form>
        </div>
    );
}

// QR Code Generator ---
function QRCodeGenerator() {
    const [qrUrl, setQrUrl] = useState('');
    const [imageUrl, setImageUrl] = useState(null);
    const QR_API_URL = 'http://localhost:5000/api/qr';

    const validateUrl = (url) => url.startsWith('http://') || url.startsWith('https://');

    useEffect(() => {
        if (validateUrl(qrUrl)) {
            const urlEncoded = encodeURIComponent(qrUrl);
            setImageUrl(`${QR_API_URL}?url=${urlEncoded}`);
        } else {
            setImageUrl(null); 
        }
    }, [qrUrl]);

    const handleDownload = () => {
        if (imageUrl) {
            const link = document.createElement('a');
            link.href = imageUrl;
            link.download = 'qrcode.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <div className="tab-content" style={{ textAlign: 'center', padding: '30px' }}>
            <h4 style={{ color: '#1f2a41', margin: '0 0 10px' }}>Generate a QR Code</h4>
            <p style={{ color: '#4a5568', margin: '0 0 30px', fontSize: '0.9rem' }}>
                Enter a URL below to instantly generate a scannable QR code.
            </p>
            
            <div className="form-group" style={{ maxWidth: '400px', margin: '0 auto 20px' }}>
                <input
                    type="url"
                    className="form-control"
                    placeholder="https://your-link-for-qr.com"
                    value={qrUrl}
                    onChange={(e) => setQrUrl(e.target.value)}
                />
            </div>

            <div style={{ 
                width: '180px', 
                height: '180px', 
                margin: '20px auto', 
                backgroundColor: '#f7fafc', 
                borderRadius: '8px', 
                border: '4px solid #1f2a41',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: '#1f2a41',
                fontWeight: 'bold'
            }}>
                {imageUrl ? (
                    <img 
                        src={imageUrl} 
                        alt="Generated QR Code" 
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        onError={(e) => { e.target.style.display = 'none'; alert('Failed to load QR code image. Ensure the URL is valid.'); }}
                    />
                ) : (
                    <p style={{ margin: 0, fontSize: '0.9em' }}>Enter a URL above</p>
                )}
            </div>
            
            <button 
                className="btn btn-primary" 
                onClick={handleDownload}
                disabled={!imageUrl}
                style={{ marginTop: '10px' }}
            >
                Download PNG
            </button>
        </div>
    );
}

// Dashboard
function Dashboard() {
    const [links, setLinks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [mode, setMode] = useState('link'); 

    const loadLinks = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchLinks();
            setLinks(data);
        } catch (err) {
            setError('Could not load links. Is the backend server running on port 5000?');
            setLinks([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadLinks();
    }, []);

    const handleDeleteLink = async (code) => {
        if (!window.confirm(`Are you sure you want to delete the link: /${code}?`)) return;
        try {
            await deleteLink(code);
            loadLinks();
        } catch (err) {
            alert(`Failed to delete link: ${err.message}`);
        }
    };

    const handleCopy = (code) => {
        const shortUrl = `http://localhost:5000/${code}`;
        const tempInput = document.createElement('input');
        tempInput.value = shortUrl;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        
        alert(`Short URL copied to clipboard: ${shortUrl}`);
    };
    
    const formatDate = (dateString) => {
        if (!dateString) return 'Never';
        return new Date(dateString).toLocaleString();
    }
    
    const truncateUrl = (url) => {
        const maxLen = 50;
        return url.length > maxLen ? url.substring(0, maxLen - 3) + '...' : url;
    }

    return (
        <div className="dashboard-container">
            <div style={{ textAlign: 'center', padding: '40px 0 60px' }}>
                <h1 style={{ maxWidth: '800px', margin: '0 auto' }}>
                    Build stronger digital connections
                </h1>
                <p className="subtitle">
                    Use our URL shortener and QR Codes to engage your audience.
                </p>
            </div>

            <div className="card">
                <div className="tab-bar">
                    <button 
                        className={`tab-btn ${mode === 'link' ? 'active' : ''}`} 
                        onClick={() => setMode('link')}
                    >
                        🔗 Short Link
                    </button>
                    <button 
                        className={`tab-btn ${mode === 'qr' ? 'active' : ''}`} 
                        onClick={() => setMode('qr')}
                    >
                        🖼️ QR Code
                    </button>
                </div>

                {mode === 'link' && <LinkCreationForm onLinkCreated={loadLinks} />}
                {mode === 'qr' && <QRCodeGenerator />}
            </div>

            <h2>Link Management</h2>
            
            {loading && <p style={{color: 'white', marginTop: '20px'}}>Loading links...</p>}
            {error && <p className="error-message">{error}</p>}
            
            {!loading && links.length === 0 && (
                <div className="card" style={{ backgroundColor: '#2d3748', color: 'white' }}>
                    <p>No links created yet. Start by creating one above!</p>
                </div>
            )}

            {!loading && links.length > 0 && (
                <table className="link-table"> 
                    <thead>
                        <tr>
                            <th>Short Code</th>
                            <th>Target URL</th>
                            <th>Clicks</th>
                            <th>Last Clicked</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {links.map(link => (
                            <tr key={link.short_code}>
                                <td>
                                    <span style={{ fontWeight: 'bold' }}>{link.short_code}</span>
                                    {/* Stats Button */}
                                    <RouterLink 
                                        to={`/code/${link.short_code}`}
                                        className="btn btn-primary"
                                        style={{ marginLeft: '10px', padding: '5px 10px', fontSize: '0.8em', textDecoration: 'none', background: '#4299e1' }}
                                    >
                                        Stats
                                    </RouterLink>
                                    <button 
                                        onClick={() => handleCopy(link.short_code)} 
                                        className="btn btn-primary"
                                        style={{ marginLeft: '10px', padding: '5px 10px', fontSize: '0.8em' }}
                                    >
                                        Copy
                                    </button>
                                </td>
                                <td>
                                    <a href={link.target_url} target="_blank" rel="noopener noreferrer" title={link.target_url}>
                                        {truncateUrl(link.target_url)}
                                    </a>
                                </td>
                                <td>{link.total_clicks}</td>
                                <td>{formatDate(link.last_clicked_at)}</td>
                                <td>
                                    <button 
                                        onClick={() => handleDeleteLink(link.short_code)}
                                        className="btn btn-danger"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

// --- Main App ---
function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Dashboard />} /> 
                <Route path="/code/:code" element={<StatsPage />} /> 
            </Routes>
        </Router>
    );
}

export default App;
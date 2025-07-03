export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    try {
        const apiUrl = 'https://hub.kaito.ai/api/v1/gateway/ai/kol/mindshare/top-leaderboard?duration=7d&topic_id=ETHOSNETWORK&top_n=100&customized_community=customized&community_yaps=true';
        
        const headers = {
            'User-Agent': 'Mozilla/5.0 (compatible; LeaderboardBot/1.0)',
            'Accept': 'application/json',
        };
        
        if (process.env.KAITO_API_KEY) {
            headers['Authorization'] = `Bearer ${process.env.KAITO_API_KEY}`;
        }
        
        const response = await fetch(apiUrl, { headers });
        
        if (!response.ok) {
            throw new Error(`API responded with status: ${response.status}`);
        }
        
        const data = await response.json();
        
        let leaderboardData = [];
        if (data.data && Array.isArray(data.data)) {
            leaderboardData = data.data;
        } else if (Array.isArray(data)) {
            leaderboardData = data;
        } else if (data.results && Array.isArray(data.results)) {
            leaderboardData = data.results;
        }
        
        res.status(200).json({
            data: leaderboardData,
            timestamp: new Date().toISOString(),
            count: leaderboardData.length
        });
        
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({
            error: 'Failed to fetch leaderboard data',
            message: error.message,
            timestamp: new Date().toISOString()
        });
    }
}

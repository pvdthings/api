const { supabase } = require('../services/supabase');
const { isWhitelisted } = require('../services/auth');

const authenticateToken = async (req, res, next) => {
    const environment = process.env.NODE_ENV || 'development';

    if (req.method === 'OPTIONS' || environment === 'development') {
        next();
        return;
    }

    const accessToken = req.headers['supabase-access-token'];
    const refreshToken = req.headers['supabase-refresh-token'];

    await supabase.auth.setSession({
        refresh_token: refreshToken,
        access_token: accessToken,
    });

    const session = await supabase.auth.getSession();
    const user = await supabase.auth.getUser();

    if (session.data.session && isWhitelisted(user.data.user.email)) {
        next();
    } else {
        console.error(`Invalid Token:\t ${session.error || 'NO ENTRY'}`)
        res.status(401).send();
    }
}

module.exports = authenticateToken;
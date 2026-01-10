// Service to interact with Gmail API

export const fetchTodayEmails = async (accessToken) => {
    if (!accessToken) {
        throw new Error('Access token required to fetch emails');
    }

    try {
        // Get start of today in seconds
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const afterTimestamp = Math.floor(today.getTime() / 1000);

        // 1. List messages for today
        const listResponse = await fetch(
            `https://gmail.googleapis.com/gmail/v1/users/me/messages?q=after:${afterTimestamp}&maxResults=10`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        if (!listResponse.ok) {
            throw new Error('Failed to fetch email list');
        }

        const listData = await listResponse.json();
        const messages = listData.messages || [];

        if (messages.length === 0) {
            return [];
        }

        // 2. Fetch details for each message
        const emailPromises = messages.map(async (msg) => {
            const detailResponse = await fetch(
                `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            const detailData = await detailResponse.json();
            
            // Extract headers
            const headers = detailData.payload.headers;
            const subject = headers.find(h => h.name === 'Subject')?.value || '(No Subject)';
            const from = headers.find(h => h.name === 'From')?.value || 'Unknown';
            
            return {
                id: msg.id,
                subject,
                from,
                snippet: detailData.snippet,
            };
        });

        return await Promise.all(emailPromises);

    } catch (error) {
        console.error('Error fetching emails:', error);
        throw error;
    }
};

import { useEffect, useState, useCallback } from 'react';
import { Box, Typography, Link } from '@mui/material';
import axios from 'axios';

const API_KEY = 'Nv4nmpfjdz6MASu8TR3uzPlgV3okVVXHqebwfxTX';

interface NewsItem {
    title: string;
    url: string;
}

const NewsTicker: any = () => {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [position, setPosition] = useState(0);
    const [isScrolling, setIsScrolling] = useState(false);

    const fetchNews = useCallback(async () => {
        setIsScrolling(false);
        try {
            const response = await axios.get(`https://api.thenewsapi.com/v1/news/all`, {
                params: {
                    api_token: API_KEY,
                    locale: 'us',
                    language: 'en',
                    limit: 10,
                    categories: 'business',
                    search: 'finance OR trading OR stock market OR investment',
                    sort: 'published_at'
                }
            });

            setNews(response.data.data.map((item: any) => ({
                title: item.title,
                url: item.url
            })));
            setIsScrolling(true);
        } catch (error) {
            console.error('Error fetching news:', error);
        }
    }, []);

    useEffect(() => {
        fetchNews();
        const fetchInterval = setInterval(fetchNews, 2 * 60 * 1000); // Fetch every 2 minutes

        return () => clearInterval(fetchInterval);
    }, [fetchNews]);

    useEffect(() => {
        if (news.length === 0) return;

        const tickerInterval = setInterval(() => {
            setPosition((prevPosition) => {
                if (prevPosition <= -100) {
                    setCurrentIndex((prevIndex) => (prevIndex + 1) % news.length);
                    return 100;
                }
                return prevPosition - 0.2; // Adjust for speed
            });
        }, 50);

        return () => clearInterval(tickerInterval);
    }, [news]);

    if (news.length === 0 || !isScrolling) {
        return (
            <Box sx={{
                width: '100%',
                overflow: 'hidden',
                borderRadius: '5px',
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                py: 1,
                textAlign: 'center'
            }}>
                <Typography>Looking for the latest finance news...</Typography>
            </Box>
        );
    }

    const currentNews = news[currentIndex];
    const nextNews = news[(currentIndex + 1) % news.length];

    return (
        <Box sx={{
            width: '100%',
            overflow: 'hidden',
            borderRadius: '5px',
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            py: 1
        }}>
            <Box sx={{
                display: 'flex',
                whiteSpace: 'nowrap',
                transform: `translateX(${position}%)`,
                transition: 'transform 0.5s linear'
            }}>
                <Typography sx={{ px: 2, display: 'inline-block' }}>
                    <Link href={currentNews.url} color="inherit" target="_blank" rel="noopener noreferrer">
                        {currentNews.title}
                    </Link>
                </Typography>
                <Typography sx={{ px: 2, display: 'inline-block' }}>
                    <Link href={nextNews.url} color="inherit" target="_blank" rel="noopener noreferrer">
                        {nextNews.title}
                    </Link>
                </Typography>
            </Box>
        </Box>
    );
};

export default NewsTicker;
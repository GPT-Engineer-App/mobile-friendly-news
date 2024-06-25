import React, { useState, useEffect } from 'react';
import { Box, Container, VStack, Text, Link, Input, IconButton, useColorMode, useColorModeValue } from "@chakra-ui/react";
import { FaSun, FaMoon, FaExternalLinkAlt } from 'react-icons/fa';

const Index = () => {
  const [stories, setStories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { colorMode, toggleColorMode } = useColorMode();
  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");

  const fetchTopThaiStories = async () => {
    // Mock API call to fetch top 5 Thai news stories
    return [
      { id: 1, title: 'ข่าวไทย 1', score: 100, url: 'https://example.com/1' },
      { id: 2, title: 'ข่าวไทย 2', score: 200, url: 'https://example.com/2' },
      { id: 3, title: 'ข่าวไทย 3', score: 300, url: 'https://example.com/3' },
      { id: 4, title: 'ข่าวไทย 4', score: 400, url: 'https://example.com/4' },
      { id: 5, title: 'ข่าวไทย 5', score: 500, url: 'https://example.com/5' },
    ];
  };

  const translateToEnglish = async (thaiText) => {
    // Mock translation function
    const translations = {
      'ข่าวไทย 1': 'Thai News 1',
      'ข่าวไทย 2': 'Thai News 2',
      'ข่าวไทย 3': 'Thai News 3',
      'ข่าวไทย 4': 'Thai News 4',
      'ข่าวไทย 5': 'Thai News 5',
    };
    return translations[thaiText] || thaiText;
  };

  useEffect(() => {
    const fetchAndTranslateStories = async () => {
      try {
        const thaiStories = await fetchTopThaiStories();
        const translatedStories = await Promise.all(
          thaiStories.map(async (story) => ({
            ...story,
            translatedTitle: await translateToEnglish(story.title),
          }))
        );
        setStories(translatedStories);
      } catch (error) {
        console.error('Error fetching and translating stories:', error);
      }
    };

    fetchAndTranslateStories();
  }, []);

  const filteredStories = stories.filter(story =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    story.translatedTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box bg={bgColor} minHeight="100vh" color={textColor}>
      <Container maxW="container.md" py={8}>
        <VStack spacing={4} align="stretch">
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Text fontSize="2xl" fontWeight="bold">Top 5 Thai News Stories</Text>
            <IconButton
              icon={colorMode === 'light' ? <FaMoon /> : <FaSun />}
              onClick={toggleColorMode}
              aria-label="Toggle color mode"
            />
          </Box>
          <Input
            placeholder="Search stories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {filteredStories.map((story) => (
            <Box key={story.id} p={4} borderWidth={1} borderRadius="md" _hover={{ boxShadow: 'md' }}>
              <Text fontSize="xl" fontWeight="semibold">{story.title}</Text>
              <Text fontSize="md" color="gray.500">{story.translatedTitle}</Text>
              <Text mt={2}>Upvotes: {story.score}</Text>
              <Link href={story.url} isExternal color="blue.500" mt={2} display="inline-flex" alignItems="center">
                Read more <FaExternalLinkAlt size="0.8em" style={{ marginLeft: '4px' }} />
              </Link>
            </Box>
          ))}
        </VStack>
      </Container>
    </Box>
  );
};

export default Index;
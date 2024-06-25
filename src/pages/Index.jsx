import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Container, VStack, Text, Link, Input, IconButton, useColorMode, useColorModeValue } from "@chakra-ui/react";
import { FaSun, FaMoon, FaExternalLinkAlt } from 'react-icons/fa';

const Index = () => {
  const [stories, setStories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { colorMode, toggleColorMode } = useColorMode();
  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");

  const fetchTopThaiStories = async () => {
    try {
      const response = await axios.get('https://api.example.com/top-thai-news');
      return response.data.stories;
    } catch (error) {
      console.error('Error fetching Thai news stories:', error);
      return [];
    }
  };

  const translateWithGPT4 = async (thaiText) => {
    try {
      const response = await axios.post('https://api.example.com/translate', {
        text: thaiText,
        targetLanguage: 'en'
      });
      return response.data.translatedText;
    } catch (error) {
      console.error('Error translating text:', error);
      return thaiText;
    }
  };

  useEffect(() => {
    const fetchAndTranslateStories = async () => {
      try {
        const thaiStories = await fetchTopThaiStories();
        const translatedStories = await Promise.all(
          thaiStories.map(async (story) => ({
            ...story,
            translatedTitle: await translateWithGPT4(story.title),
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
              <Text mt={2}>Reads: {story.reads}</Text>
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
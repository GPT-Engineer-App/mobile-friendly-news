import React, { useState, useEffect } from 'react';
import { Box, Container, VStack, Text, Link, Input, IconButton, useColorMode, useColorModeValue } from "@chakra-ui/react";
import { FaSun, FaMoon, FaExternalLinkAlt } from 'react-icons/fa';

const Index = () => {
  const [stories, setStories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { colorMode, toggleColorMode } = useColorMode();
  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");

  useEffect(() => {
    const fetchTopStories = async () => {
      try {
        const response = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
        const storyIds = await response.json();
        const top5Ids = storyIds.slice(0, 5);
        
        const storyPromises = top5Ids.map(id =>
          fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(res => res.json())
        );
        
        const topStories = await Promise.all(storyPromises);
        setStories(topStories);
      } catch (error) {
        console.error('Error fetching top stories:', error);
      }
    };

    fetchTopStories();
  }, []);

  const filteredStories = stories.filter(story =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box bg={bgColor} minHeight="100vh" color={textColor}>
      <Container maxW="container.md" py={8}>
        <VStack spacing={4} align="stretch">
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Text fontSize="2xl" fontWeight="bold">Top 5 Hacker News Stories</Text>
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
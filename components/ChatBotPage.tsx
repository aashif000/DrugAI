import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, KeyboardAvoidingView, Platform, ActivityIndicator, TouchableOpacity } from 'react-native';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useApiKeyContext } from '../contexts/apiKeyContext';
import { FontAwesome } from '@expo/vector-icons';

// Enum for message roles
enum Role {
  User = 'user',
  Assistant = 'assistant',
}

// Interface for messages
interface Message {
  content: string;
  role: Role;
}

const ChatBotPage: React.FC = () => {
  const { apiKey } = useApiKeyContext();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSend = async () => {
    if (!apiKey) {
      alert('API key is missing');
      return;
    }

    if (input.trim() === '') return;

    const newMessage: Message = {
      content: input,
      role: Role.User,
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInput('');
    setLoading(true);

    try {
      // Initialize the Gemini API client
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      // Prepare the prompt
      const responsePrompt = `You are a medical expert. Only respond to queries related to drugs, medications, or medical advice. If the query is not related to drugs or medical issues, respond with: "I only answer questions related to drugs and medical issues." Query: "${input}"`;
      
      // Generate response
      const response = await model.generateContent(responsePrompt, {
        temperature: 0.5,
      });

      // Inspect the response object
      console.log('API Response:', response);

      // Adjust based on actual structure
      const aiResponse = response?.response?.text ? await response.response.text() : 'An error occurred';

      const aiMessage: Message = {
        content: aiResponse,
        role: Role.Assistant,
      };

      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';

      const aiMessage: Message = {
        content: errorMessage,
        role: Role.Assistant,
      };

      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Type your message..."
          onSubmitEditing={handleSend}
          returnKeyType="send"
        />
        <TouchableOpacity onPress={handleSend} disabled={loading} style={styles.sendButton}>
          <FontAwesome name="send" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={item.role === Role.User ? styles.userMessage : styles.aiMessage}>
            <Text style={styles.messageText}>{item.content}</Text>
          </View>
        )}
        contentContainerStyle={styles.messagesContainer} 
      />
      {loading && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#007bff" />
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  messagesContainer: {
    flexGrow: 1,
    padding: 10,
    paddingTop: 60, // Space for input container
  },
  inputContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    padding: 10,
    backgroundColor: '#fff',
    zIndex: 1, // Ensure it stays above other content
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 25,
    padding: 10,
    marginRight: 10,
    backgroundColor: '#fff',
  },
  sendButton: {
    backgroundColor: '#007bff',
    borderRadius: 25,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loader: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }],
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#cfe9ff',
    padding: 12,
    borderRadius: 15,
    marginBottom: 10,
    maxWidth: '80%',
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#e5e5e5',
    padding: 12,
    borderRadius: 15,
    marginBottom: 10,
    maxWidth: '80%',
  },
  messageText: {
    fontSize: 16,
  },
});

export default ChatBotPage;

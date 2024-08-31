import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';

// Import your custom components
import HomePage from './components/Homepage';
import ChatBotPage from './components/ChatBotPage';
import CameraPage from './components/CameraPage';  // Import the CameraPage
import { ApiKeyContextProvider } from './contexts/apiKeyContext';
import SearchPage from './components/SearchPage';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <ApiKeyContextProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
              let iconName;

              if (route.name === 'Home') {
                iconName = 'home';
              } else if (route.name === 'Search') {
                iconName = 'search';
              } else if (route.name === 'ChatBot') {
                iconName = 'chat';
              } else if (route.name === 'Camera') {
                iconName = 'camera-alt';
              }

              return <MaterialIcons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: 'dodgerblue',
            tabBarInactiveTintColor: 'gray',
          })}
        >
          <Tab.Screen name="Home" component={HomePage} />
          <Tab.Screen name="Search" component={SearchPage} />
          <Tab.Screen name="ChatBot" component={ChatBotPage} />
          <Tab.Screen name="Camera" component={CameraPage} />
        </Tab.Navigator>
      </NavigationContainer>
    </ApiKeyContextProvider>
  );
}

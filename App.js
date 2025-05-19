import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// 스크린 임포트
import ProfileScreen from './src/screens/ProfileScreen';
import DietScreen from './src/screens/DietScreen';
import WorkoutScreen from './src/screens/WorkoutScreen';

const Tab = createBottomTabNavigator();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#4CAF50',
    accent: '#8BC34A',
  },
};

const App = () => {
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === '프로필') {
                iconName = focused ? 'account' : 'account-outline';
              } else if (route.name === '식단') {
                iconName = focused ? 'food-apple' : 'food-apple-outline';
              } else if (route.name === '운동') {
                iconName = focused ? 'dumbbell' : 'dumbbell';
              }

              return <Icon name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#4CAF50',
            tabBarInactiveTintColor: 'gray',
            headerShown: true,
          })}>
          <Tab.Screen name="프로필" component={ProfileScreen} />
          <Tab.Screen name="식단" component={DietScreen} />
          <Tab.Screen name="운동" component={WorkoutScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};

export default App;
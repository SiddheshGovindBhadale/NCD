import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/dist/Ionicons';
import { moderateScale } from 'react-native-size-matters';
import Home from '../screens/Home';
import Issued from '../screens/Issued';
import Menu from '../screens/Menu';

const BottomNav = () => {
  const Tab = createBottomTabNavigator();

  const screenOptions = ({ route }) => ({
    tabBarLabelStyle: {
      fontSize: 11,
      color: route.state && route.state.index === route.key ? '#001F3F' : 'gray',
    },
    tabBarIcon: ({ size, focused, color }) => {
      let iconName;

      if (route.name === 'Home') {
        iconName = 'document-lock-sharp';
      } else if (route.name === 'Issued') {
        iconName = 'ribbon-outline';
      } else if (route.name === 'Menu') {
        iconName = 'person-outline';
      }

      // Set the color based on the focused state
      const iconColor = focused ? '#5525f5' : color;

      return <Icon name={iconName} size={size} color={iconColor} />;
    },
    tabBarStyle: [
      {
        display: 'flex',
        paddingTop: 5,
        paddingBottom: 5,
        height: 55,
        paddingHorizontal: 5,
      },
      null,
    ],
  });

  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Issued"
        component={Issued}
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Menu"
        component={Menu}
        options={{
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomNav;

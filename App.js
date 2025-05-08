import { Ionicons } from '@expo/vector-icons';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { NavigationContainer } from "@react-navigation/native";
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import CabecalhoHeader from './src/Components/CabecalhoHeader';
import TelaInicial from './src/Screens/TelaInicial';

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props} style={styles.drawerContainer}>
      <View style={styles.drawerHeader}>
        <Ionicons name="person-circle" size={80} color="black" />
        <Text style={styles.drawerTitle}>Funcionario</Text>
      </View>

      <DrawerItem
        label="Início"
        icon={({ color }) => (
          <Ionicons name="home" size={24} color={color} style={{ marginRight: 10 }} />
        )}
        onPress={() => props.navigation.navigate('TelaInicial')} // Mudei aqui!
        labelStyle={styles.drawerLabel}
        style={styles.drawerItem}
      />

      
    </DrawerContentScrollView>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          drawerActiveBackgroundColor: '#e8f4f4',
          drawerActiveTintColor: '#659696',
          drawerInactiveTintColor: '#555',
          drawerStyle: {
            backgroundColor: '#f8fbfb',
            width: 280,
          },
          header: (props) => <CabecalhoHeader {...props} />, 
        }}
      >
        
        <Drawer.Screen 
          name="TelaInicial" 
          component={TelaInicial} 
          options={{ title: 'Início' }}
        />

        
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    backgroundColor: '#f8fbfb',
  },
  drawerHeader: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0ecec',
  },
  drawerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 10,
  },
  drawerLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: -16,
  },
  drawerItem: {
    marginVertical: 4,
    borderRadius: 8
  },
  divider: {
    height: 1,
    backgroundColor: '#e0ecec',
    marginVertical: 15,
    marginHorizontal: 15,
  },
});
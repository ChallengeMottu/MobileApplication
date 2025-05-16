import { useFonts, DarkerGrotesque_300Light, DarkerGrotesque_400Regular, DarkerGrotesque_500Medium, DarkerGrotesque_700Bold, DarkerGrotesque_800ExtraBold } from '@expo-google-fonts/darker-grotesque';
import { Ionicons } from '@expo/vector-icons';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { NavigationContainer } from "@react-navigation/native";
import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';

import CabecalhoHeader from './src/Components/CabecalhoHeader';
import TelaInicial from './src/Screens/TelaInicial';
import TelaEquipe from './src/Screens/TelaEquipe';
import TelaLogin from './src/Screens/TelaLogin';
import TelaCadastroF from './src/Screens/TelaCadastroF';

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props} style={styles.drawerContainer}>
      <View style={styles.drawerHeader}>
        <View style={styles.userIconContainer}>
          <Ionicons name="person" size={48} color="white" />
        </View>
        <Text style={styles.drawerTitle}>Funcionário</Text>
      </View>

      <DrawerItem
        label="Início"
        icon={() => (
          <Ionicons name="home" size={24} color="#11881D" style={{ marginRight: 10 }} />
        )}
        onPress={() => props.navigation.navigate('TelaInicial')} 
        labelStyle={styles.drawerLabel}
        style={styles.drawerItem}
      />

      <DrawerItem
        label="Nossa Equipe"
        icon={() => (
          <Ionicons name="people" size={24} color="#11881D" style={{ marginRight: 10 }} />
        )}
        onPress={() => props.navigation.navigate('TelaEquipe')} 
        labelStyle={styles.drawerLabel}
        style={styles.drawerItem}
      />

    </DrawerContentScrollView>
  );
}

export default function App() {
  let [fontsLoaded] = useFonts({
    DarkerGrotesque_800ExtraBold,
    DarkerGrotesque_500Medium
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black' }}>
        <ActivityIndicator size="large" color="#11881D" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          drawerActiveBackgroundColor: '#333',
          drawerActiveTintColor: 'white',
          drawerInactiveTintColor: '#ccc',
          drawerStyle: {
            backgroundColor: '#000',
            width: 280,
          },
          header: (props) => <CabecalhoHeader {...props} />,
        }}
      >
        <Drawer.Screen 
          name="TelaInicial" 
          component={TelaInicial} 
          options={{ 
            title: 'Início',
            drawerIcon: ({ color }) => (
              <Ionicons name="home" size={24} color={color} />
            )
          }}
        />
        <Drawer.Screen 
          name="TelaEquipe" 
          component={TelaEquipe} 
          options={{ title: 'Equipe'}}
        />

        <Drawer.Screen 
          name="TelaLogin" 
          component={TelaLogin} 
          options={{ title: 'Login'}}
        />
        
        <Drawer.Screen 
          name="TelaCadastroF" 
          component={TelaCadastroF} 
          options={{ title: 'Cadastro'}}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    backgroundColor: '#000',
  },
  drawerHeader: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#11881D',
  },
  userIconContainer: {
    backgroundColor: '#11881D',
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#11881D',
    marginBottom: 10,
  },
  drawerTitle: {
    fontSize: 22,
    fontFamily: 'DarkerGrotesque_800ExtraBold',
    color: 'white',
    marginTop: 10,
    letterSpacing: 0.5,
  },
  drawerLabel: {
    fontSize: 19,
    fontFamily: 'DarkerGrotesque_500Medium',
    color: 'white',
    marginLeft: -16,
    letterSpacing: 0.3,
  },
  drawerItem: {
    marginVertical: 4,
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  divider: {
    height: 1,
    backgroundColor: '#333',
    marginVertical: 15,
    marginHorizontal: 15,
  },
});
import { DarkerGrotesque_500Medium, DarkerGrotesque_800ExtraBold, useFonts } from '@expo-google-fonts/darker-grotesque';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DrawerContentScrollView, DrawerItem, createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View, Alert, TouchableOpacity, Animated } from 'react-native';

import './src/services/i18n';
import { useTranslation } from 'react-i18next';

import CabecalhoHeader from './src/Components/CabecalhoHeader';
import TelaCadastroF from './src/Screens/TelaCadastroF';
import TelaEntradaMotoPatio from './src/Screens/TelaEntradaMotoPatio';
import TelaEquipe from './src/Screens/TelaEquipe';
import TelaFuncionario from './src/Screens/TelaFuncionario';
import TelaInicial from './src/Screens/TelaInicial';
import TelaLogin from './src/Screens/TelaLogin';
import TelaScanner from './src/Screens/TelaScanner';
import TelaNovaSenha from './src/Screens/TelaNovaSenha';
import TelaInfos from './src/Screens/TelaInfos';
import Tela from './src/Screens/Tela';
import TelaCadastroM from './src/Screens/TelaCadastroM';
import { ThemeProvider, useTheme } from './src/context/ContextTheme';
import TelaDadosM from './src/Screens/TelaDadosM';
import TelaAdm from './src/Screens/TelaAdm';
import TelaMecanico from './src/Screens/TelaMecanico';
import TelaDashboard from './src/Screens/TelaDashboard';
import TelaRegistroFluxos from './src/Screens/TelaRegistroFluxos';
import TelaStatusMotos from './src/Screens/TelaStatusMotos';

const Drawer = createDrawerNavigator();

function LanguageToggle() {
  const { i18n } = useTranslation();
  const { colors } = useTheme();
  const [slideAnim] = useState(new Animated.Value(i18n.language === 'pt' ? 0 : 1));

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    Animated.spring(slideAnim, {
      toValue: lng === 'pt' ? 0 : 1,
      useNativeDriver: true,
      friction: 5,
    }).start();
  };

  const translateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [3, 71],
  });

  return (
    <View style={styles.languageContainer}>
      <Text style={[styles.languageLabel, { color: colors.text }]}>
        Idioma / Language
      </Text>
      
      <View style={[styles.toggleContainer, { 
        backgroundColor: colors.primary + '20',
        borderColor: colors.primary + '30',
      }]}>
        <TouchableOpacity
          style={styles.toggleOption}
          onPress={() => changeLanguage('pt')}
          activeOpacity={0.7}
        >
          <Text style={[
            styles.toggleText,
            { color: i18n.language === 'pt' ? colors.text : colors.text + '80' }
          ]}>
            🇧🇷 PT
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.toggleOption}
          onPress={() => changeLanguage('es')}
          activeOpacity={0.7}
        >
          <Text style={[
            styles.toggleText,
            { color: i18n.language === 'es' ? colors.text : colors.text + '80' }
          ]}>
            🇪🇸 ES
          </Text>
        </TouchableOpacity>

        <Animated.View
          style={[
            styles.toggleBall,
            { 
              backgroundColor: colors.primary,
              transform: [{ translateX }]
            }
          ]}
        />
      </View>
    </View>
  );
}

function CustomDrawerContent(props) {
  const navigation = useNavigation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { colors, theme } = useTheme();

  useEffect(() => {
    const checkLoginStatus = async () => {
      const usuarioLogado = await AsyncStorage.getItem('usuarioLogado');
      setIsLoggedIn(!!usuarioLogado);
    };

    checkLoginStatus();
  }, [navigation, props.state]);

  const handleNavigation = (routeName) => {
    if (routeName === 'TelaFuncionarios' && !isLoggedIn) {
      Alert.alert('Acesso negado', 'Você precisa fazer login primeiro');
      return;
    }
    navigation.navigate(routeName);
  };

  const dynamicStyles = StyleSheet.create({
    drawerContainer: {
      backgroundColor: colors.background,
    },
    drawerHeader: {
      ...styles.drawerHeader,
      borderBottomColor: colors.primary,
    },
    userIconContainer: {
      ...styles.userIconContainer,
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    drawerTitle: {
      ...styles.drawerTitle,
      color: colors.text,
    },
    drawerLabel: {
      ...styles.drawerLabel,
      color: colors.text,
    },
  });

  return (
    <DrawerContentScrollView {...props} style={dynamicStyles.drawerContainer}>
      <View style={dynamicStyles.drawerHeader}>
        <View style={dynamicStyles.userIconContainer}>
          <Ionicons name="person" size={48} color="white" />
        </View>
        <Text style={dynamicStyles.drawerTitle}>
          {isLoggedIn ? 'Funcionário' : 'Visitante'}
        </Text>
      </View>

      {/* BOTÃO DE TROCA DE IDIOMA */}
      <View style={styles.languageSection}>
        <LanguageToggle />
      </View>

      <View style={[styles.divider, { backgroundColor: colors.primary + '30' }]} />

      <DrawerItem
        label="Início"
        icon={() => (
          <Ionicons name="home" size={24} color={colors.primary} style={{ marginRight: 10 }} />
        )}
        onPress={() => navigation.navigate('TelaInicial')}
        labelStyle={dynamicStyles.drawerLabel}
        style={styles.drawerItem}
      />

      <DrawerItem
        label="Nossa Equipe"
        icon={() => (
          <Ionicons name="people" size={24} color={colors.primary} style={{ marginRight: 10 }} />
        )}
        onPress={() => navigation.navigate('TelaEquipe')}
        labelStyle={dynamicStyles.drawerLabel}
        style={styles.drawerItem}
      />

      {isLoggedIn ? (
        <>
          <DrawerItem
            label="Funcionalidades"
            icon={() => (
              <Ionicons name="apps" size={24} color={colors.primary} style={{ marginRight: 10 }} />
            )}
            onPress={() => handleNavigation('TelaFuncionario')}
            labelStyle={dynamicStyles.drawerLabel}
            style={styles.drawerItem}
          />

          <DrawerItem
            label="Cadastro Moto"
            icon={() => (
              <Ionicons name="bicycle" size={24} color={colors.primary} style={{ marginRight: 10 }} />
            )}
            onPress={() => navigation.navigate('TelaCadastroM')}
            labelStyle={dynamicStyles.drawerLabel}
            style={styles.drawerItem}
          />

          <DrawerItem
            label="Rastrear Moto"
            icon={() => (
              <Ionicons name="navigate" size={24} color={colors.primary} style={{ marginRight: 10 }} />
            )}
            onPress={() => navigation.navigate('Tela')}
            labelStyle={dynamicStyles.drawerLabel}
            style={styles.drawerItem}
          />

          <DrawerItem
            label="Minhas Informações"
            icon={() => (
              <Ionicons name="person-circle" size={24} color={colors.primary} style={{ marginRight: 10 }} />
            )}
            onPress={() => navigation.navigate('TelaInfos')}
            labelStyle={dynamicStyles.drawerLabel}
            style={styles.drawerItem}
          />

          <DrawerItem
            label="Entrada Moto Pátio"
            icon={() => (
              <Ionicons name="arrow-forward-circle" size={24} color={colors.primary} style={{ marginRight: 10 }} />
            )}
            onPress={() => navigation.navigate('TelaEntradaMotoPatio')}
            labelStyle={dynamicStyles.drawerLabel}
            style={styles.drawerItem}
          />

          <DrawerItem
            label="Saída da Moto"
            icon={() => (
              <Ionicons name="arrow-back-circle" size={24} color={colors.primary} style={{ marginRight: 10 }} />
            )}
            onPress={() => handleNavigation('TelaScanner')}
            labelStyle={dynamicStyles.drawerLabel}
            style={styles.drawerItem}
          />

          <DrawerItem
            label="Dados da Moto"
            icon={() => (
              <Ionicons name="document-text" size={24} color={colors.primary} style={{ marginRight: 10 }} />
            )}
            onPress={() => handleNavigation('TelaDadosM')}
            labelStyle={dynamicStyles.drawerLabel}
            style={styles.drawerItem}
          />

          <DrawerItem
            label="Tela ADM"
            icon={() => (
              <Ionicons name="shield-checkmark" size={24} color={colors.primary} style={{ marginRight: 10 }} />
            )}
            onPress={() => handleNavigation('TelaAdm')}
            labelStyle={dynamicStyles.drawerLabel}
            style={styles.drawerItem}
          />

          <DrawerItem
            label="Tela Mecânico"
            icon={() => (
              <Ionicons name="construct" size={24} color={colors.primary} style={{ marginRight: 10 }} />
            )}
            onPress={() => handleNavigation('TelaMecanico')}
            labelStyle={dynamicStyles.drawerLabel}
            style={styles.drawerItem}
          />

          <DrawerItem
            label="Tela Dashboard"
            icon={() => (
              <Ionicons name="bar-chart" size={24} color={colors.primary} style={{ marginRight: 10 }} />
            )}
            onPress={() => handleNavigation('TelaDashboard')}
            labelStyle={dynamicStyles.drawerLabel}
            style={styles.drawerItem}
          />
          

          <DrawerItem
            label="Tela Registro Fluxos"
            icon={() => (
              <Ionicons name="list" size={24} color={colors.primary} style={{ marginRight: 10 }} />
            )}
            onPress={() => handleNavigation('TelaRegistroFluxos')}
            labelStyle={dynamicStyles.drawerLabel}
            style={styles.drawerItem}
          />

          <DrawerItem
            label="Tela Status Motos"
            icon={() => (
              <Ionicons name="checkmark-circle" size={24} color={colors.primary} style={{ marginRight: 10 }} />
            )}
            onPress={() => handleNavigation('TelaStatusMotos')}
            labelStyle={dynamicStyles.drawerLabel}
            style={styles.drawerItem}
          />

          <DrawerItem
            label="Sair"
            icon={() => (
              <Ionicons name="log-out" size={24} color="#ff4444" style={{ marginRight: 10 }} />
            )}
            onPress={async () => {
              await AsyncStorage.removeItem('usuarioLogado');
              navigation.navigate('TelaInicial');
            }}
            labelStyle={[dynamicStyles.drawerLabel, { color: '#ff4444' }]}
            style={styles.drawerItem}
          />
        </>
      ) : (
        <DrawerItem
          label="Login"
          icon={() => (
            <Ionicons name="log-in" size={24} color={colors.primary} style={{ marginRight: 10 }} />
          )}
          onPress={() => navigation.navigate('TelaLogin')}
          labelStyle={dynamicStyles.drawerLabel}
          style={styles.drawerItem}
        />
      )}
    </DrawerContentScrollView>
  );
}

function MainNavigator() {
  const navigation = useNavigation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { colors } = useTheme();

  useEffect(() => {
    const checkLoginStatus = async () => {
      const usuarioLogado = await AsyncStorage.getItem('usuarioLogado');
      setIsLoggedIn(!!usuarioLogado);
    };

    checkLoginStatus();

    const unsubscribe = navigation.addListener('state', checkLoginStatus);

    return unsubscribe;
  }, [navigation]);

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerActiveBackgroundColor: colors.primary,
        drawerActiveTintColor: 'white',
        drawerInactiveTintColor: colors.text,
        drawerStyle: {
          backgroundColor: colors.background,
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
        options={{ title: 'Equipe' }}
      />
      <Drawer.Screen
        name="TelaLogin"
        component={TelaLogin}
        options={{ title: 'Login' }}
      />
      <Drawer.Screen
        name="TelaCadastroF"
        component={TelaCadastroF}
        options={{ title: 'Cadastro' }}
      />
      <Drawer.Screen
        name="TelaFuncionario"
        component={TelaFuncionario}
        options={{ title: 'Informações' }}
      />
      <Drawer.Screen
        name="TelaScanner"
        component={TelaScanner}
        options={{ title: 'Informações' }}
      />
      <Drawer.Screen
        name="TelaEntradaMotoPatio"
        component={TelaEntradaMotoPatio}
        options={{ title: 'Entrada da Moto' }}
      />
      <Drawer.Screen
        name="TelaNovaSenha"
        component={TelaNovaSenha}
        options={{ title: 'Nova Senha' }}
      />
      <Drawer.Screen
        name="TelaInfos"
        component={TelaInfos}
        options={{ title: 'Minhas Informações' }}
      />
      <Drawer.Screen
        name="Tela"
        component={Tela}
        options={{ title: 'Tela' }}
      />
      <Drawer.Screen
        name="TelaCadastroM"
        component={TelaCadastroM}
        options={{ title: 'Cadastro Moto' }}
      />
      <Drawer.Screen
        name="TelaDadosM"
        component={TelaDadosM}
        options={{ title: 'Cadastro Moto' }}
      />
      <Drawer.Screen
        name="TelaAdm"
        component={TelaAdm}
        options={{ title: 'Tela ADM' }}
      />
      <Drawer.Screen
        name="TelaMecanico"
        component={TelaMecanico}
        options={{ title: 'Tela Mecanico' }}
      />
      <Drawer.Screen
        name="TelaDashboard"
        component={TelaDashboard}
        options={{ title: 'Tela Dashboard' }}
      />
      <Drawer.Screen
        name="TelaRegistroFluxos"
        component={TelaRegistroFluxos}
        options={{ title: 'Tela Registro Fluxos' }}
      />
      <Drawer.Screen
        name="TelaStatusMotos"
        component={TelaStatusMotos}
        options={{ title: 'Tela Status Motos' }}
      />
    </Drawer.Navigator>
  );
}

function AppContent() {
  let [fontsLoaded] = useFonts({
    DarkerGrotesque_800ExtraBold,
    DarkerGrotesque_500Medium
  });

  const { colors } = useTheme();

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <MainNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  drawerHeader: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  userIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    marginBottom: 10,
  },
  drawerTitle: {
    fontSize: 22,
    fontFamily: 'DarkerGrotesque_800ExtraBold',
    marginTop: 10,
    letterSpacing: 0.5,
  },
  drawerLabel: {
    fontSize: 19,
    fontFamily: 'DarkerGrotesque_500Medium',
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
    marginVertical: 15,
    marginHorizontal: 15,
  },
  // ESTILOS DO BOTÃO DE IDIOMA
  languageSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginBottom: 5,
  },
  languageContainer: {
    alignItems: 'center',
  },
  languageLabel: {
    fontSize: 13,
    marginBottom: 14,
    fontFamily: 'DarkerGrotesque_500Medium',
    textTransform: 'uppercase',
    letterSpacing: 1,
    opacity: 0.7,
  },
  toggleContainer: {
    width: 140,
    height: 46,
    borderRadius: 23,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    padding: 3,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  toggleOption: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  toggleText: {
    fontSize: 15,
    fontFamily: 'DarkerGrotesque_800ExtraBold',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  toggleBall: {
    position: 'absolute',
    width: 66,
    height: 40,
    borderRadius: 20,
    zIndex: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
});
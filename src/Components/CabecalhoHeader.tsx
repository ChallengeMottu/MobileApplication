import { Ionicons } from '@expo/vector-icons';
import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View, Image, Text, Animated, Modal, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ContextTheme';

export default function CabecalhoHeader({ navigation }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [animation] = useState(new Animated.Value(0));
  const scaleAnim = useRef(new Animated.Value(1)).current;
  
  // Hook do tema
  const { theme, toggleTheme, colors } = useTheme();

  const toggleDropdown = () => {
    if (showDropdown) {
      Animated.timing(animation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => setShowDropdown(false));
    } else {
      setShowDropdown(true);
      Animated.timing(animation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleLogoPress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      navigation.navigate('TelaInicial');
    });
  };

  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [-10, 0],
  });

  const opacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  useEffect(() => {
    const checkLoginStatus = async () => {
      const usuarioLogado = await AsyncStorage.getItem('usuarioLogado');
      setIsLoggedIn(!!usuarioLogado);
    };
    
    checkLoginStatus();
    const unsubscribe = navigation.addListener('focus', checkLoginStatus);
    return unsubscribe;
  }, [navigation]);

  // Estilos dinâmicos baseados no tema
  const dynamicStyles = {
    header: {
      backgroundColor: colors.background,
    },
    menuIcon: {
      color: colors.text,
    },
    dropdownMenu: {
      backgroundColor: theme === 'dark' ? '#332f2f' : '#f0f0f0',
    },
    dropdownText: {
      color: colors.text,
    },
    divider: {
      backgroundColor: theme === 'dark' ? '#433e3e' : '#ddd',
    }
  };

  return (
    <SafeAreaView style={[styles.header, dynamicStyles.header]}>
      <TouchableOpacity 
        style={styles.menuButton}
        onPress={() => navigation.openDrawer()}
      >
        <Ionicons name="menu-outline" style={[styles.menuIcon, dynamicStyles.menuIcon]} size={27} />
      </TouchableOpacity>

      <Pressable 
        onPress={handleLogoPress}
        style={({ pressed }) => ({
          opacity: pressed ? 0.6 : 1, 
        })}
      >
        <Animated.View style={[styles.logoContainer, { transform: [{ scale: scaleAnim }] }]}>
          <Image 
            style={styles.logo} 
            source={require('../../assets/Pulse.png')} 
            resizeMode="contain"
          />
        </Animated.View>
      </Pressable>

      <View style={styles.rightIcons}>
        {/* Botão de troca de tema */}
        <TouchableOpacity 
          style={styles.themeButton}
          onPress={toggleTheme}
        >
          <Ionicons 
            name={theme === 'dark' ? 'sunny-outline' : 'moon-outline'} 
            style={[styles.menuIcon, dynamicStyles.menuIcon]} 
            size={24} 
          />
        </TouchableOpacity>
        
        <TouchableOpacity onPress={toggleDropdown}>
          <Ionicons name="person-outline" style={[styles.menuIcon, dynamicStyles.menuIcon]} size={27} />
        </TouchableOpacity>
      </View>

      {showDropdown && (
        <Modal
          transparent={true}
          visible={showDropdown}
          onRequestClose={toggleDropdown}
        >
          <TouchableOpacity 
            style={styles.dropdownOverlay}
            activeOpacity={1}
            onPress={toggleDropdown}
          >
            <Animated.View 
              style={[
                styles.dropdownMenu,
                dynamicStyles.dropdownMenu,
                { 
                  opacity,
                  transform: [{ translateY }] 
                }
              ]}
            >
              {isLoggedIn ? (
                <>
                  <TouchableOpacity 
                    style={styles.dropdownItem}
                    onPress={() => {
                      toggleDropdown();
                      navigation.navigate('TelaFuncionario');
                    }}
                  >
                    <Ionicons name="information-circle-outline" size={20} color={colors.text} />
                    <Text style={[styles.dropdownText, dynamicStyles.dropdownText]}>Operações</Text>
                  </TouchableOpacity>
                  
                  <View style={[styles.divider, dynamicStyles.divider]} />
                  
                  <TouchableOpacity 
                    style={styles.dropdownItem}
                    onPress={async () => {
                      await AsyncStorage.removeItem('usuarioLogado');
                      setIsLoggedIn(false);
                      toggleDropdown();
                      navigation.navigate('TelaInicial');
                    }}
                  >
                    <Ionicons name="log-out-outline" size={20} color={colors.text} />
                    <Text style={[styles.dropdownText, dynamicStyles.dropdownText]}>Logout</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity 
                  style={styles.dropdownItem}
                  onPress={() => {
                    toggleDropdown();
                    navigation.navigate('TelaLogin');
                  }}
                >
                  <Ionicons name="log-in-outline" size={20} color={colors.text} />
                  <Text style={[styles.dropdownText, dynamicStyles.dropdownText]}>Login</Text>
                </TouchableOpacity>
              )}
            </Animated.View>
          </TouchableOpacity>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    position: 'relative',
  },
  menuButton: {
    width: 27,
  },
  menuIcon: {
    // cor será definida dinamicamente
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    height: 26,
    width: 120,
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 'auto',
  },
  themeButton: {
    marginRight: 13,
    padding: 2,
  },
  dropdownOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 60,
    paddingRight: 16,
  },
  dropdownMenu: {
    borderRadius: 8,
    paddingVertical: 8,
    width: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  dropdownText: {
    marginLeft: 12,
    fontSize: 16,
  },
  divider: {
    height: 1,
    marginHorizontal: 8,
  },
});
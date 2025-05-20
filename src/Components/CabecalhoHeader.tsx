import { Ionicons } from '@expo/vector-icons';
import React, { useState, useRef } from 'react';
import { StyleSheet, TouchableOpacity, View, Image, Text, Animated, Modal, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CabecalhoHeader({ navigation }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [animation] = useState(new Animated.Value(0));
  const scaleAnim = useRef(new Animated.Value(1)).current;

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
    // Animação de pressionar
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

  return (
    <SafeAreaView style={styles.header}>
      <TouchableOpacity 
        style={styles.menuButton}
        onPress={() => navigation.openDrawer()}
      >
        <Ionicons name="menu-outline" style={styles.menuIcon} size={27} />
      </TouchableOpacity>

      <Pressable 
        onPress={handleLogoPress}
        style={({ pressed }) => ({
          opacity: pressed ? 0.6 : 1, // Efeito de opacidade ao pressionar
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
        <TouchableOpacity onPress={toggleDropdown}>
          <Ionicons name="person-outline" style={styles.menuIcon} size={27} />
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
                { 
                  opacity,
                  transform: [{ translateY }] 
                }
              ]}
            >
              <TouchableOpacity 
                style={styles.dropdownItem}
                onPress={() => {
                  toggleDropdown();
                  navigation.navigate('TelaInfos');
                }}
              >
                <Ionicons name="information-circle-outline" size={20} color="#fff" />
                <Text style={styles.dropdownText}>Informações da Conta</Text>
              </TouchableOpacity>
              
              <View style={styles.divider} />
              
              <TouchableOpacity 
                style={styles.dropdownItem}
                onPress={() => {
                  toggleDropdown();
                  navigation.navigate('TelaLogin');
                }}
              >
                <Ionicons name="log-in-outline" size={20} color="#fff" />
                <Text style={styles.dropdownText}>Login</Text>
              </TouchableOpacity>
            </Animated.View>
          </TouchableOpacity>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#000000',
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
    color: 'white',
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
    width: 27,
    alignItems: 'flex-end',
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
    backgroundColor: '#332f2f',
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
    color: '#fff',
    marginLeft: 12,
    fontSize: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#433e3e',
    marginHorizontal: 8,
  },
});
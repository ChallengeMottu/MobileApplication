import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Dimensions, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { useTheme } from '../context/ContextTheme';

const { width } = Dimensions.get('window');

export default function TelaFuncionario({ navigation }) {
    const { colors, theme } = useTheme();
    const [usuario, setUsuario] = useState(null);
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        const carregarDados = async () => {
            try {
                const usuarioLogado = await AsyncStorage.getItem('usuarioLogado');
                
                if (usuarioLogado) {
                    const dadosUsuario = JSON.parse(usuarioLogado);
                    setUsuario(dadosUsuario);
                }
            } catch (error) {
                console.error('Erro ao carregar dados:', error);
                Alert.alert('Erro', 'Não foi possível carregar os dados do usuário');
            } finally {
                setCarregando(false);
            }
        };

        carregarDados();
    }, []);

    const handleNavigate = (tela) => {
        navigation.navigate(tela);
    };

    const getNomeUsuario = () => {
        if (!usuario) return 'Usuário';
        
        if (usuario.nome) return usuario.nome.split(' ')[0];
        if (usuario.displayName) return usuario.displayName.split(' ')[0];
        if (usuario.email) return usuario.email.split('@')[0];
        
        return 'Usuário';
    };

    if (carregando) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
                <Text style={[styles.loadingText, { color: colors.text }]}>Carregando...</Text>
            </View>
        );
    }

    const menuItems = [
        {
            title: 'Cadastrar Moto',
            icon: 'bicycle',
            screen: 'TelaCadastroM',
            description: 'Registre uma nova motocicleta'
        },
        {
            title: 'Identificar Localização',
            icon: 'location',
            screen: 'Tela',
            description: 'Localize motos no pátio'
        },
        {
            title: 'Entrada e Alocação',
            icon: 'enter',
            screen: 'TelaEntradaMotoPatio',
            description: 'Registre entrada da moto'
        },
        {
            title: 'Saída da Moto',
            icon: 'exit',
            screen: 'TelaScanner',
            description: 'Registre saída do pátio'
        },
        {
            title: 'Minhas Informações',
            icon: 'information-circle',
            screen: 'TelaInfos',
            description: 'Veja seus dados cadastrais'
        }
    ];

    return (
        <ScrollView 
            style={[styles.container, { backgroundColor: colors.background }]}
            showsVerticalScrollIndicator={false}
        >
            {/* Header com fundo verde */}
            <ImageBackground 
                source={require('../../assets/fundo.png')} 
                style={styles.topSection} 
                resizeMode="cover"
            >
                <View style={styles.headerContent}>
                    <View style={styles.welcomeContainer}>
                        <Ionicons name="person-circle-outline" size={50} color="#fff" />
                        <Text style={styles.nomeUsuario}>
                            Olá, {getNomeUsuario()}!
                        </Text>
                    </View>
                    <Text style={styles.questionText}>O que deseja realizar hoje?</Text>
                </View>
            </ImageBackground>

            {/* Grid de opções */}
            <View style={styles.content}>
                <View style={styles.gridContainer}>
                    {menuItems.map((item, index) => (
                        <TouchableOpacity 
                            key={index}
                            style={[styles.menuCard, { 
                                backgroundColor: colors.cardBackground,
                                shadowColor: colors.primary
                            }]} 
                            onPress={() => handleNavigate(item.screen)}
                            activeOpacity={0.8}
                        >
                            <View style={[styles.iconContainer, { backgroundColor: colors.primary }]}>
                                <Ionicons name={item.icon} size={32} color="#fff" />
                            </View>
                            
                            <Text style={[styles.menuTitle, { color: colors.text }]}>
                                {item.title}
                            </Text>
                            
                            <Text style={[styles.menuDescription, { color: colors.textSecondary }]}>
                                {item.description}
                            </Text>

                            <View style={styles.arrowContainer}>
                                <Ionicons 
                                    name="chevron-forward" 
                                    size={20} 
                                    color={colors.primary} 
                                />
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 18,
        fontWeight: '600',
    },
    topSection: {
        width: '100%',
        height: 240,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 40,
    },
    headerContent: {
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    welcomeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 15,
    },
    nomeUsuario: {
        color: '#fff',
        fontSize: 26,
        fontWeight: 'bold',
        letterSpacing: 0.5,
        textShadowColor: 'rgba(0, 0, 0, 0.8)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    questionText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
        letterSpacing: 0.3,
        textShadowColor: 'rgba(0, 0, 0, 0.8)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        marginTop: -30,
        paddingBottom: 30,
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 15,
    },
    menuCard: {
        width: (width - 55) / 2,
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
        minHeight: 180,
        justifyContent: 'space-between',
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    menuTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 6,
        lineHeight: 20,
    },
    menuDescription: {
        fontSize: 12,
        textAlign: 'center',
        lineHeight: 16,
        marginBottom: 8,
    },
    arrowContainer: {
        marginTop: 4,
    },
});
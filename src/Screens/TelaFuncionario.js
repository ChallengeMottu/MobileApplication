import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Dimensions, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { useTheme } from '../context/ContextTheme';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');

export default function TelaFuncionario({ navigation }) {
    const { colors, theme, toggleTheme } = useTheme();
    const { t } = useTranslation();
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
                Alert.alert(t('erro'), t('nao_foi_possivel_carregar_dados'));
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
        if (!usuario) return t('operador');
        
        if (usuario.nome) return usuario.nome.split(' ')[0];
        if (usuario.displayName) return usuario.displayName.split(' ')[0];
        if (usuario.email) return usuario.email.split('@')[0];
        
        return t('operador');
    };

    if (carregando) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
                <Text style={[styles.loadingText, { color: colors.text }]}>{t('carregando')}</Text>
            </View>
        );
    }

    return (
        <ScrollView 
            style={[styles.container, { backgroundColor: colors.background }]}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
        >
            {/* Header com ImageBackground e Botão de Tema */}
            <ImageBackground 
                source={require('../../assets/fundo.png')} 
                style={styles.topSection}
                resizeMode="cover"
            >

                {/* Profile Icon */}
                <View style={styles.profileContainer}>
                    <View style={styles.profileImageContainer}>
                        <Ionicons name="person" size={40} color="#fff" />
                    </View>
                </View>

                <Text style={styles.welcomeText}>
                    {t('ola')}, {getNomeUsuario()}!
                </Text>

                <Text style={styles.subtitleText}>
                    {t('deseja_realizar_hoje')}
                </Text>
            </ImageBackground>

            {/* Card de Mapa */}
            <View style={styles.mapSection}>
                <TouchableOpacity 
                    style={[styles.mapCard, { 
                        backgroundColor: colors.primary,
                        shadowColor: colors.primary 
                    }]}
                    onPress={() => handleNavigate('Tela')}
                    activeOpacity={0.85}
                >
                    <View style={styles.mapPlaceholder}>
                        <Ionicons name="map" size={80} color="rgba(255,255,255,0.3)" />
                    </View>
                    <View style={styles.mapLabelContainer}>
                        <Text style={styles.mapLabel}>{t('localizar_motos')}</Text>
                        <Ionicons name="arrow-forward" size={20} color="#fff" style={styles.mapArrow} />
                    </View>
                </TouchableOpacity>
            </View>

            {/* Menu de Funcionalidades */}
            <View style={styles.menuSection}>
                <View style={styles.menuHeader}>
                    <Ionicons name="apps" size={24} color={colors.primary} />
                    <Text style={[styles.menuSectionTitle, { color: colors.text }]}>
                        {t('funcionalidades')}
                    </Text>
                </View>

                <TouchableOpacity 
                    style={[styles.menuButton, { 
                        backgroundColor: colors.cardBackground,
                        borderColor: colors.primary,
                        shadowColor: colors.primary
                    }]}
                    onPress={() => handleNavigate('TelaCadastroM')}
                    activeOpacity={0.8}
                >
                    <View style={styles.menuButtonContent}>
                        <View style={[styles.menuIconContainer, { backgroundColor: colors.primary }]}>
                            <Ionicons name="add-circle" size={24} color="#fff" />
                        </View>
                        <View style={styles.menuTextContainer}>
                            <Text style={[styles.menuButtonTitle, { color: colors.text }]}>
                                {t('cadastrar_moto')}
                            </Text>
                            <Text style={[styles.menuButtonDescription, { color: colors.textSecondary }]}>
                                {t('registre_nova_motocicleta')}
                            </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={22} color={colors.primary} />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={[styles.menuButton, { 
                        backgroundColor: colors.cardBackground,
                        borderColor: colors.primary,
                        shadowColor: colors.primary
                    }]}
                    onPress={() => handleNavigate('TelaDadosM')}
                    activeOpacity={0.8}
                >
                    <View style={styles.menuButtonContent}>
                        <View style={[styles.menuIconContainer, { backgroundColor: colors.primary }]}>
                            <Ionicons name="search" size={24} color="#fff" />
                        </View>
                        <View style={styles.menuTextContainer}>
                            <Text style={[styles.menuButtonTitle, { color: colors.text }]}>
                                {t('visualizar_moto')}
                            </Text>
                            <Text style={[styles.menuButtonDescription, { color: colors.textSecondary }]}>
                                {t('consulte_dados_moto')}
                            </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={22} color={colors.primary} />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={[styles.menuButton, { 
                        backgroundColor: colors.cardBackground,
                        borderColor: colors.primary,
                        shadowColor: colors.primary
                    }]}
                    onPress={() => handleNavigate('TelaEntradaMotoPatio')}
                    activeOpacity={0.8}
                >
                    <View style={styles.menuButtonContent}>
                        <View style={[styles.menuIconContainer, { backgroundColor: colors.primary }]}>
                            <Ionicons name="enter" size={24} color="#fff" />
                        </View>
                        <View style={styles.menuTextContainer}>
                            <Text style={[styles.menuButtonTitle, { color: colors.text }]}>
                                {t('entrada_alocacao')}
                            </Text>
                            <Text style={[styles.menuButtonDescription, { color: colors.textSecondary }]}>
                                {t('registre_entrada_moto')}
                            </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={22} color={colors.primary} />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={[styles.menuButton, { 
                        backgroundColor: colors.cardBackground,
                        borderColor: colors.primary,
                        shadowColor: colors.primary
                    }]}
                    onPress={() => handleNavigate('TelaScanner')}
                    activeOpacity={0.8}
                >
                    <View style={styles.menuButtonContent}>
                        <View style={[styles.menuIconContainer, { backgroundColor: colors.primary }]}>
                            <Ionicons name="exit" size={24} color="#fff" />
                        </View>
                        <View style={styles.menuTextContainer}>
                            <Text style={[styles.menuButtonTitle, { color: colors.text }]}>
                                {t('saida_moto')}
                            </Text>
                            <Text style={[styles.menuButtonDescription, { color: colors.textSecondary }]}>
                                {t('registre_saida_patio')}
                            </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={22} color={colors.primary} />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={[styles.menuButton, { 
                        backgroundColor: colors.cardBackground,
                        borderColor: colors.primary,
                        shadowColor: colors.primary
                    }]}
                    onPress={() => handleNavigate('TelaInfos')}
                    activeOpacity={0.8}
                >
                    <View style={styles.menuButtonContent}>
                        <View style={[styles.menuIconContainer, { backgroundColor: colors.primary }]}>
                            <Ionicons name="person-circle" size={24} color="#fff" />
                        </View>
                        <View style={styles.menuTextContainer}>
                            <Text style={[styles.menuButtonTitle, { color: colors.text }]}>
                                {t('minhas_informacoes')}
                            </Text>
                            <Text style={[styles.menuButtonDescription, { color: colors.textSecondary }]}>
                                {t('veja_dados_cadastrais')}
                            </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={22} color={colors.primary} />
                    </View>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 40,
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
        paddingTop: 50,
        paddingBottom: 30,
        alignItems: 'center',
        position: 'relative',
    },
    profileContainer: {
        alignItems: 'center',
        marginBottom: 16,
    },
    profileImageContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    welcomeText: {
        color: '#fff',
        fontSize: 28,
        fontWeight: 'bold',
        letterSpacing: 0.5,
        marginBottom: 8,
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    subtitleText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },
    mapSection: {
        paddingHorizontal: 20,
        paddingTop: 30,
        paddingBottom: 20,
    },
    mapCard: {
        width: '100%',
        height: 280,
        borderRadius: 24,
        overflow: 'hidden',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 8,
        borderWidth: 3,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    mapPlaceholder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    mapLabelContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.7)',
        paddingVertical: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },
    mapLabel: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 2,
    },
    mapArrow: {
        marginLeft: 5,
    },
    menuSection: {
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    menuHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 20,
    },
    menuSectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        letterSpacing: 0.3,
    },
    menuButton: {
        paddingVertical: 18,
        paddingHorizontal: 20,
        borderRadius: 16,
        marginBottom: 14,
        borderWidth: 2.5,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 6,
    },
    menuButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    menuIconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    menuTextContainer: {
        flex: 1,
    },
    menuButtonTitle: {
        fontSize: 17,
        fontWeight: '700',
        letterSpacing: 0.5,
        marginBottom: 4,
    },
    menuButtonDescription: {
        fontSize: 13,
        lineHeight: 18,
    },
});
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Alert, ScrollView, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { useTheme } from '../context/ContextTheme';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');

export default function TelaAdm({ navigation }) {
    const { colors, toggleTheme, theme } = useTheme();
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
        if (!usuario) return t('administrador');
        
        if (usuario.nome) return usuario.nome.split(' ')[0];
        if (usuario.displayName) return usuario.displayName.split(' ')[0];
        if (usuario.email) return usuario.email.split('@')[0];
        
        return t('administrador');
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
           <ImageBackground 
                source={require('../../assets/fundo.png')} 
                style={styles.topSection}
                resizeMode="cover"
            >
                {/* Header com foto de perfil */}
                <View style={styles.profileContainer}>
                    <View style={styles.profileImageContainer}>
                        <Ionicons name="camera" size={32} color="#fff" />
                    </View>
                    <Text style={styles.editText}>{t('editar_imagem')}</Text>
                </View>

                <Text style={styles.welcomeText}>
                    {t('ola')}, {getNomeUsuario()}!
                </Text>
            </ImageBackground>

            {/* Card de Monitoramento */}
            <View style={styles.monitoringSection}>
                <View style={styles.sectionHeader}>
                    <Ionicons name="stats-chart" size={24} color={colors.primary} />
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                        {t('monitoramento_ativo')}
                    </Text>
                </View>
                
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
                        <Text style={styles.mapLabel}>{t('mapa')}</Text>
                        <Ionicons name="arrow-forward" size={20} color="#fff" style={styles.mapArrow} />
                    </View>
                </TouchableOpacity>
            </View>

            {/* Seção Fluxo Diário */}
            <View style={styles.flowSection}>
                <View style={styles.sectionHeader}>
                    <Ionicons name="time" size={24} color={colors.primary} />
                    <Text style={[styles.flowTitle, { color: colors.text }]}>
                        {t('fluxo_diario')}
                    </Text>
                </View>

                <TouchableOpacity 
                    style={[
                        styles.flowButton,
                        { 
                            backgroundColor: colors.cardBackground,
                            borderColor: colors.primary,
                            shadowColor: colors.primary
                        }
                    ]}
                    onPress={() => handleNavigate('TelaDashboard')}
                    activeOpacity={0.8}
                >
                    <View style={styles.flowButtonContent}>
                        <View style={[styles.flowIconContainer, { backgroundColor: colors.primary }]}>
                            <Ionicons name="bar-chart" size={22} color="#fff" />
                        </View>
                        <Text style={[styles.flowButtonText, { color: colors.text }]}>
                            {t('monitorar_status_operacional')}
                        </Text>
                        <Ionicons name="chevron-forward" size={20} color={colors.primary} />
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
    themeButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.3)',
        zIndex: 10,
    },
    profileContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    profileImageContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
        borderWidth: 3,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    editText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },
    welcomeText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        letterSpacing: 0.5,
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    monitoringSection: {
        paddingHorizontal: 20,
        paddingTop: 30,
        paddingBottom: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 20,
        justifyContent: 'center',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        letterSpacing: 0.3,
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
        fontSize: 20,
        fontWeight: 'bold',
        letterSpacing: 2,
    },
    mapArrow: {
        marginLeft: 5,
    },
    flowSection: {
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    flowTitle: {
        fontSize: 20,
        fontWeight: '700',
        letterSpacing: 0.3,
    },
    flowButton: {
        width: '100%',
        paddingVertical: 20,
        paddingHorizontal: 22,
        borderRadius: 18,
        marginBottom: 16,
        borderWidth: 2.5,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 6,
    },
    flowButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    flowIconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    flowButtonText: {
        flex: 1,
        fontSize: 17,
        fontWeight: '700',
        letterSpacing: 0.5,
        marginLeft: 15,
    },
});
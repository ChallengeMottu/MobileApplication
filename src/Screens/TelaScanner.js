import { useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from '../context/ContextTheme';
import { useTranslation } from 'react-i18next';

export default function TelaScanner() {
    const navigation = useNavigation();
    const [rastreandoStatus, setRastreandoStatus] = useState(false);
    const { colors } = useTheme();
    const { t } = useTranslation();

    const toggleRastreando = () => {
        setRastreandoStatus(prevStatus => !prevStatus);
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Botão GoBack */}
            <TouchableOpacity
                style={styles.goBack}
                onPress={() => navigation.navigate('TelaFuncionario')}   
            >
                <Ionicons name="arrow-back" size={20} color={colors.text} />
            </TouchableOpacity>

            {/* Conteúdo principal */}
            <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
                <View style={styles.containerImagem}>
                    <Image style={styles.iconeMoto} source={require('../../assets/motoIcon.png')} />
                </View>

                <Text style={[styles.titulo, { color: colors.text }]}>
                    {t('entrada_motos_patio')}
                </Text>
                <Text style={[styles.subtitulo, { color: colors.textSecondary }]}>
                    {t('identifique_codigo_uso_moto')}
                </Text>

                {!rastreandoStatus ? (
                    <TouchableOpacity 
                        onPress={toggleRastreando} 
                        style={[styles.botao, { backgroundColor: colors.primary }]}
                    >
                        <Text style={[styles.textoBotao, { color: colors.primaryText }]}>
                            {t('rastrear')}
                        </Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity 
                        onPress={toggleRastreando} 
                        style={[styles.botao, { backgroundColor: colors.primary }]}
                    >
                        <Text style={[styles.textoBotao, { color: colors.primaryText }]}>
                            {t('parar_rastreamento')}
                        </Text>
                    </TouchableOpacity>
                )}

                {rastreandoStatus && (
                    <View style={[styles.rastreandoContainer, { backgroundColor: colors.cardSecondary }]}>
                        <Text style={{ color: colors.text, textAlign: 'center' }}>
                            {t('rastreando_motos')}
                        </Text>
                        <ActivityIndicator size="large" color={colors.text} style={styles.spinner} />
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    goBack: {
        position: 'absolute',
        top: 40,
        left: 20,
        padding: 8,
    },
    containerImagem: {
        alignItems: 'center',
        marginBottom: 10,
    },
    iconeMoto: {
        width: 80,
        height: 60,
    },
    card: {
        width: '85%',
        padding: 25,
        borderRadius: 12,
        shadowColor: '#01743A',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
        alignItems: 'center',
    },
    botao: {
        borderRadius: 8,
        padding: 10,
        marginTop: 10,
        width: '100%',
    },
    textoBotao: {
        fontSize: 16,
        fontFamily: 'DarkerGrotesque_700Bold',
        textAlign: 'center',
        paddingBottom: 5
    },
    titulo: {
        fontSize: 24,
        fontFamily: 'DarkerGrotesque_700Bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    subtitulo: {
        fontFamily: 'DarkerGrotesque_500Medium',
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 20
    },
    rastreandoContainer: {
        marginTop: 20,
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        width: '100%',
    },
    spinner: {
        marginTop: 20,
    }
});
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function TelaDadosM({ navigation }) {
    const [dadosMoto, setDadosMoto] = useState(null);

    useEffect(() => {
        const carregarDados = async () => {
            try {
                const dadosSalvos = await AsyncStorage.getItem('dadosMoto');
                if (dadosSalvos) {
                    setDadosMoto(JSON.parse(dadosSalvos));
                }
            } catch (error) {
                console.log('Erro ao carregar dados: ', error);
            }
        };

        carregarDados();


        const unsubscribe = navigation.addListener('focus', () => {
            carregarDados();
        });

        return unsubscribe;
    }, [navigation]);

    if (!dadosMoto) {
        return (
            <View style={styles.container}>
                <Text style={styles.texto}>Nenhum dado cadastrado.</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.scrollView}>
            <View style={styles.card}>
                <Text style={styles.titulo}>FICHA MOTO {dadosMoto.placa}</Text>

                <View style={styles.tabela}>
                    <View style={styles.linha}>
                        <Text style={styles.colunaTitulo}>MODELO:</Text>
                        <Text style={styles.colunaValor}>{dadosMoto.modelo}</Text>
                    </View>
                    <View style={styles.linha}>
                        <Text style={styles.colunaTitulo}>ANO FABRICAÇÃO:</Text>
                        <Text style={styles.colunaValor}>{dadosMoto.anoFabricacao}</Text>
                    </View>
                    <View style={styles.linha}>
                        <Text style={styles.colunaTitulo}>NÚMERO DE CHASSI:</Text>
                        <Text style={styles.colunaValor}>{dadosMoto.numeroChassi}</Text>
                    </View>
                    <View style={styles.linha}>
                        <Text style={styles.colunaTitulo}>CÓDIGO BEACON:</Text>
                        <Text style={styles.colunaValor}>{dadosMoto.codigoBeacon}</Text>
                    </View>
                    <View style={styles.linha}>
                        <Text style={styles.colunaTitulo}>CONDIÇÃO MECÂNICA:</Text>
                        <Text style={styles.colunaValor}>{dadosMoto.condicaoMecanica}</Text>
                    </View>
                    <View style={styles.linha}>
                        <Text style={styles.colunaTitulo}>STATUS:</Text>
                        <Text style={styles.colunaValor}>{dadosMoto.status}</Text>
                    </View>
                    <View style={styles.linha}>
                        <Text style={styles.colunaTitulo}>LOCALIZAÇÃO NO PÁTIO:</Text>
                        <Text style={styles.colunaValor}>{dadosMoto.localizacaoPatio || '---'}</Text>
                    </View>
                </View>

                <Image
                    style={styles.motoImagem}
                    source={require('../../assets/moto.png')}
                />
                <View style={styles.linha2}>
                    <Text style={styles.colunaTitulo2}>Placa:</Text>
                </View>

                <View style={styles.linha3}>
                    <Text style={styles.colunaValor2}>{dadosMoto.placa}</Text>
                </View>

            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        backgroundColor: '#000',
    },
    card: {
        margin: 20,
        padding: 20,
        borderRadius: 12,
        borderWidth: 4,
        borderColor: '#11881D',
        backgroundColor: '#332f2f',
    },
    titulo: {
        fontSize: 28,
        fontFamily: 'DarkerGrotesque_700Bold',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 30,
        borderBottomWidth: 2,
        borderBottomColor: '#fff',
        paddingBottom: 10,
    },
    tabela: {
        marginBottom: 30,
    },
    linha: {
        flexDirection: 'row',
        backgroundColor: '#433e3e',
        borderWidth: 1,
        paddingVertical: 12,
        paddingHorizontal: 10,
        marginBottom: 8,
        borderRadius: 6,
    },
    linha2: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 10,
    },
    linha3: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: -15,

    },
    colunaTitulo: {
        color: '#fff',
        fontSize: 18,
        fontFamily: 'DarkerGrotesque_700Bold',
    },
    colunaTitulo2: {
        color: '#fff',
        fontSize: 18,
        fontFamily: 'DarkerGrotesque_500Medium',
    },
    colunaValor: {
        flex: 2,
        color: '#fff',
        fontSize: 18,
        fontFamily: 'DarkerGrotesque_500Medium',
        marginLeft: 10
    },
    colunaValor2: {
        flexDirection: 'row',
        alignItems: 'center',
        color: '#fff',
        fontSize: 25,
        fontFamily: 'DarkerGrotesque_700Bold',

    },
    motoImagem: {
        width: '100%',
        height: 290,
        resizeMode: 'contain',
        alignSelf: 'center',
        marginTop: -60,
        marginBottom: -30,
    },
});

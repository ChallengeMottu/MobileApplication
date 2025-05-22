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
                <Text style={styles.titulo}>Ficha da Moto</Text>


                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableHeader}>Placa</Text>
                        <Text style={styles.tableData}>{dadosMoto.placa}</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableHeader}>Modelo</Text>
                        <Text style={styles.tableData}>{dadosMoto.modelo}</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableHeader}>Ano de Fabricação</Text>
                        <Text style={styles.tableData}>{dadosMoto.anoFabricacao}</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableHeader}>Número de Chassi</Text>
                        <Text style={styles.tableData}>{dadosMoto.numeroChassi}</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableHeader}>Código Beacon</Text>
                        <Text style={styles.tableData}>{dadosMoto.codigoBeacon}</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableHeader}>Condição Mecânica</Text>
                        <Text style={styles.tableData}>{dadosMoto.condicaoMecanica}</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableHeader}>Status</Text>
                        <Text style={styles.tableData}>{dadosMoto.status}</Text>
                    </View>
                </View>
                <Image
                    style={styles.motoImagem}
                    source={require('../../assets/motoTabela.png')} />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
    scrollView: {
        padding: 20,
    },
    card: {
        backgroundColor: '#000',
        padding: 20,
        borderRadius: 12,
        shadowColor: '#11881D',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    titulo: {
        fontSize: 24,
        fontFamily: 'DarkerGrotesque_700Bold',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 20,
    },
    table: {
        marginTop: 20,
        marginBottom: 30
    },
    tableRow: {
        flexDirection: 'row',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#11881D',
        justifyContent: 'space-between',
    },
    tableHeader: {
        fontSize: 16,
        fontFamily: 'DarkerGrotesque_700Bold',
        color: '#ffff',
        width: '45%',
    },
    tableData: {
        fontSize: 16,
        fontFamily: 'DarkerGrotesque_500Medium',
        color: '#ffff',
        width: '45%',
    },
    motoImagem: {
        width: 300,
        height: 200
    }
});

import { DarkerGrotesque_500Medium, DarkerGrotesque_700Bold, useFonts } from '@expo-google-fonts/darker-grotesque';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ContextTheme';

export default function TelaDadosM() {
  const navigation = useNavigation();
  const { colors } = useTheme();

  let [fontsLoaded] = useFonts({
    DarkerGrotesque_500Medium,
    DarkerGrotesque_700Bold,
  });

  const [motos, setMotos] = useState([]);

  // Carrega os dados sempre que a tela ganha foco
  useFocusEffect(
    useCallback(() => {
      carregarMotos();
    }, [])
  );

  const carregarMotos = async () => {
    try {
      const dadosSalvos = await AsyncStorage.getItem('dadosMoto');
      if (dadosSalvos) {
        const moto = JSON.parse(dadosSalvos);
        setMotos([moto]); // Coloca em array para exibir
      } else {
        setMotos([]);
      }
    } catch (error) {
      console.log('Erro ao carregar motos:', error);
    }
  };

  const confirmarExclusao = (index) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir esta moto?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          onPress: () => excluirMoto(index),
          style: 'destructive',
        },
      ]
    );
  };

  const excluirMoto = async (index) => {
    try {
      await AsyncStorage.removeItem('dadosMoto');
      setMotos([]);
      Alert.alert('Sucesso', 'Moto excluída com sucesso!');
    } catch (error) {
      console.log('Erro ao excluir moto:', error);
      Alert.alert('Erro', 'Não foi possível excluir a moto.');
    }
  };

  if (!fontsLoaded) return null;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.goBack} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Motos Cadastradas</Text>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: colors.primary }]}
          onPress={() => navigation.navigate('TelaCadastroM')}
        >
          <Ionicons name="add" size={24} color={colors.primaryText} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {motos.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="bicycle-outline" size={80} color={colors.textSecondary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              Nenhuma moto cadastrada
            </Text>
            <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
              Clique no botão + para adicionar uma nova moto
            </Text>
          </View>
        ) : (
          motos.map((moto, index) => (
            <View key={index} style={[styles.card, { backgroundColor: colors.cardBackground }]}>
              <View style={styles.cardHeader}>
                <View style={styles.placaContainer}>
                  <Text style={[styles.placa, { color: colors.primary }]}>{moto.placa || 'Sem Placa'}</Text>
                  <Text style={[styles.modelo, { color: colors.text }]}>{moto.modelo}</Text>
                </View>
                <TouchableOpacity
                  style={[styles.deleteButton, { backgroundColor: '#FF4444' }]}
                  onPress={() => confirmarExclusao(index)}
                >
                  <Ionicons name="trash-outline" size={20} color="#FFF" />
                </TouchableOpacity>
              </View>

              <View style={[styles.separador, { backgroundColor: colors.border }]} />

              <View style={styles.infoRow}>
                <View style={styles.infoItem}>
                  <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Chassi</Text>
                  <Text style={[styles.infoValue, { color: colors.text }]}>{moto.numeroChassi}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Ano</Text>
                  <Text style={[styles.infoValue, { color: colors.text }]}>{moto.anoFabricacao || 'N/A'}</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <View style={styles.infoItemFull}>
                  <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Status</Text>
                  <Text style={[styles.infoValue, { color: colors.text }]} numberOfLines={2}>
                    {moto.status}
                  </Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <View style={styles.infoItemFull}>
                  <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Condição Mecânica</Text>
                  <Text style={[styles.infoValue, { color: colors.text }]} numberOfLines={2}>
                    {moto.condicaoMecanica}
                  </Text>
                </View>
              </View>

              {moto.aparatoFisico && (
                <View style={styles.infoRow}>
                  <View style={styles.infoItemFull}>
                    <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Aparato Físico</Text>
                    <Text style={[styles.infoValue, { color: colors.text }]}>{moto.aparatoFisico}</Text>
                  </View>
                </View>
              )}

              {moto.codigoBeacon && (
                <View style={styles.infoRow}>
                  <View style={styles.infoItemFull}>
                    <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Código Beacon</Text>
                    <Text style={[styles.infoValue, { color: colors.text }]}>{moto.codigoBeacon}</Text>
                  </View>
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  goBack: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'DarkerGrotesque_700Bold',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 10,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 20,
    fontFamily: 'DarkerGrotesque_700Bold',
    marginTop: 20,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 16,
    fontFamily: 'DarkerGrotesque_500Medium',
    marginTop: 8,
    textAlign: 'center',
  },
  card: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  placaContainer: {
    flex: 1,
  },
  placa: {
    fontSize: 28,
    fontFamily: 'DarkerGrotesque_700Bold',
    letterSpacing: 1,
  },
  modelo: {
    fontSize: 18,
    fontFamily: 'DarkerGrotesque_500Medium',
    marginTop: 4,
  },
  deleteButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  separador: {
    height: 1,
    marginVertical: 15,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 15,
    gap: 15,
  },
  infoItem: {
    flex: 1,
  },
  infoItemFull: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    fontFamily: 'DarkerGrotesque_500Medium',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontFamily: 'DarkerGrotesque_700Bold',
  },
});
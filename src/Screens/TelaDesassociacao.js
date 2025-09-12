import React, { useState } from 'react';
import {View, Text, TextInput, TouchableOpacity, Alert, ScrollView, StyleSheet, ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const STORAGE_KEYS_TO_TRY = ['dadosMoto', 'motos'];

const normalizePlate = (s) => (s || '').toString().replace(/\s+/g, '').toUpperCase();

export default function TelaDesassociacao({ navigation }) {
  const [placaBusca, setPlacaBusca] = useState('');
  const [moto, setMoto] = useState(null);
  const [storeKeyEncontrado, setStoreKeyEncontrado] = useState(null);
  const [rawListFound, setRawListFound] = useState(null);
  const [carregando, setCarregando] = useState(false);

  const buscarMoto = async () => {
    const placaNormalized = normalizePlate(placaBusca);
    if (!placaNormalized) {
      Alert.alert('ERRO', 'Digite a placa do veículo antes de buscar.');
      return;
    }

    setCarregando(true);
    setMoto(null);

    try {
      let found = null;
      let foundKey = null;
      let foundList = null;

      for (const key of STORAGE_KEYS_TO_TRY) {
        const dadosSalvos = await AsyncStorage.getItem(key);
        if (!dadosSalvos) continue;

        try {
          const parsed = JSON.parse(dadosSalvos);

          if (Array.isArray(parsed)) {
            const item = parsed.find((m) => normalizePlate(m.placa) === placaNormalized);
            if (item) {
              found = item;
              foundKey = key;
              foundList = parsed;
              break;
            }
          } else if (typeof parsed === 'object' && parsed !== null) {
            if (normalizePlate(parsed.placa) === placaNormalized) {
              found = parsed;
              foundKey = key;
              foundList = null;
              break;
            }
          }
        } catch (parseError) {
          console.log(`Erro ao fazer parse do ${key}:`, parseError);
          continue;
        }
      }

      if (!found) {
        Alert.alert('ACESSO NEGADO', 'Nenhum veículo cadastrado com essa placa.');
        setMoto(null);
        setStoreKeyEncontrado(null);
        setRawListFound(null);
      } else {
        setMoto(found);
        setStoreKeyEncontrado(foundKey);
        setRawListFound(foundList);
      }
    } catch (error) {
      console.log('Erro ao buscar moto:', error);
      Alert.alert('ERRO CRÍTICO', 'Falha ao acessar base de dados.');
    } finally {
      setCarregando(false);
    }
  };

  const confirmarDesassociar = () => {
    if (!moto) return;

    const hasBeaconValue = (moto.codigoBeacon && moto.codigoBeacon.trim()) || moto.beaconId;

    if (!hasBeaconValue) {
      Alert.alert('SISTEMA ATUALIZADO', 'Este veículo já não possui beacon associado.');
      return;
    }

    Alert.alert(
      'CONFIRMAR OPERAÇÃO',
      'Deseja desassociar o beacon deste veículo?',
      [
        { text: 'CANCELAR', style: 'cancel' },
        { text: 'CONFIRMAR', style: 'destructive', onPress: desassociarBeacon },
      ]
    );
  };

  const desassociarBeacon = async () => {
    try {
      if (!storeKeyEncontrado || !moto) {
        Alert.alert('ERRO CRÍTICO', 'Chave de armazenamento não identificada. Refaça a busca.');
        return;
      }

      if (rawListFound && Array.isArray(rawListFound)) {
        const updatedList = rawListFound.map((m) => {
          if (normalizePlate(m.placa) === normalizePlate(moto.placa)) {
            return { ...m, codigoBeacon: '', beaconId: null };
          }
          return m;
        });

        await AsyncStorage.setItem(storeKeyEncontrado, JSON.stringify(updatedList));
        const itemAtualizado = updatedList.find((m) => normalizePlate(m.placa) === normalizePlate(moto.placa));
        setMoto(itemAtualizado);
        setRawListFound(updatedList);
      } else {
        const updated = { ...moto, codigoBeacon: '', beaconId: null };
        await AsyncStorage.setItem(storeKeyEncontrado, JSON.stringify(updated));
        setMoto(updated);
      }

      Alert.alert('OPERAÇÃO CONCLUÍDA', 'Beacon desassociado com sucesso!');
    } catch (error) {
      console.log('Erro ao desassociar beacon:', error);
      Alert.alert('ERRO CRÍTICO', 'Não foi possível desassociar o beacon.');
    }
  };

  const hasBeacon = moto && ((moto.codigoBeacon && moto.codigoBeacon.trim()) || moto.beaconId);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header da operação */}
      <View style={styles.operationHeader}>
        <Ionicons name="unlink" size={28} color="#ff4444" />
        <Text style={styles.operationTitle}>DESASSOCIAÇÃO DE BEACON</Text>
        <Text style={styles.operationSubtitle}>REMOVER DISPOSITIVO DE RASTREAMENTO</Text>
      </View>

      {/* Painel de busca */}
      <View style={styles.searchPanel}>
        <View style={styles.panelHeader}>
          <Ionicons name="search" size={20} color="#ff4444" />
          <Text style={styles.panelTitle}>LOCALIZAR VEÍCULO</Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>PLACA DO VEÍCULO</Text>
          <TextInput
            style={styles.input}
            placeholder="DIGITE A PLACA (EX: ABC1234)"
            placeholderTextColor="#666"
            value={placaBusca}
            onChangeText={(text) => {
              setPlacaBusca(text);
              if (moto) {
                setMoto(null);
              }
            }}
            autoCapitalize="characters"
            editable={!carregando}
          />
        </View>

        <TouchableOpacity
          style={[styles.searchButton, carregando && styles.buttonDisabled]}
          onPress={buscarMoto}
          disabled={carregando}
          activeOpacity={0.8}
        >
          {carregando ? (
            <>
              <ActivityIndicator size="small" color="#ffffff" />
              <Text style={styles.buttonText}>PROCESSANDO...</Text>
            </>
          ) : (
            <>
              <Ionicons name="search" size={20} color="#ffffff" />
              <Text style={styles.buttonText}>INICIAR BUSCA</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {moto && (
        <View style={styles.vehicleCard}>
          <View style={styles.cardHeader}>
            <Ionicons name="bicycle" size={24} color="#ff4444" />
            <Text style={styles.cardTitle}>DADOS DO VEÍCULO</Text>
            <View style={styles.statusIndicator}>
              <View style={[styles.statusDot, hasBeacon ? styles.statusActive : styles.statusInactive]} />
              <Text style={[styles.statusText, hasBeacon ? styles.statusTextActive : styles.statusTextInactive]}>
                {hasBeacon ? 'BEACON ATIVO' : 'SEM BEACON'}
              </Text>
            </View>
          </View>

          <View style={styles.dataGrid}>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>PLACA</Text>
              <View style={styles.dataValueContainer}>
                <Text style={styles.dataValue}>{moto.placa}</Text>
              </View>
            </View>

            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>MODELO</Text>
              <View style={styles.dataValueContainer}>
                <Text style={styles.dataValue}>{moto.modelo || 'NÃO INFORMADO'}</Text>
              </View>
            </View>

            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>ANO DE FABRICAÇÃO</Text>
              <View style={styles.dataValueContainer}>
                <Text style={styles.dataValue}>{moto.anoFabricacao || 'NÃO INFORMADO'}</Text>
              </View>
            </View>

            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>CHASSI</Text>
              <View style={styles.dataValueContainer}>
                <Text style={styles.dataValue}>{moto.numeroChassi || 'NÃO INFORMADO'}</Text>
              </View>
            </View>

            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>BEACON ASSOCIADO</Text>
              <View style={[styles.dataValueContainer, hasBeacon ? styles.beaconActive : styles.beaconInactive]}>
                <Text style={styles.dataValue}>
                  {(moto.codigoBeacon && moto.codigoBeacon.trim())
                    ? moto.codigoBeacon
                    : (moto.beaconId ? moto.beaconId : 'NENHUM ASSOCIADO')}
                </Text>
                {hasBeacon && (
                  <Ionicons name="warning" size={16} color="#ff4444" style={styles.warningIcon} />
                )}
              </View>
            </View>
          </View>

          {/* Área de perigo */}
          <View style={styles.dangerZone}>
            <TouchableOpacity
              style={[styles.disconnectButton, !hasBeacon && styles.buttonDisabled]}
              onPress={confirmarDesassociar}
              disabled={!hasBeacon}
              activeOpacity={0.8}
            >
              <Ionicons name="unlink" size={20} color="#ffffff" />
              <Text style={styles.disconnectText}>
                {hasBeacon ? 'DESASSOCIAR BEACON' : 'NENHUM BEACON ASSOCIADO'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },

  operationHeader: {
    backgroundColor: '#111111',
    margin: 20,
    padding: 25,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#222222',
  },
  operationTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginTop: 15,
    textAlign: 'center',
  },
  operationSubtitle: {
    color: '#666',
    fontSize: 13,
    letterSpacing: 0.5,
    marginTop: 8,
    textAlign: 'center',
  },

  searchPanel: {
    backgroundColor: '#111111',
    margin: 20,
    padding: 25,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#222222',
  },
  panelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  panelTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
    letterSpacing: 0.5,
  },
  inputContainer: { marginBottom: 20 },
  inputLabel: {
    color: '#ff4444',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    padding: 15,
    color: '#ffffff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333333',
    letterSpacing: 0.5,
  },
  searchButton: {
    backgroundColor: '#ff4444',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: { opacity: 0.4, backgroundColor: '#555' },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
    letterSpacing: 0.5,
  },

  vehicleCard: {
    backgroundColor: '#111111',
    margin: 20,
    padding: 25,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#222222',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  cardTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
    letterSpacing: 1,
    flex: 1,
  },
  statusIndicator: { flexDirection: 'row', alignItems: 'center' },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  statusActive: { backgroundColor: '#ff4444' },
  statusInactive: { backgroundColor: '#666' },
  statusText: { fontSize: 12, fontWeight: 'bold', letterSpacing: 1 },
  statusTextActive: { color: '#ff4444' },
  statusTextInactive: { color: '#666' },

  dataGrid: { marginBottom: 25 },
  dataRow: { marginBottom: 15 },
  dataLabel: {
    color: '#ff4444',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 8,
  },
  dataValueContainer: {
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#333333',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dataValue: { color: '#ffffff', fontSize: 14, letterSpacing: 0.2, flex: 1 },
  beaconActive: {
    borderColor: '#ff4444',
    backgroundColor: 'rgba(255, 68, 68, 0.1)',
  },
  beaconInactive: {
    borderColor: '#666',
    backgroundColor: 'rgba(102, 102, 102, 0.1)',
  },
  warningIcon: { marginLeft: 10 },

  dangerZone: { borderRadius: 15, padding: 20 },
  disconnectButton: {
    backgroundColor: '#ff4444',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disconnectText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 12,
    letterSpacing: 1,
  },
});

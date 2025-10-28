import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ContextTheme';
import { useTranslation } from 'react-i18next';

export default function TelaDadosM({ navigation }) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [placa, setPlaca] = useState('');
  const [motoEncontrada, setMotoEncontrada] = useState(null);
  const [buscando, setBuscando] = useState(false);
  const [erro, setErro] = useState('');
  const [animacaoValor] = useState(new Animated.Value(0));

  useEffect(() => {
    iniciarAnimacao();
  }, []);

  const iniciarAnimacao = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animacaoValor, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(animacaoValor, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const buscarMoto = async () => {
    if (!placa.trim()) {
      setErro(t('por_favor_digite_placa'));
      return;
    }

    setBuscando(true);
    setErro('');
    setMotoEncontrada(null);

    try {
      const motosSalvas = await AsyncStorage.getItem('motosCadastradas');
      
      if (motosSalvas) {
        const listaMotos = JSON.parse(motosSalvas);
        const moto = listaMotos.find(m => m.placa.toUpperCase() === placa.toUpperCase());
        
        if (moto) {
          setMotoEncontrada(moto);
          setErro('');
        } else {
          setErro(t('moto_nao_encontrada'));
          setMotoEncontrada(null);
        }
      } else {
        setErro(t('nenhuma_moto_cadastrada'));
      }
    } catch (error) {
      console.error('Erro ao buscar moto:', error);
      setErro(t('erro_buscar_dados'));
    } finally {
      setBuscando(false);
    }
  };

  const limparBusca = () => {
    setPlaca('');
    setMotoEncontrada(null);
    setErro('');
  };

  const getStatusColor = (status) => {
    if (status === 'Moto normal com placa') return '#00FF94';
    if (status === 'Moto sem placa') return '#FFD600';
    if (status?.toLowerCase().includes('manutenção') || 
        status?.toLowerCase().includes('manutencao') ||
        status?.toLowerCase().includes('acidente') ||
        status?.toLowerCase().includes('furto')) return '#FF3D71';
    return colors.text;
  };

  const getStatusIcon = (status) => {
    if (status === 'Moto normal com placa') return 'checkmark-circle';
    if (status === 'Moto sem placa') return 'time';
    if (status?.toLowerCase().includes('manutenção') || 
        status?.toLowerCase().includes('manutencao') ||
        status?.toLowerCase().includes('acidente') ||
        status?.toLowerCase().includes('furto')) return 'construct';
    return 'alert-circle';
  };

  const formatarData = (dataISO) => {
    const data = new Date(dataISO);
    return data.toLocaleDateString('pt-BR') + ' às ' + data.toLocaleTimeString('pt-BR');
  };

  const calcularTempoDesde = (dataISO) => {
    const agora = new Date();
    const dataCadastro = new Date(dataISO);
    const diffMs = agora - dataCadastro;
    const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHoras = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (diffDias > 0) {
      return `${diffDias} ${diffDias === 1 ? 'dia' : 'dias'}`;
    }
    return `${diffHoras} ${diffHoras === 1 ? 'hora' : 'horas'}`;
  };

  const pulseOpacity = animacaoValor.interpolate({
    inputRange: [0, 1],
    outputRange: [0.6, 1],
  });

  const DataField = ({ icon, label, value, color }) => (
    <View style={[styles.dataField, { backgroundColor: colors.cardBackground }]}>
      <View style={[styles.dataIconContainer, { backgroundColor: color + '15' }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <View style={styles.dataContent}>
        <Text style={[styles.dataLabel, { color: colors.textSecondary }]}>{label}</Text>
        <Text style={[styles.dataValue, { color: colors.text }]}>{value || 'N/A'}</Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <View style={styles.headerContent}>
          <Ionicons name="search" size={32} color="#fff" />
          <Text style={styles.headerTitle}>{t('consultar_moto')}</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="close" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Search Section */}
      <View style={[styles.searchSection, { backgroundColor: colors.cardBackground }]}>
        <Text style={[styles.searchTitle, { color: colors.text }]}>
          <Ionicons name="barcode" size={20} color={colors.primary} /> {t('digite_placa')}
        </Text>
        
        <View style={styles.searchContainer}>
          <View style={[styles.inputWrapper, { backgroundColor: colors.inputBackground, borderColor: colors.border }]}>
            <Ionicons name="car" size={24} color={colors.primary} style={styles.inputIcon} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              value={placa}
              onChangeText={setPlaca}
              placeholder={t('exemplo_placa')}
              placeholderTextColor={colors.textSecondary}
              autoCapitalize="characters"
              maxLength={7}
            />
            {placa.length > 0 && (
              <TouchableOpacity onPress={limparBusca}>
                <Ionicons name="close-circle" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            style={[styles.searchButton, { backgroundColor: buscando ? colors.inputBackground : colors.primary }]}
            onPress={buscarMoto}
            disabled={buscando}
            activeOpacity={0.8}
          >
            <Ionicons name={buscando ? "hourglass" : "search"} size={24} color="#fff" />
            <Text style={styles.searchButtonText}>
              {buscando ? t('buscando') : t('buscar')}
            </Text>
          </TouchableOpacity>
        </View>

        {erro && (
          <View style={[styles.errorContainer, { backgroundColor: '#FF3D71' + '20', borderColor: '#FF3D71' }]}>
            <Ionicons name="alert-circle" size={24} color="#FF3D71" />
            <Text style={[styles.errorText, { color: '#FF3D71' }]}>{erro}</Text>
          </View>
        )}
      </View>

      {/* Results Section */}
      {motoEncontrada && (
        <View style={styles.resultsSection}>
          {/* Status Card */}
          <View style={[styles.statusCard, { 
            backgroundColor: colors.cardBackground,
            borderTopColor: getStatusColor(motoEncontrada.status)
          }]}>
            <View style={styles.statusHeader}>
              <View style={[styles.statusIconBg, { backgroundColor: getStatusColor(motoEncontrada.status) + '20' }]}>
                <Ionicons 
                  name={getStatusIcon(motoEncontrada.status)} 
                  size={40} 
                  color={getStatusColor(motoEncontrada.status)} 
                />
              </View>
              <View style={styles.statusInfo}>
                <Text style={[styles.statusPlaca, { color: colors.text }]}>{motoEncontrada.placa}</Text>
                <Text style={[styles.statusModelo, { color: colors.textSecondary }]}>
                  {motoEncontrada.modelo}
                </Text>
              </View>
            </View>
            
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(motoEncontrada.status) + '20' }]}>
              <Text style={[styles.statusText, { color: getStatusColor(motoEncontrada.status) }]}>
                {motoEncontrada.status}
              </Text>
            </View>
          </View>

          {/* Information Section */}
          <View style={styles.infoSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              <Ionicons name="information-circle" size={20} color={colors.primary} /> {t('informacoes_basicas')}
            </Text>

            <DataField
              icon="key"
              label={t('numero_chassi')}
              value={motoEncontrada.numeroChassi}
              color="#00D9FF"
            />

            <DataField
              icon="calendar"
              label={t('ano_fabricacao')}
              value={motoEncontrada.anoFabricacao?.toString()}
              color="#9D4EDD"
            />

            <DataField
              icon="bluetooth"
              label={t('codigo_beacon')}
              value={motoEncontrada.codigoBeacon === 'N/A' ? t('nao_associado') : motoEncontrada.codigoBeacon}
              color={motoEncontrada.codigoBeacon === 'N/A' ? '#FF6B00' : '#00FF94'}
            />
          </View>

          {/* Technical Section */}
          <View style={styles.infoSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              <Ionicons name="build" size={20} color={colors.primary} /> {t('condicoes_fisicas')}
            </Text>

            <DataField
              icon="settings"
              label={t('condicao_mecanica')}
              value={motoEncontrada.condicaoMecanica}
              color="#FFD600"
            />

            <DataField
              icon="checkmark-done"
              label={t('aparato_fisico')}
              value={motoEncontrada.aparatoFisico}
              color="#00FF94"
            />
          </View>

          {/* Registry Section */}
          <View style={styles.infoSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              <Ionicons name="time" size={20} color={colors.primary} /> {t('informacoes_registro')}
            </Text>

            <View style={[styles.registryCard, { backgroundColor: colors.cardBackground }]}>
              <View style={styles.registryItem}>
                <Ionicons name="calendar-outline" size={20} color={colors.primary} />
                <View style={styles.registryContent}>
                  <Text style={[styles.registryLabel, { color: colors.textSecondary }]}>
                    {t('data_cadastro')}
                  </Text>
                  <Text style={[styles.registryValue, { color: colors.text }]}>
                    {formatarData(motoEncontrada.dataCadastro)}
                  </Text>
                </View>
              </View>

              <View style={[styles.registryDivider, { backgroundColor: colors.border }]} />

              <View style={styles.registryItem}>
                <Ionicons name="hourglass-outline" size={20} color={colors.primary} />
                <View style={styles.registryContent}>
                  <Text style={[styles.registryLabel, { color: colors.textSecondary }]}>
                    {t('tempo_sistema')}
                  </Text>
                  <Text style={[styles.registryValue, { color: colors.text }]}>
                    {calcularTempoDesde(motoEncontrada.dataCadastro)}
                  </Text>
                </View>
              </View>

              <View style={[styles.registryDivider, { backgroundColor: colors.border }]} />

              <View style={styles.registryItem}>
                <Ionicons name="finger-print" size={20} color={colors.primary} />
                <View style={styles.registryContent}>
                  <Text style={[styles.registryLabel, { color: colors.textSecondary }]}>
                    {t('id_sistema')}
                  </Text>
                  <Text style={[styles.registryValue, { color: colors.text }]}>
                    #{motoEncontrada.id}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Action Button */}
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.primary }]}
            onPress={limparBusca}
            activeOpacity={0.8}
          >
            <Ionicons name="refresh" size={24} color="#fff" />
            <Text style={styles.actionButtonText}>{t('nova_consulta')}</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Empty State */}
      {!motoEncontrada && !erro && placa.length === 0 && (
        <View style={styles.emptyState}>
          <Animated.View style={{ opacity: pulseOpacity }}>
            <Ionicons name="search-outline" size={80} color={colors.primary} />
          </Animated.View>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            {t('consulte_moto')}
          </Text>
          <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
            {t('digite_placa_visualizar_dados')}
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 25,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 0.5,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchSection: {
    marginHorizontal: 20,
    marginTop: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  searchTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  searchContainer: {
    gap: 12,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 2,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 1,
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#01743A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 15,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
  },
  errorText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
  },
  resultsSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  statusCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    borderTopWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  statusIconBg: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusInfo: {
    flex: 1,
  },
  statusPlaca: {
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 4,
  },
  statusModelo: {
    fontSize: 16,
    fontWeight: '600',
  },
  statusBadge: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  infoSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  dataField: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  dataIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  dataContent: {
    flex: 1,
  },
  dataLabel: {
    fontSize: 13,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dataValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  registryCard: {
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  registryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  registryContent: {
    flex: 1,
  },
  registryLabel: {
    fontSize: 13,
    marginBottom: 4,
  },
  registryValue: {
    fontSize: 15,
    fontWeight: '600',
  },
  registryDivider: {
    height: 1,
    marginVertical: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 18,
    borderRadius: 12,
    marginTop: 10,
    shadowColor: '#01743A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 12,
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
});
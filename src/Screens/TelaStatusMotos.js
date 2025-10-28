import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Animated, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ContextTheme';
import { useTranslation } from 'react-i18next';

export default function TelaStatusMotos({ navigation }) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [placa, setPlaca] = useState('');
  const [motoEncontrada, setMotoEncontrada] = useState(null);
  const [buscando, setBuscando] = useState(false);
  const [erro, setErro] = useState('');
  const [animacaoValor] = useState(new Animated.Value(0));
  const [novoStatus, setNovoStatus] = useState('');
  const [mostrarDiagnostico, setMostrarDiagnostico] = useState(false);
  const [diagnostico, setDiagnostico] = useState('');
  const [salvando, setSalvando] = useState(false);

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
    setNovoStatus('');
    setMostrarDiagnostico(false);
    setDiagnostico('');

    try {
      const motosSalvas = await AsyncStorage.getItem('motosCadastradas');
      
      if (motosSalvas) {
        const listaMotos = JSON.parse(motosSalvas);
        const moto = listaMotos.find(m => m.placa.toUpperCase() === placa.toUpperCase());
        
        if (moto) {
          setMotoEncontrada(moto);
          setNovoStatus(moto.status);
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

  const handleStatusChange = (status) => {
    setNovoStatus(status);
    if (status === 'Moto em manutenção') {
      setMostrarDiagnostico(true);
    } else {
      setMostrarDiagnostico(false);
      setDiagnostico('');
    }
  };

  const salvarAlteracoes = async () => {
    if (novoStatus === 'Moto em manutenção' && !diagnostico.trim()) {
      Alert.alert(t('diagnostico_obrigatorio'), t('informe_diagnostico_problema'));
      return;
    }

    setSalvando(true);

    try {
      const motosSalvas = await AsyncStorage.getItem('motosCadastradas');
      const listaMotos = JSON.parse(motosSalvas);
      
      const index = listaMotos.findIndex(m => m.placa === motoEncontrada.placa);
      
      if (index !== -1) {
        listaMotos[index] = {
          ...listaMotos[index],
          status: novoStatus,
          diagnostico: novoStatus === 'Moto em manutenção' ? diagnostico : null,
          dataUltimaAlteracao: new Date().toISOString(),
        };

        await AsyncStorage.setItem('motosCadastradas', JSON.stringify(listaMotos));
        
        Alert.alert(
          t('status_atualizado'),
          t('status_atualizado_sucesso'),
          [
            {
              text: 'OK',
              onPress: () => {
                limparBusca();
              }
            }
          ]
        );
      }
    } catch (error) {
      console.error('Erro ao salvar alterações:', error);
      Alert.alert(t('erro'), t('erro_salvar_alteracoes'));
    } finally {
      setSalvando(false);
    }
  };

  const limparBusca = () => {
    setPlaca('');
    setMotoEncontrada(null);
    setErro('');
    setNovoStatus('');
    setMostrarDiagnostico(false);
    setDiagnostico('');
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

  const pulseOpacity = animacaoValor.interpolate({
    inputRange: [0, 1],
    outputRange: [0.6, 1],
  });

  const StatusButton = ({ label, value, icon, color }) => {
    const isSelected = novoStatus === value;
    
    return (
      <TouchableOpacity
        style={[
          styles.statusButton,
          {
            backgroundColor: isSelected ? color + '20' : colors.cardBackground,
            borderColor: isSelected ? color : colors.border,
          }
        ]}
        onPress={() => handleStatusChange(value)}
        activeOpacity={0.7}
      >
        <View style={[styles.statusButtonIcon, { backgroundColor: color + '15' }]}>
          <Ionicons name={icon} size={28} color={color} />
        </View>
        <Text style={[
          styles.statusButtonText,
          { color: isSelected ? color : colors.text }
        ]}>
          {label}
        </Text>
        {isSelected && (
          <View style={[styles.selectedBadge, { backgroundColor: color }]}>
            <Ionicons name="checkmark" size={16} color="#fff" />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <View style={styles.headerContent}>
          <Ionicons name="pulse" size={32} color="#fff" />
          <Text style={styles.headerTitle}>{t('status_operacional')}</Text>
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
            
            <View style={[styles.currentStatusBadge, { backgroundColor: getStatusColor(motoEncontrada.status) + '20' }]}>
              <Text style={[styles.currentStatusLabel, { color: colors.textSecondary }]}>
                {t('status_atual')}
              </Text>
              <Text style={[styles.currentStatusText, { color: getStatusColor(motoEncontrada.status) }]}>
                {motoEncontrada.status}
              </Text>
            </View>
          </View>

          {/* Change Status Section */}
          <View style={styles.changeSection}>
            <View style={styles.changeSectionHeader}>
              <Ionicons name="swap-horizontal" size={24} color={colors.primary} />
              <Text style={[styles.changeSectionTitle, { color: colors.text }]}>
                {t('alterar_status_operacional')}
              </Text>
            </View>

            <StatusButton
              label={t('disponivel')}
              value="Moto normal com placa"
              icon="checkmark-circle"
              color="#00FF94"
            />

            <StatusButton
              label={t('em_manutencao')}
              value="Moto em manutenção"
              icon="construct"
              color="#FF3D71"
            />

            {/* Diagnóstico Field */}
            {mostrarDiagnostico && (
              <Animated.View style={[styles.diagnosticoContainer, { opacity: pulseOpacity }]}>
                <View style={styles.diagnosticoHeader}>
                  <Ionicons name="clipboard" size={20} color="#FF6B00" />
                  <Text style={[styles.diagnosticoLabel, { color: colors.text }]}>
                    {t('diagnostico_problema')}
                  </Text>
                </View>
                <TextInput
                  style={[styles.diagnosticoInput, { 
                    backgroundColor: colors.inputBackground, 
                    color: colors.text,
                    borderColor: colors.border
                  }]}
                  value={diagnostico}
                  onChangeText={setDiagnostico}
                  placeholder={t('descreva_problema_moto')}
                  placeholderTextColor={colors.textSecondary}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
                <Text style={[styles.diagnosticoHint, { color: colors.textSecondary }]}>
                  <Ionicons name="information-circle" size={14} /> {t('diagnostico_registrado_historico')}
                </Text>
              </Animated.View>
            )}

            {/* Save Button */}
            {novoStatus !== motoEncontrada.status && (
              <TouchableOpacity
                style={[styles.saveButton, { 
                  backgroundColor: salvando ? colors.inputBackground : colors.primary 
                }]}
                onPress={salvarAlteracoes}
                disabled={salvando}
                activeOpacity={0.8}
              >
                <Ionicons name={salvando ? "hourglass" : "save"} size={24} color="#fff" />
                <Text style={styles.saveButtonText}>
                  {salvando ? t('salvando') : t('salvar_alteracoes')}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Info Section */}
          <View style={styles.infoAlert}>
            <Ionicons name="alert-circle" size={20} color="#FFD600" />
            <Text style={[styles.infoAlertText, { color: colors.text }]}>
              {t('alteracao_registrada_historico')}
            </Text>
          </View>
        </View>
      )}

      {/* Empty State */}
      {!motoEncontrada && !erro && placa.length === 0 && (
        <View style={styles.emptyState}>
          <Animated.View style={{ opacity: pulseOpacity }}>
            <Ionicons name="settings-outline" size={80} color={colors.primary} />
          </Animated.View>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            {t('monitorar_status')}
          </Text>
          <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
            {t('digite_placa_visualizar_status')}
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
  currentStatusBadge: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  currentStatusLabel: {
    fontSize: 12,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  currentStatusText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  changeSection: {
    marginBottom: 20,
  },
  changeSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  changeSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 3,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  statusButtonIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  statusButtonText: {
    flex: 1,
    fontSize: 17,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  selectedBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  diagnosticoContainer: {
    marginTop: 8,
    marginBottom: 12,
  },
  diagnosticoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  diagnosticoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  diagnosticoInput: {
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    minHeight: 120,
    borderWidth: 2,
    marginBottom: 8,
  },
  diagnosticoHint: {
    fontSize: 13,
    fontStyle: 'italic',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 18,
    borderRadius: 12,
    marginTop: 8,
    shadowColor: '#01743A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  infoAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#FFD600' + '15',
    borderWidth: 2,
    borderColor: '#FFD600',
  },
  infoAlertText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
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
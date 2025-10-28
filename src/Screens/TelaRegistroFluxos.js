import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ContextTheme';
import { useTranslation } from 'react-i18next';

export default function TelaRegistroFluxos({ navigation }) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [tipoFluxo, setTipoFluxo] = useState('OPERADORES'); // OPERADORES ou MECANICOS
  const [motos, setMotos] = useState([]);
  const [fluxos, setFluxos] = useState([]);
  const [animacaoValor] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    carregarDados();
    iniciarAnimacao();

    const unsubscribe = navigation.addListener('focus', () => {
      carregarDados();
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    // Animar a transição entre abas
    Animated.spring(slideAnim, {
      toValue: tipoFluxo === 'OPERADORES' ? 0 : 1,
      useNativeDriver: true,
      friction: 8,
    }).start();
  }, [tipoFluxo]);

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

  const carregarDados = async () => {
    try {
      const motosSalvas = await AsyncStorage.getItem('motosCadastradas');
      const fluxosSalvos = await AsyncStorage.getItem('registroFluxos');
      
      if (motosSalvas) {
        setMotos(JSON.parse(motosSalvas));
      }
      
      if (fluxosSalvos) {
        setFluxos(JSON.parse(fluxosSalvos));
      } else {
        // Criar dados de exemplo se não houver
        const fluxosExemplo = gerarDadosExemplo();
        await AsyncStorage.setItem('registroFluxos', JSON.stringify(fluxosExemplo));
        setFluxos(fluxosExemplo);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  const gerarDadosExemplo = () => {
    const hoje = new Date();
    return {
      operadores: {
        associacoesHoje: Math.floor(Math.random() * 20) + 5,
        desassociacoesHoje: Math.floor(Math.random() * 15) + 2,
        totalAssociacoes: Math.floor(Math.random() * 100) + 50,
        totalDesassociacoes: Math.floor(Math.random() * 80) + 30,
        ultimaAtualizacao: hoje.toISOString(),
      },
      mecanicos: {
        motosEmManutencao: 0,
        tempoMedioManutencao: 0,
        manutencoesFinalizadas: Math.floor(Math.random() * 30) + 10,
        manutencoesEmAndamento: 0,
        ultimaAtualizacao: hoje.toISOString(),
      }
    };
  };

  // Calcular dados dos operadores
  const beaconsAssociados = motos.filter(m => m.codigoBeacon && m.codigoBeacon !== 'N/A').length;
  const beaconsDisponiveis = motos.filter(m => !m.codigoBeacon || m.codigoBeacon === 'N/A').length;
  const associacoesHoje = fluxos?.operadores?.associacoesHoje || 0;
  const desassociacoesHoje = fluxos?.operadores?.desassociacoesHoje || 0;

  // Calcular dados dos mecânicos
  const motosEmManutencao = motos.filter(m => 
    m.status?.toLowerCase().includes('manutenção') ||
    m.status?.toLowerCase().includes('manutencao') ||
    m.status?.toLowerCase().includes('acidente') ||
    m.status?.toLowerCase().includes('furto')
  );

  const tempoMedioManutencao = calcularTempoMedioManutencao(motosEmManutencao);

  function calcularTempoMedioManutencao(motosManutencao) {
    if (motosManutencao.length === 0) return 0;
    
    const agora = new Date();
    const tempos = motosManutencao.map(moto => {
      const dataCadastro = new Date(moto.dataCadastro);
      const diffMs = agora - dataCadastro;
      const diffHoras = Math.floor(diffMs / (1000 * 60 * 60));
      return diffHoras;
    });

    const soma = tempos.reduce((acc, tempo) => acc + tempo, 0);
    return Math.floor(soma / tempos.length);
  }

  const pulseOpacity = animacaoValor.interpolate({
    inputRange: [0, 1],
    outputRange: [0.7, 1],
  });

  const StatCard = ({ icon, label, value, color, unit }) => (
    <View style={[styles.statCard, { backgroundColor: colors.cardBackground, borderLeftColor: color }]}>
      <View style={[styles.statIcon, { backgroundColor: color + '15' }]}>
        <Ionicons name={icon} size={28} color={color} />
      </View>
      <View style={styles.statContent}>
        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{label}</Text>
        <View style={styles.statValueContainer}>
          <Animated.Text style={[styles.statValue, { color: colors.text, opacity: pulseOpacity }]}>
            {value}
          </Animated.Text>
          {unit && <Text style={[styles.statUnit, { color: colors.textSecondary }]}>{unit}</Text>}
        </View>
      </View>
      <View style={[styles.statGlow, { backgroundColor: color }]} />
    </View>
  );

  const ProgressBar = ({ label, current, total, color }) => {
    const percentage = total > 0 ? (current / total) * 100 : 0;
    
    return (
      <View style={styles.progressContainer}>
        <View style={styles.progressHeader}>
          <Text style={[styles.progressLabel, { color: colors.text }]}>{label}</Text>
          <Text style={[styles.progressValue, { color: color }]}>
            {current}/{total}
          </Text>
        </View>
        <View style={[styles.progressBarBg, { backgroundColor: colors.inputBackground }]}>
          <Animated.View 
            style={[
              styles.progressBarFill, 
              { 
                backgroundColor: color,
                width: `${percentage}%`,
                opacity: pulseOpacity
              }
            ]} 
          />
        </View>
        <Text style={[styles.progressPercentage, { color: colors.textSecondary }]}>
          {percentage.toFixed(1)}%
        </Text>
      </View>
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <View style={styles.headerContent}>
          <Ionicons name="clipboard" size={32} color="#fff" />
          <Text style={styles.headerTitle}>{t('registro_fluxos')}</Text>
        </View>
        <View style={styles.liveIndicator}>
          <Animated.View style={[styles.liveDot, { opacity: pulseOpacity }]} />
          <Text style={styles.liveText}>{t('live')}</Text>
        </View>
      </View>

      {/* Toggle Buttons */}
      <View style={[styles.toggleContainer, { backgroundColor: colors.cardBackground }]}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            tipoFluxo === 'OPERADORES' && [styles.toggleButtonActive, { backgroundColor: colors.primary }]
          ]}
          onPress={() => setTipoFluxo('OPERADORES')}
          activeOpacity={0.8}
        >
          <Ionicons 
            name="people" 
            size={22} 
            color={tipoFluxo === 'OPERADORES' ? '#fff' : colors.text} 
          />
          <Text style={[
            styles.toggleButtonText,
            { color: tipoFluxo === 'OPERADORES' ? '#fff' : colors.text }
          ]}>
            {t('operadores')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.toggleButton,
            tipoFluxo === 'MECANICOS' && [styles.toggleButtonActive, { backgroundColor: colors.primary }]
          ]}
          onPress={() => setTipoFluxo('MECANICOS')}
          activeOpacity={0.8}
        >
          <Ionicons 
            name="construct" 
            size={22} 
            color={tipoFluxo === 'MECANICOS' ? '#fff' : colors.text} 
          />
          <Text style={[
            styles.toggleButtonText,
            { color: tipoFluxo === 'MECANICOS' ? '#fff' : colors.text }
          ]}>
            {t('mecanicos')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content - Operadores */}
      {tipoFluxo === 'OPERADORES' && (
        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              <Ionicons name="today" size={20} color={colors.primary} /> {t('atividades_hoje')}
            </Text>

            <StatCard
              icon="add-circle"
              label={t('associacoes_realizadas')}
              value={associacoesHoje}
              color="#00FF94"
              unit="hoje"
            />

            <StatCard
              icon="remove-circle"
              label={t('desassociacoes_realizadas')}
              value={desassociacoesHoje}
              color="#FF3D71"
              unit="hoje"
            />
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              <Ionicons name="stats-chart" size={20} color={colors.primary} /> {t('status_geral')}
            </Text>

            <ProgressBar
              label={t('beacons_associados')}
              current={beaconsAssociados}
              total={motos.length}
              color="#00D9FF"
            />

            <ProgressBar
              label={t('beacons_disponiveis')}
              current={beaconsDisponiveis}
              total={motos.length}
              color="#9D4EDD"
            />
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              <Ionicons name="time" size={20} color={colors.primary} /> {t('historico_total')}
            </Text>

            <View style={styles.historicoContainer}>
              <View style={[styles.historicoCard, { backgroundColor: colors.cardBackground }]}>
                <Ionicons name="link" size={32} color="#00FF94" />
                <Text style={[styles.historicoValue, { color: colors.text }]}>
                  {fluxos?.operadores?.totalAssociacoes || 0}
                </Text>
                <Text style={[styles.historicoLabel, { color: colors.textSecondary }]}>
                  {t('total_associacoes')}
                </Text>
              </View>

              <View style={[styles.historicoCard, { backgroundColor: colors.cardBackground }]}>
                <Ionicons name="unlink" size={32} color="#FF3D71" />
                <Text style={[styles.historicoValue, { color: colors.text }]}>
                  {fluxos?.operadores?.totalDesassociacoes || 0}
                </Text>
                <Text style={[styles.historicoLabel, { color: colors.textSecondary }]}>
                  {t('total_desassociacoes')}
                </Text>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* Content - Mecânicos */}
      {tipoFluxo === 'MECANICOS' && (
        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              <Ionicons name="construct" size={20} color={colors.primary} /> {t('manutencoes_ativas')}
            </Text>

            <StatCard
              icon="build"
              label={t('motos_em_manutencao')}
              value={motosEmManutencao.length}
              color="#FFD600"
              unit={t('motos')}
            />

            <StatCard
              icon="time-outline"
              label={t('tempo_medio_manutencao')}
              value={tempoMedioManutencao}
              color="#FF6B00"
              unit={t('horas')}
            />
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              <Ionicons name="list" size={20} color={colors.primary} /> {t('motos_manutencao')}
            </Text>

            {motosEmManutencao.length > 0 ? (
              motosEmManutencao.map((moto, index) => {
                const horasManutencao = Math.floor(
                  (new Date() - new Date(moto.dataCadastro)) / (1000 * 60 * 60)
                );

                return (
                  <View 
                    key={moto.id} 
                    style={[styles.motoCard, { backgroundColor: colors.cardBackground }]}
                  >
                    <View style={[styles.motoIconContainer, { backgroundColor: '#FFD600' + '20' }]}>
                      <Ionicons name="bicycle" size={24} color="#FFD600" />
                    </View>
                    <View style={styles.motoInfo}>
                      <Text style={[styles.motoPlaca, { color: colors.text }]}>{moto.placa}</Text>
                      <Text style={[styles.motoModelo, { color: colors.textSecondary }]}>
                        {moto.modelo}
                      </Text>
                      <Text style={[styles.motoStatus, { color: '#FF3D71' }]}>
                        {moto.status}
                      </Text>
                    </View>
                    <View style={styles.motoTempo}>
                      <Ionicons name="time" size={20} color="#FF6B00" />
                      <Text style={[styles.motoTempoTexto, { color: colors.text }]}>
                        {horasManutencao}h
                      </Text>
                    </View>
                  </View>
                );
              })
            ) : (
              <View style={[styles.emptyState, { backgroundColor: colors.cardBackground }]}>
                <Ionicons name="checkmark-circle" size={48} color="#00FF94" />
                <Text style={[styles.emptyText, { color: colors.text }]}>
                  {t('nenhuma_moto_manutencao')}
                </Text>
                <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
                  {t('todas_motos_operacionais')}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              <Ionicons name="checkmark-done" size={20} color={colors.primary} /> {t('estatisticas_gerais')}
            </Text>

            <View style={styles.historicoContainer}>
              <View style={[styles.historicoCard, { backgroundColor: colors.cardBackground }]}>
                <Ionicons name="checkmark-circle" size={32} color="#00FF94" />
                <Text style={[styles.historicoValue, { color: colors.text }]}>
                  {fluxos?.mecanicos?.manutencoesFinalizadas || 0}
                </Text>
                <Text style={[styles.historicoLabel, { color: colors.textSecondary }]}>
                  {t('finalizadas')}
                </Text>
              </View>

              <View style={[styles.historicoCard, { backgroundColor: colors.cardBackground }]}>
                <Ionicons name="hourglass" size={32} color="#FFD600" />
                <Text style={[styles.historicoValue, { color: colors.text }]}>
                  {motosEmManutencao.length}
                </Text>
                <Text style={[styles.historicoLabel, { color: colors.textSecondary }]}>
                  {t('em_andamento')}
                </Text>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* Footer */}
      <View style={[styles.footer, { backgroundColor: colors.cardBackground }]}>
        <Ionicons name="information-circle" size={20} color={colors.primary} />
        <Text style={[styles.footerText, { color: colors.textSecondary }]}>
          {t('ultima_atualizacao')}: {new Date().toLocaleTimeString('pt-BR')}
        </Text>
      </View>
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
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00FF94',
  },
  liveText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  toggleContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
    borderRadius: 16,
    padding: 6,
    gap: 8,
  },
  toggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
  },
  toggleButtonActive: {
    shadowColor: '#01743A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  toggleButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  content: {
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    letterSpacing: 0.3,
  },
  statCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderRadius: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  statIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  statContent: {
    flex: 1,
  },
  statLabel: {
    fontSize: 14,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  statUnit: {
    fontSize: 14,
  },
  statGlow: {
    position: 'absolute',
    right: -30,
    top: -30,
    width: 100,
    height: 100,
    borderRadius: 50,
    opacity: 0.08,
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  progressValue: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  progressBarBg: {
    height: 12,
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 6,
  },
  progressPercentage: {
    fontSize: 12,
    textAlign: 'right',
    marginTop: 4,
  },
  historicoContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  historicoCard: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  historicoValue: {
    fontSize: 32,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  historicoLabel: {
    fontSize: 13,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  motoCard: {
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
  motoIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  motoInfo: {
    flex: 1,
  },
  motoPlaca: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  motoModelo: {
    fontSize: 14,
    marginBottom: 2,
  },
  motoStatus: {
    fontSize: 12,
    fontWeight: '600',
  },
  motoTempo: {
    alignItems: 'center',
    gap: 4,
  },
  motoTempoTexto: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyState: {
    padding: 40,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: 20,
    marginHorizontal: 20,
    marginVertical: 30,
    borderRadius: 12,
  },
  footerText: {
    fontSize: 14,
  },
});
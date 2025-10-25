import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ContextTheme';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');

export default function TelaDashboard({ navigation }) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [motos, setMotos] = useState([]);
  const [filtroStatus, setFiltroStatus] = useState('TODOS');
  const [animacaoValor] = useState(new Animated.Value(0));

  useEffect(() => {
    carregarDados();
    iniciarAnimacao();

    // Listener para recarregar dados quando a tela ganhar foco
    const unsubscribe = navigation.addListener('focus', () => {
      carregarDados();
    });

    return unsubscribe;
  }, [navigation]);

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
      if (motosSalvas) {
        const listaMotos = JSON.parse(motosSalvas);
        setMotos(listaMotos);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  // Cálculos de estatísticas
  const totalMotos = motos.length;
  
  const motosPorStatus = {
    manutencao: motos.filter(m => 
      m.status?.toLowerCase().includes('acidente') || 
      m.status?.toLowerCase().includes('furto') ||
      m.status?.toLowerCase().includes('manutenção') ||
      m.status?.toLowerCase().includes('manutencao')
    ).length,
    disponiveis: motos.filter(m => m.status === 'Moto normal com placa').length,
    emUso: motos.filter(m => m.status === 'Moto sem placa').length,
  };

  const beaconsDisponiveis = motos.filter(m => !m.codigoBeacon || m.codigoBeacon === 'N/A').length;
  const beaconsEmUso = motos.filter(m => m.codigoBeacon && m.codigoBeacon !== 'N/A').length;

  // Top 3 modelos mais cadastrados
  const modelosCount = motos.reduce((acc, moto) => {
    acc[moto.modelo] = (acc[moto.modelo] || 0) + 1;
    return acc;
  }, {});

  const topModelos = Object.entries(modelosCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  // Filtrar motos baseado no status selecionado
  const motosFiltradas = filtroStatus === 'TODOS' 
    ? motos 
    : filtroStatus === 'MANUTENÇÃO'
    ? motos.filter(m => 
        m.status?.toLowerCase().includes('acidente') || 
        m.status?.toLowerCase().includes('furto') ||
        m.status?.toLowerCase().includes('manutenção') ||
        m.status?.toLowerCase().includes('manutencao')
      )
    : filtroStatus === 'DISPONÍVEL'
    ? motos.filter(m => m.status === 'Moto normal com placa')
    : motos.filter(m => m.status === 'Moto sem placa');

  const pulseOpacity = animacaoValor.interpolate({
    inputRange: [0, 1],
    outputRange: [0.6, 1],
  });

  const MetricCard = ({ icon, title, value, color, subtext, small }) => (
    <View style={[
      small ? styles.metricCardSmall : styles.metricCard, 
      { backgroundColor: colors.cardBackground, borderColor: color }
    ]}>
      <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={small ? 24 : 28} color={color} />
      </View>
      <View style={styles.metricInfo}>
        <Text style={[styles.metricTitle, { color: colors.textSecondary }]}>{title}</Text>
        <Animated.Text style={[styles.metricValue, { color: color, opacity: pulseOpacity, fontSize: small ? 28 : 32 }]}>
          {value}
        </Animated.Text>
        {subtext && <Text style={[styles.metricSubtext, { color: colors.textSecondary }]}>{subtext}</Text>}
      </View>
      <View style={[styles.glowEffect, { backgroundColor: color }]} />
    </View>
  );

  const StatusFilter = ({ label, status, count }) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        {
          backgroundColor: filtroStatus === status ? colors.primary : colors.cardBackground,
          borderColor: filtroStatus === status ? colors.primary : colors.border,
        },
      ]}
      onPress={() => setFiltroStatus(status)}
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.filterText,
          { color: filtroStatus === status ? '#fff' : colors.text },
        ]}
      >
        {label}
      </Text>
      <View
        style={[
          styles.filterBadge,
          {
            backgroundColor: filtroStatus === status ? '#fff' : colors.primary,
          },
        ]}
      >
        <Text
          style={[
            styles.filterBadgeText,
            { color: filtroStatus === status ? colors.primary : '#fff' },
          ]}
        >
          {count}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <View style={styles.headerContent}>
          <Ionicons name="bar-chart" size={32} color="#fff" />
          <Text style={styles.headerTitle}>{t('dashboard_operacional')}</Text>
        </View>
        <View style={styles.liveIndicator}>
          <Animated.View style={[styles.liveDot, { opacity: pulseOpacity }]} />
          <Text style={styles.liveText}>{t('live')}</Text>
        </View>
      </View>

      {/* Métricas Principais */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          <Ionicons name="speedometer" size={20} color={colors.primary} /> {t('visao_geral')}
        </Text>
        
        <MetricCard
          icon="bicycle"
          title={t('total_motos')}
          value={totalMotos}
          color="#00D9FF"
          subtext={t('no_patio')}
        />

        <View style={styles.row}>
          <MetricCard
            icon="checkmark-circle"
            title={t('disponiveis')}
            value={motosPorStatus.disponiveis}
            color="#00FF94"
            small={true}
          />
          <MetricCard
            icon="time"
            title={t('em_uso')}
            value={motosPorStatus.emUso}
            color="#FFD600"
            small={true}
          />
        </View>

        <MetricCard
          icon="construct"
          title={t('em_manutencao')}
          value={motosPorStatus.manutencao}
          color="#FF3D71"
          subtext={t('requer_atencao')}
        />
      </View>

      {/* Filtros de Status */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          <Ionicons name="filter" size={20} color={colors.primary} /> {t('filtrar_por_status')}
        </Text>
        
        <View style={styles.filterContainer}>
          <StatusFilter label={t('todos')} status="TODOS" count={totalMotos} />
          <StatusFilter label={t('disponivel')} status="DISPONÍVEL" count={motosPorStatus.disponiveis} />
          <StatusFilter label={t('em_uso')} status="EM USO" count={motosPorStatus.emUso} />
          <StatusFilter label={t('manutencao')} status="MANUTENÇÃO" count={motosPorStatus.manutencao} />
        </View>

        <View style={[styles.resultadoFiltro, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.resultadoTexto, { color: colors.text }]}>
            {t('mostrando')}: <Text style={{ color: colors.primary, fontWeight: 'bold' }}>{motosFiltradas.length}</Text> {t('motos')}
          </Text>
        </View>
      </View>

      {/* Beacons */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          <Ionicons name="radio" size={20} color={colors.primary} /> {t('beacons')}
        </Text>
        
        <View style={styles.row}>
          <View style={[styles.beaconCard, { backgroundColor: colors.cardBackground, borderColor: '#00D9FF' }]}>
            <View style={[styles.beaconIcon, { backgroundColor: '#00D9FF20' }]}>
              <Ionicons name="bluetooth" size={32} color="#00D9FF" />
            </View>
            <Text style={[styles.beaconValue, { color: '#00D9FF' }]}>{beaconsDisponiveis}</Text>
            <Text style={[styles.beaconLabel, { color: colors.textSecondary }]}>{t('disponiveis')}</Text>
          </View>

          <View style={[styles.beaconCard, { backgroundColor: colors.cardBackground, borderColor: '#9D4EDD' }]}>
            <View style={[styles.beaconIcon, { backgroundColor: '#9D4EDD20' }]}>
              <Ionicons name="pulse" size={32} color="#9D4EDD" />
            </View>
            <Text style={[styles.beaconValue, { color: '#9D4EDD' }]}>{beaconsEmUso}</Text>
            <Text style={[styles.beaconLabel, { color: colors.textSecondary }]}>{t('em_uso')}</Text>
          </View>
        </View>
      </View>

      {/* Top Modelos */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          <Ionicons name="trophy" size={20} color={colors.primary} /> {t('top_3_modelos')}
        </Text>
        
        {topModelos.length > 0 ? (
          topModelos.map(([modelo, count], index) => (
            <View
              key={modelo}
              style={[
                styles.modeloCard,
                {
                  backgroundColor: colors.cardBackground,
                  borderLeftColor: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : '#CD7F32',
                },
              ]}
            >
              <View style={styles.modeloRank}>
                <Text style={[styles.rankNumber, { 
                  color: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : '#CD7F32' 
                }]}>
                  #{index + 1}
                </Text>
              </View>
              <View style={styles.modeloInfo}>
                <Text style={[styles.modeloNome, { color: colors.text }]}>{modelo}</Text>
                <Text style={[styles.modeloCount, { color: colors.textSecondary }]}>
                  {count} {count === 1 ? t('moto') : t('motos')}
                </Text>
              </View>
              <View style={[styles.modeloBadge, { backgroundColor: colors.primary }]}>
                <Ionicons name="star" size={18} color="#fff" />
              </View>
            </View>
          ))
        ) : (
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            {t('nenhum_modelo_cadastrado')}
          </Text>
        )}
      </View>

      {/* Footer Info */}
      <View style={[styles.footer, { backgroundColor: colors.cardBackground }]}>
        <Ionicons name="information-circle" size={20} color={colors.primary} />
        <Text style={[styles.footerText, { color: colors.textSecondary }]}>
          {t('dados_atualizados_tempo_real')}
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
  section: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    letterSpacing: 0.3,
  },
  metricCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 2,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  metricCardSmall: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    borderWidth: 2,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  metricInfo: {
    flex: 1,
  },
  metricTitle: {
    fontSize: 14,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  metricValue: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  metricSubtext: {
    fontSize: 12,
    marginTop: 2,
  },
  glowEffect: {
    position: 'absolute',
    right: -20,
    top: -20,
    width: 80,
    height: 80,
    borderRadius: 40,
    opacity: 0.1,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  filterContainer: {
    gap: 10,
  },
  filterButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
  },
  filterText: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  filterBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 32,
    alignItems: 'center',
  },
  filterBadgeText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  resultadoFiltro: {
    marginTop: 15,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  resultadoTexto: {
    fontSize: 16,
    fontWeight: '600',
  },
  beaconCard: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  beaconIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  beaconValue: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  beaconLabel: {
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  modeloCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  modeloRank: {
    width: 50,
    alignItems: 'center',
  },
  rankNumber: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  modeloInfo: {
    flex: 1,
    marginLeft: 10,
  },
  modeloNome: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  modeloCount: {
    fontSize: 14,
  },
  modeloBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    padding: 20,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 30,
    borderRadius: 12,
  },
  footerText: {
    fontSize: 14,
  },
});
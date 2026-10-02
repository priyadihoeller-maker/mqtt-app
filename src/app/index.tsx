import { useState } from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

type TxType = 'income' | 'expense';
type TabType = 'dashboard' | 'input' | 'history';

interface Category {
  name: string;
  icon: string;
  color: string;
}

interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: TxType;
  category: string;
  icon: string;
  date: string;
}

const EXPENSE_CATEGORIES: Category[] = [
  { name: 'Makan', icon: '🍔', color: '#f59e0b' },
  { name: 'Transport', icon: '⛽', color: '#3b82f6' },
  { name: 'Belanja', icon: '🛒', color: '#ec4899' },
  { name: 'Tagihan', icon: '💡', color: '#8b5cf6' },
  { name: 'Hiburan', icon: '🎮', color: '#06b6d4' },
];

const INCOME_CATEGORIES: Category[] = [
  { name: 'Gaji', icon: '💰', color: '#22c55e' },
  { name: 'Bonus', icon: '🎁', color: '#10b981' },
  { name: 'Investasi', icon: '📈', color: '#14b8a6' },
  { name: 'Lainnya', icon: '💵', color: '#64748b' },
];

export default function FinanceTrackerApp() {
  // STATE AUTH & NAVIGATION
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      title: 'Gaji Bulanan',
      amount: 3500000,
      type: 'income',
      category: 'Gaji',
      icon: '💰',
      date: 'Hari ini',
    },
    {
      id: '2',
      title: 'Makan Siang',
      amount: 45000,
      type: 'expense',
      category: 'Makan',
      icon: '🍔',
      date: 'Hari ini',
    },
  ]);

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TxType>('expense');
  const [selectedCategory, setSelectedCategory] = useState<Category>(EXPENSE_CATEGORIES[0]);
  const [filterTab, setFilterTab] = useState<'all' | 'income' | 'expense'>('all');

  const monthlyBudget = 2500000;

  // LOGIK LOGIN & LOGOUT
  const handleLogin = () => {
    if (!username.trim() || !password.trim()) {
      setLoginError('Username dan Password wajib diisi!');
      return;
    }
    // Simulasi Login Sukses
    setLoginError('');
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
  };

  const handleTypeChange = (newType: TxType) => {
    setType(newType);
    setSelectedCategory(newType === 'expense' ? EXPENSE_CATEGORIES[0] : INCOME_CATEGORIES[0]);
  };

  const handleAddTransaction = () => {
    if (!title.trim() || !amount.trim()) return;

    const newTx: Transaction = {
      id: Date.now().toString(),
      title: title.trim(),
      amount: parseFloat(amount) || 0,
      type: type,
      category: selectedCategory.name,
      icon: selectedCategory.icon,
      date: 'Hari ini',
    };

    setTransactions([newTx, ...transactions]);
    setTitle('');
    setAmount('');
    setActiveTab('history');
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(transactions.filter(item => item.id !== id));
  };

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;
  const budgetUsagePercent = Math.min(Math.round((totalExpense / monthlyBudget) * 100), 100);

  const filteredTransactions = transactions.filter(t => {
    if (filterTab === 'income') return t.type === 'income';
    if (filterTab === 'expense') return t.type === 'expense';
    return true;
  });

  const formatRupiah = (val: number) => 'Rp ' + val.toLocaleString('id-ID');

  // ==========================================
  // TAMPILAN 1: Halaman Login (Jika belum login)
  // ==========================================
  if (!isLoggedIn) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.loginContainer}>
          <Image
            source={{ uri: '/apple-touch-icon.png' }}
            style={styles.loginLogo}
          />
          <Text style={styles.loginTitle}>Finance Pro</Text>
          <Text style={styles.loginSubtitle}>Silakan masuk ke akun kamu</Text>

          {loginError ? <Text style={styles.errorText}>{loginError}</Text> : null}

          <View style={styles.loginCard}>
            <Text style={styles.inputLabel}>Username / Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Masukkan username"
              placeholderTextColor="#64748b"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />

            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Masukkan password"
              placeholderTextColor="#64748b"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            <TouchableOpacity style={styles.submitBtn} onPress={handleLogin}>
              <Text style={styles.submitBtnText}>Masuk Ke Dashboard</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // ==========================================
  // TAMPILAN 2: Main Dashboard (Jika sudah login)
  // ==========================================
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.contentContainer}>
        {/* ================= TAB 1: DASHBOARD / TABUNGAN ================= */}
        {activeTab === 'dashboard' && (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.topUserHeader}>
              <View>
                <Text style={styles.welcomeText}>Selamat Datang,</Text>
                <Text style={styles.usernameText}>{username || 'User'}</Text>
              </View>
              <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                <Text style={styles.logoutText}>Keluar 🚪</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.balanceCard}>
              <Text style={styles.balanceLabel}>Total Saldo Saat Ini</Text>
              <Text style={styles.balanceValue}>{formatRupiah(balance)}</Text>

              <View style={styles.summaryRow}>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>↓ Pemasukan</Text>
                  <Text style={[styles.summaryVal, { color: '#22c55e' }]}>
                    {formatRupiah(totalIncome)}
                  </Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>↑ Pengeluaran</Text>
                  <Text style={[styles.summaryVal, { color: '#ef4444' }]}>
                    {formatRupiah(totalExpense)}
                  </Text>
                </View>
              </View>

              <View style={styles.budgetSection}>
                <View style={styles.budgetHeader}>
                  <Text style={styles.budgetLabel}>Pengeluaran vs Batas Bulanan</Text>
                  <Text style={styles.budgetPercent}>{budgetUsagePercent}%</Text>
                </View>
                <View style={styles.budgetTrack}>
                  <View
                    style={[
                      styles.budgetBar,
                      {
                        width: `${budgetUsagePercent}%`,
                        backgroundColor: budgetUsagePercent > 85 ? '#ef4444' : '#3b82f6',
                      },
                    ]}
                  />
                </View>
              </View>
            </View>
          </ScrollView>
        )}

        {/* ================= TAB 2: INPUT TRANSAKSI ================= */}
        {activeTab === 'input' && (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Text style={styles.pageTitle}>Catat Transaksi Baru</Text>
            
            <View style={styles.formCard}>
              <View style={styles.typeSelector}>
                <TouchableOpacity
                  style={[styles.typeBtn, type === 'expense' && styles.typeBtnExpenseActive]}
                  onPress={() => handleTypeChange('expense')}
                >
                  <Text style={[styles.typeText, type === 'expense' && styles.activeTypeText]}>
                    💸 Pengeluaran
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.typeBtn, type === 'income' && styles.typeBtnIncomeActive]}
                  onPress={() => handleTypeChange('income')}
                >
                  <Text style={[styles.typeText, type === 'income' && styles.activeTypeText]}>
                    💵 Pemasukan
                  </Text>
                </TouchableOpacity>
              </View>

              <TextInput
                style={styles.input}
                placeholder="Keterangan (misal: Beli Kopi)"
                placeholderTextColor="#64748b"
                value={title}
                onChangeText={setTitle}
              />

              <TextInput
                style={styles.input}
                placeholder="Nominal Rp (misal: 25000)"
                placeholderTextColor="#64748b"
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
              />

              <Text style={styles.categoryLabel}>Pilih Kategori:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryContainer}>
                {(type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES).map(cat => {
                  const isSelected = selectedCategory.name === cat.name;
                  return (
                    <TouchableOpacity
                      key={cat.name}
                      style={[
                        styles.categoryChip,
                        isSelected && { backgroundColor: cat.color, borderColor: cat.color },
                      ]}
                      onPress={() => setSelectedCategory(cat)}
                    >
                      <Text style={styles.categoryIcon}>{cat.icon}</Text>
                      <Text style={[styles.categoryChipText, isSelected && { color: '#ffffff', fontWeight: 'bold' }]}>
                        {cat.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              <TouchableOpacity style={styles.submitBtn} onPress={handleAddTransaction}>
                <Text style={styles.submitBtnText}>Simpan Transaksi</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}

        {/* ================= TAB 3: RIWAYAT ================= */}
        {activeTab === 'history' && (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.historyHeader}>
              <Text style={styles.pageTitle}>Riwayat Transaksi</Text>
              <View style={styles.filterGroup}>
                <TouchableOpacity
                  style={[styles.filterBtn, filterTab === 'all' && styles.filterBtnActive]}
                  onPress={() => setFilterTab('all')}
                >
                  <Text style={styles.filterText}>Semua</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.filterBtn, filterTab === 'expense' && styles.filterBtnActive]}
                  onPress={() => setFilterTab('expense')}
                >
                  <Text style={styles.filterText}>Keluar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.filterBtn, filterTab === 'income' && styles.filterBtnActive]}
                  onPress={() => setFilterTab('income')}
                >
                  <Text style={styles.filterText}>Masuk</Text>
                </TouchableOpacity>
              </View>
            </View>

            {filteredTransactions.length === 0 ? (
              <Text style={styles.emptyText}>Belum ada riwayat transaksi.</Text>
            ) : (
              filteredTransactions.map(item => (
                <View key={item.id} style={styles.txCard}>
                  <View style={styles.txLeft}>
                    <View style={styles.iconCircle}>
                      <Text style={styles.txIcon}>{item.icon}</Text>
                    </View>
                    <View style={styles.txMeta}>
                      <Text style={styles.txTitle}>{item.title}</Text>
                      <Text style={styles.txSub}>
                        {item.category} • {item.date}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.txRight}>
                    <Text style={[styles.txAmount, { color: item.type === 'income' ? '#22c55e' : '#ef4444' }]}>
                      {item.type === 'income' ? '+' : '-'}{formatRupiah(item.amount)}
                    </Text>
                    <TouchableOpacity onPress={() => handleDeleteTransaction(item.id)}>
                      <Text style={styles.deleteText}>Hapus</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </ScrollView>
        )}
      </View>

      {/* ================= BOTTOM NAVIGATION BAR ================= */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('dashboard')}
        >
          <Text style={[styles.navIcon, activeTab === 'dashboard' && styles.activeNavIcon]}>📊</Text>
          <Text style={[styles.navText, activeTab === 'dashboard' && styles.activeNavText]}>Dashboard</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('input')}
        >
          <Text style={[styles.navIcon, activeTab === 'input' && styles.activeNavIcon]}>➕</Text>
          <Text style={[styles.navText, activeTab === 'input' && styles.activeNavText]}>Catat</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('history')}
        >
          <Text style={[styles.navIcon, activeTab === 'history' && styles.activeNavIcon]}>📜</Text>
          <Text style={[styles.navText, activeTab === 'history' && styles.activeNavText]}>Riwayat</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  contentContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 18,
    paddingBottom: 30,
  },
  // LOGIN STYLES
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  loginLogo: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignSelf: 'center',
    marginBottom: 12,
  },
  loginTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  loginSubtitle: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 24,
  },
  loginCard: {
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  inputLabel: {
    color: '#cbd5e1',
    fontSize: 12,
    marginBottom: 6,
  },
  errorText: {
    color: '#ef4444',
    textAlign: 'center',
    marginBottom: 12,
    fontSize: 13,
  },
  // TOP USER HEADER
  topUserHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 18,
  },
  welcomeText: {
    color: '#94a3b8',
    fontSize: 12,
  },
  usernameText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  logoutBtn: {
    backgroundColor: '#334155',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  logoutText: {
    color: '#f87171',
    fontSize: 12,
    fontWeight: '600',
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 8,
    marginBottom: 18,
  },
  balanceCard: {
    backgroundColor: '#1e293b',
    borderRadius: 22,
    padding: 20,
    marginBottom: 22,
    borderWidth: 1,
    borderColor: '#334155',
  },
  balanceLabel: {
    color: '#94a3b8',
    fontSize: 13,
  },
  balanceValue: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: 'bold',
    marginVertical: 6,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  summaryItem: {
    flex: 1,
  },
  summaryLabel: {
    color: '#94a3b8',
    fontSize: 12,
  },
  summaryVal: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 30,
    backgroundColor: '#334155',
    marginHorizontal: 12,
  },
  budgetSection: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  budgetLabel: {
    color: '#64748b',
    fontSize: 12,
  },
  budgetPercent: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: 'bold',
  },
  budgetTrack: {
    height: 8,
    backgroundColor: '#0f172a',
    borderRadius: 4,
    overflow: 'hidden',
  },
  budgetBar: {
    height: '100%',
    borderRadius: 4,
  },
  formCard: {
    backgroundColor: '#1e293b',
    borderRadius: 18,
    padding: 16,
    marginBottom: 22,
    borderWidth: 1,
    borderColor: '#334155',
  },
  typeSelector: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  typeBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#0f172a',
    marginHorizontal: 3,
  },
  typeBtnExpenseActive: {
    backgroundColor: '#ef4444',
  },
  typeBtnIncomeActive: {
    backgroundColor: '#22c55e',
  },
  typeText: {
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: '600',
  },
  activeTypeText: {
    color: '#ffffff',
  },
  input: {
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 12,
    color: '#ffffff',
    fontSize: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  categoryLabel: {
    color: '#94a3b8',
    fontSize: 12,
    marginBottom: 8,
  },
  categoryContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  categoryIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  categoryChipText: {
    color: '#94a3b8',
    fontSize: 12,
  },
  submitBtn: {
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  submitBtnText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  filterGroup: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    borderRadius: 10,
    padding: 2,
  },
  filterBtn: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  filterBtnActive: {
    backgroundColor: '#3b82f6',
  },
  filterText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '600',
  },
  txCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    padding: 14,
    borderRadius: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  txLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  txIcon: {
    fontSize: 20,
  },
  txMeta: {
    flex: 1,
  },
  txTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  txSub: {
    color: '#64748b',
    fontSize: 11,
    marginTop: 2,
  },
  txRight: {
    alignItems: 'flex-end',
  },
  txAmount: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  deleteText: {
    color: '#f43f5e',
    fontSize: 11,
    marginTop: 4,
  },
  emptyText: {
    color: '#64748b',
    textAlign: 'center',
    marginTop: 15,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    borderTopWidth: 1,
    borderTopColor: '#334155',
    paddingVertical: 10,
    paddingBottom: 16,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navIcon: {
    fontSize: 18,
    opacity: 0.5,
  },
  activeNavIcon: {
    opacity: 1,
  },
  navText: {
    color: '#64748b',
    fontSize: 11,
    marginTop: 2,
    fontWeight: '500',
  },
  activeNavText: {
    color: '#3b82f6',
    fontWeight: 'bold',
  },
});
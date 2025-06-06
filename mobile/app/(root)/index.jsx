import { useUser } from "@clerk/clerk-expo";
import { router, useRouter } from "expo-router";
import { Alert, FlatList, Image, RefreshControl, Text, TouchableOpacity, View } from "react-native";
import { useTransactions } from "../../hooks/useTransactions";
import { useEffect, useState } from "react";
import PageLoader from "../../components/PageLoader";
import { styles } from "../../assets/styles/home.style";
import Ionicon from "react-native-vector-icons/Ionicons";
import { SignOutButton } from "../../components/SignOutButton";
import BalanceCard from "../../components/BalanceCard";
import TransactionItem from "../../components/TransactionItem";
import NoTransactionFound from "../../components/NoTransactionFound";

export default function Page() {
  const router = useRouter();
  const { user } = useUser();
  const [refreshing, setRefreshing] = useState(false);

  const { transactions, summary, loadData, isLoading, deleteTransaction } =
    useTransactions(user?.id);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData().finally(() => {
      setRefreshing(false);
    });
  }

  useEffect(() => {
    loadData();
  }, [loadData, user?.id]);

  const handleDelete = (id) => {
    Alert.alert("Delete", "Are you sure you want to delete this transaction?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => deleteTransaction(id) },
    ]);
  }

  if (isLoading && !refreshing) {
    return <PageLoader />;
  }
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          {/* header left */}
          <View style={styles.headerLeft}>
            <Image
              style={styles.headerLogo}
              source={require("../../assets/images/avatar.png")}
              resizeMode="contain"
            />
            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeText}>Welcome,</Text>
              <Text style={styles.usernameText}>
                {user?.emailAddresses[0]?.emailAddress.split("@")[0]}
              </Text>
            </View>
          </View>

          {/* header right */}
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => {
                router.push("/create");
              }}
            >
              <Ionicon name="add" size={20} color="#fff" />
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
            <SignOutButton />
          </View>
        </View>

        {/* Balance card */}
        <BalanceCard summary={summary} />

        <View style={styles.transactionsHeaderContainer}>
          <Text style={styles.sectionTitle}>Recent Transaction</Text>
        </View>
      </View>
      {/* Transactions List */}
      <FlatList
        style={styles.transactionsList}
        contentContainerStyle={styles.transactionsListContent}
        data={transactions}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<NoTransactionFound/>}
        renderItem={({ item }) => ( 
          <TransactionItem item={item} onDelete={handleDelete}/>
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </View>
  );
}

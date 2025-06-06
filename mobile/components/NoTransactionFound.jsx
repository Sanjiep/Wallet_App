import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../assets/styles/home.style";
import { COLORS } from "../constants/colors";
import { useRouter } from "expo-router";

const NoTransactionFound = () => {
    const router = useRouter();
  return (
    <View style={styles.emptyState}>
      <Ionicons
        name="receipt-outline"
        size={60}
        color={COLORS.textLight}
        style={styles.emptyStateIcon}
      />
      <Text style={styles.emptyStateTitle}>No Transaction</Text>
      <Text style={styles.emptyStateText}>
        Start tracking your finances by adding your first transaction
      </Text>
      <TouchableOpacity
        style={styles.emptyStateButton}
        onPress={() => router.push("/create")}
      >
        <Ionicons name="add-circle-outline" size={20} color={COLORS.white} />
        <Text style={styles.emptyStateButtonText}>Add Transaction</Text>
      </TouchableOpacity>
    </View>
  );
};

export default NoTransactionFound;

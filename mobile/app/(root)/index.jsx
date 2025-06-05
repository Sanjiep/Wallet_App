import { useUser } from "@clerk/clerk-expo";
import { router } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { useTransactions } from "../../hooks/useTransactions";
import { useEffect } from "react";
import PageLoader from "../../components/PageLoader";
import { styles } from "../../assets/styles/home.style";
import Ionicon from "react-native-vector-icons/Ionicons";
import {SignOutButton} from "../../components/SignOutButton";

export default function Page() {
  const { user } = useUser();
  const { transactions, summary, loadData, isLoading, deleteTransaction } =
    useTransactions(user?.id);

  useEffect(() => {
    loadData();
  }, [loadData, user?.id]);

  if (isLoading) {
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
          <TouchableOpacity style={styles.addButton} onPress={() => {router.push("/create")}}>
            <Ionicon name="add" size={20} color="#fff"/>
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
          <SignOutButton/>
          </View>
        </View>
      </View>
    </View>
  );
}

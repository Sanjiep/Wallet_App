import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import { Link } from 'expo-router'
import { Text, View } from 'react-native'
import { SignOutButton } from '@/components/SignOutButton'
import { useTransactions } from '../../hooks/useTransactions'
import { useEffect } from 'react'

export default function Page() {
  const { user } = useUser()
  const {transactions, summary, loadData, isLoading, deleteTransaction} = useTransactions(user?.id)

  useEffect(() => {
    loadData()
  }, [loadData, user?.id])

  console.log('userId', user?.id);
  console.log('transaction', transactions);
  console.log('summary', summary);
  

  return (
    <View>
      <SignedIn>
        <Text>Hello {user?.emailAddresses[0].emailAddress}</Text>
        <Text>Total Income is {summary.income}</Text>
        <Text>Total Balance is {summary.balance}</Text>
        <Text>Total Expenses is {summary.expenses}</Text>
        <SignOutButton />
      </SignedIn>
      <SignedOut>
      </SignedOut>
    </View>
  )
}
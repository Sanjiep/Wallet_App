import * as React from "react";
import {
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useState } from "react";
import { styles } from "../../assets/styles/auth.style.js";
import { COLORS } from "../../constants/colors.js";
import { Ionicons } from "@expo/vector-icons";

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const inputs = [];
  const [error, setError] = useState("");

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) return;

    // Start sign-up process using email and password provided
    try {
      await signUp.create({
        emailAddress,
        password,
      });

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setPendingVerification(true);
    } catch (err) {
      const code = err?.errors?.[0]?.code;
      if (code === "form_param_format_invalid") {
        setError("Please enter a valid email address.");
      } else if (code === "form_password_pwned") {
        setError(
          "This password has been compromised in a data breach. Please choose a different password."
        );
      } else if (code === "form_password_length_too_short") {
        setError("Password must be at least 8 characters long.");
      } else if (code === "form_identifier_exists") {
        setError("An account with this email already exists.");
      } else if (code === "too_many_requests") {
        setError("Too many requests. Please try again in a bit.");
      } else {
        setError("An error occurred during sign-up. Please try again.");
      }
      // console.error(JSON.stringify(err, null, 2));
    }
  };

  // Handle submission of verification form
  const onVerifyPress = async () => {
    const otp = digits.join("");

    if (!isLoaded) return;

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code: otp
      });
      

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        router.replace("/");
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (err) {
      if (err.errors?.[0]?.code === "form_code_incorrect") {
        setError("Verification code is incorrect. Please try again.");
      } else if (err.errors?.[0]?.code === "form_param_nil") {
        setError("Enter code to verify your email.");
      } else if (err.errors?.[0]?.code === "client_state_invalid") {
        setError("Verification is incomplete or no longer valid. Please sign up again."
        );
        setPendingVerification(false);
      } else {
        setError("An error occurred during verification. Please try again.");
      }
      console.error(JSON.stringify(err, null, 2));
    }
  };

  if (pendingVerification) {
    return (
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.verificationContainer}>
            <Image
              style={styles.illustration}
              source={require("../../assets/images/auth.png")}
            />
            <Text style={styles.verificationTitle}>Verify your email</Text>

            {error ? (
              <View style={styles.errorBox}>
                <Ionicons
                  name="alert-circle"
                  size={20}
                  color={COLORS.expense}
                />
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity onPress={() => setError("")}>
                  <Ionicons name="close" size={20} color={COLORS.textLight} />
                </TouchableOpacity>
              </View>
            ) : null}
            <Text style={styles.verificationText}>
              We sent a verification code to {emailAddress}{" "}
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                marginBottom: 24,
              }}
            >
              {digits.map((digit, idx) => (
                <TextInput
                autoFocus ={idx === 0 && !pendingVerification}
                  key={idx}
                  ref={(ref) => (inputs[idx] = ref)}
                  style={{
                    width: 40,
                    height: 50,
                    borderWidth: 1,
                    borderColor: COLORS.border,
                    borderRadius: 8,
                    marginHorizontal: 6,
                    fontSize: 24,
                    textAlign: "center",
                    backgroundColor: COLORS.white,
                    color: COLORS.text,
                  }}
                  keyboardType="number-pad"
                  maxLength={1}
                  value={digit}
                  onChangeText={(text) => {
                    const newDigits = [...digits];
                    newDigits[idx] = text.replace(/[^0-9]/g, "");
                    setDigits(newDigits);

                    // Move to next input if not last and text entered
                    if (text && idx < 5) {
                      inputs[idx + 1]?.focus();
                    }
                    // Move to previous if deleted
                    if (!text && idx > 0) {
                      inputs[idx - 1]?.focus();
                    }
                  }}
                  onKeyPress={({ nativeEvent }) => {
                    if (
                      nativeEvent.key === "Backspace" &&
                      !digits[idx] &&
                      idx > 0
                    ) {
                      inputs[idx - 1]?.focus();
                    }
                  }}
                />
              ))}
            </View>
            <TouchableOpacity style={styles.button} onPress={onVerifyPress}>
              <Text style={styles.buttonText}>Verify</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <Image
            source={require("../../assets/images/sign-up.png")}
            style={styles.illustration}
          />
          <Text style={styles.title}>Create an Account</Text>

          {error ? (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={20} color={COLORS.expense} />
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity onPress={() => setError("")}>
                <Ionicons name="close" size={20} color={COLORS.textLight} />
              </TouchableOpacity>
            </View>
          ) : null}

          <TextInput
            style={[styles.input, error && styles.errorInput]}
            autoCapitalize="none"
            value={emailAddress}
            placeholder="example@mail.com"
            placeholderTextColor="#bdbdbd"
            onChangeText={(email) => {
              setEmailAddress(email);
              if (error) setError("");
            }}
          />
          <TextInput
            style={[styles.input, error && styles.errorInput]}
            value={password}
            placeholder="Password"
            placeholderTextColor="#bdbdbd"
            secureTextEntry={true}
            onChangeText={(password) => {
              setPassword(password);
              if (error) setError("");
            }}
          />
          <TouchableOpacity style={styles.button} onPress={onSignUpPress}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.linkText}>Sign in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

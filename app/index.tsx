import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, TextInput, TouchableOpacity, Image, Alert } from "react-native";
import { NavigationContainer, NavigationIndependentTree } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { initializeApp } from "@firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "@firebase/auth";
import { getFirestore, doc, getDoc, runTransaction, collection, query, where, getDocs, setDoc, Timestamp } from "@firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD4iapPT4rXMP_CmPe-yIfQm9PVgUcgqkw",
  authDomain: "bank-application-ca249.firebaseapp.com",
  projectId: "bank-application-ca249",
  storageBucket: "bank-application-ca249.appspot.com",
  messagingSenderId: "724398708214",
  appId: "1:724398708214:web:2b7a9f3aef0664f51e23d7",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

const Stack = createNativeStackNavigator();

function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        navigation.navigate("Bank App", { email: userData.email, min: userData.min });
      } else {
        Alert.alert("Error", "No user data found.");
      }
    } catch (error) {
      Alert.alert("Error", "Invalid email or password. Please try again.");
    }
  };

  return (
    <View style={styles.main}>
      <View style={styles.container}>
        <Text style={styles.heading}>Bank Application</Text>
        <Text style={styles.subText}>Login to your account</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={handleSignIn} style={styles.btnPrimary}>
          <Text style={styles.btnText}>Sign In</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
          <Text style={styles.btnTextSecondary}>Don't have an account? Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function SignupScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const data = { email, min: 1000, lastPaymentTime: 0 };
      const docRef = doc(db, "users", user.uid);
      await setDoc(docRef, data);

      Alert.alert("Success", "Account created successfully!");
      navigation.navigate("Login");
    } catch (error) {
      Alert.alert("Error", "Failed to create account. Please check your details.");
    }
  };

  return (
    <View style={styles.main}>
      <View style={styles.container}>
        <Text style={styles.heading}>Create Account</Text>
        <Text style={styles.subText}>Sign up for a new account</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={handleSignUp} style={styles.btnPrimary}>
          <Text style={styles.btnText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function WelcomeScreen({ route, navigation }) {
  const { email, min } = route.params;
  const [balance, setBalance] = useState(min);
  const [receiverEmail, setReceiverEmail] = useState("");
  const [amount, setAmount] = useState("");

  const applyCharges = async () => {
    const senderUid = auth.currentUser.uid;
    const senderRef = doc(db, "users", senderUid);
  
    try {
      await runTransaction(db, async (transaction) => {
        const senderDoc = await transaction.get(senderRef);
  
        if (!senderDoc.exists()) {
          throw new Error("User not found.");
        }
  
        const senderData = senderDoc.data();
        let senderBalance = senderData.min;
        const lastPaymentTime = senderData.lastPaymentTime;
        const currentTime = Timestamp.now();
        const timeDifference = Math.floor((currentTime.seconds - lastPaymentTime.seconds) / 60);
        const charges = 1; 
  
        if (timeDifference > 0 && senderBalance < 500) {
          const totalCharges = timeDifference * charges;
          senderBalance -= totalCharges;
  
          transaction.update(senderRef, {
            min: senderBalance,
            lastPaymentTime: currentTime,
          });
  
          setBalance(senderBalance);
        }
      });
    } catch (error) {
      console.error("Failed to apply charges:", error);
    }
  };
  
  useEffect(() => {
    const interval = setInterval(applyCharges, 60000); 
  }, []);

  const handleDeposit = async () => {
    const depositAmount = parseFloat(amount);
  
    if (!receiverEmail || isNaN(depositAmount) || depositAmount <= 0) {
      Alert.alert("Error", "Enter a valid receiver or amount.");
      return;
    }
  
    try {
      const senderUid = auth.currentUser.uid;
      const senderRef = doc(db, "users", senderUid);
  
      const receiverQuery = query(collection(db, "users"), where("email", "==", receiverEmail));
      const receiverSnapshot = await getDocs(receiverQuery);
  
      if (receiverSnapshot.empty) {
        Alert.alert("Error", "Receiver not found.");
        return;
      }
  
      const receiverRef = receiverSnapshot.docs[0].ref;
  
      await runTransaction(db, async (transaction) => {
        const senderDoc = await transaction.get(senderRef);
        const receiverDoc = await transaction.get(receiverRef);
  
        if (!senderDoc.exists() || !receiverDoc.exists()) {
          throw new Error("Account not found.");
        }
  
        const senderBalance = senderDoc.data().min;
  
        if (senderBalance < depositAmount) {
          throw new Error("Insufficient funds.");
        }
  
        transaction.update(senderRef, { min: senderBalance - depositAmount });
        transaction.update(receiverRef, { min: receiverDoc.data().min + depositAmount });
        transaction.update(senderRef, { lastPaymentTime: Timestamp.now() });
  
        setBalance(senderBalance - depositAmount);
      });
  
      Alert.alert("Success", "Deposit successful!");
      setReceiverEmail("");
      setAmount("");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };
  

  return (
    <View style={styles.main}>
      <View style={styles.header}>
        <Image
          style={styles.profileImage}
          source={{
            uri: "https://w7.pngwing.com/pngs/867/694/png-transparent-user-profile-default-computer-icons-network-video-recorder-avatar-cartoon-maker-blue-text-logo.png",
          }}
        />
        <Text style={styles.userName}>{email}</Text>
      </View>
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceText}>Available Balance</Text>
        <Text style={styles.balanceAmount}>₹ {balance}</Text>
      </View>
      <View style={styles.transactionContainer}>
        <TextInput
          style={styles.input}
          placeholder="Receiver's Email"
          value={receiverEmail}
          onChangeText={setReceiverEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Amount"
          value={amount}
          keyboardType="numeric"
          onChangeText={setAmount}
        />
        <TouchableOpacity onPress={handleDeposit} style={styles.btnPrimary}>
          <Text style={styles.btnText}>Send Money</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => navigation.navigate("Login")} style={styles.btnLogout}>
        <Text style={styles.btnLogoutText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function App() {
  return (
    <NavigationIndependentTree>
      <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignupScreen} />
        <Stack.Screen name="Bank App" component={WelcomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
    </NavigationIndependentTree>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent : 'center',
  },
  container: {
    width: "85%",
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
    textAlign: "center",
  },
  subText: {
    fontSize: 16,
    color: "#555",
    marginBottom: 20,
    textAlign: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#3572EF",
    marginBottom: 10,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  balanceContainer: {
    width: "90%",
    backgroundColor: "#3572EF",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  balanceText: {
    fontSize: 16,
    color: "#fff",
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 5,
  },
  transactionContainer: {
    width: "90%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
  },
  btnPrimary: {
    backgroundColor: "#3572EF",
    borderRadius: 5,
    padding: 15,
    alignItems: "center",
    marginBottom : 10
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign : 'center'
  },
  btnLogout: {
    marginTop: 20,
    backgroundColor: "#FF6B6B",
    borderRadius: 5,
    padding: 10,
    width: "90%",
    alignItems: "center",
  },
  btnLogoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  btnTextSecondary : {
    textAlign : 'center',
    marginTop : 10
  }
});
import React, { useState } from "react";
import { Text, View, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { NavigationContainer, NavigationIndependentTree } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { initializeApp } from "@firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "@firebase/auth";
import { getFirestore, doc, getDoc, runTransaction, collection, query, where, getDocs, setDoc } from "@firebase/firestore";

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
        alert("No user data found.");
      }
    } catch (error) {
      alert("Invalid email or password. Please try again.");
    }
  };

  return (
    <View style={styles.main}>
      <View style={styles.container}>
        <Text style={styles.text}>Login</Text>
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
        <TouchableOpacity onPress={handleSignIn} style={styles.btn}>
          <Text style={styles.txt}>Sign In</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("SignUp")} style={styles.btn}>
          <Text style={styles.txt}>Sign Up</Text>
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

      const data = { email, min: 1000 };

      const docRef = doc(db, "users", user.uid);
      await setDoc(docRef, data);

      alert("Account created successfully!");
      navigation.navigate("Login");
    } catch (error) {
      alert("Failed to create account. Please check your details.");
    }
  };

  return (
    <View style={styles.main}>
      <View style={styles.container}>
        <Text style={styles.text}>Sign Up</Text>
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
        <TouchableOpacity onPress={handleSignUp} style={styles.btn}>
          <Text style={styles.txt}>Sign Up</Text>
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

  const handleDeposit = async () => {
    const depositAmount = parseFloat(amount);

    if (!receiverEmail || isNaN(depositAmount) || depositAmount <= 0) {
      alert("Enter a valid receiver or amount.");
      return;
    }

    if (receiverEmail === email) {
      alert("Cannot transfer to the same account.");
      return;
    }

    try {
      const senderUid = auth.currentUser.uid;
      const senderRef = doc(db, "users", senderUid);

      const receiverQuery = query(collection(db, "users"), where("email", "==", receiverEmail));
      const receiverSnapshot = await getDocs(receiverQuery);

      if (receiverSnapshot.empty) {
        alert("Receiver not found.");
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
        const receiverBalance = receiverDoc.data().min;

        if (senderBalance < depositAmount) {
          throw new Error("Insufficient funds.");
        }

        transaction.update(senderRef, { min: senderBalance - depositAmount });
        transaction.update(receiverRef, { min: receiverBalance + depositAmount });
        setBalance(senderBalance - depositAmount);
      });

      alert("Deposit successful!");
      setReceiverEmail("");
      setAmount("");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <View style={styles.main}>
      <Text style={styles.text}>{email}</Text>
      <Text style={styles.text}>Balance: ₹ {balance}</Text>
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
      <TouchableOpacity onPress={handleDeposit} style={styles.btn}>
        <Text style={styles.txt}>Deposit</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Login")} style={styles.btn}>
        <Text style={styles.txt}>Log Out</Text>
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
      justifyContent: "center",
      alignItems: "center",
    },
    container: {
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 2,
      borderRadius: 5,
      width: 300,
      height: 300,
      backgroundColor: "skyblue",
      padding: 20,
      borderColor: "skyblue",
    },
    text: {
      fontSize: 25,
      color: "black",
      fontWeight: "bold",
      marginBottom: 20,
    },
    input: {
      margin: 12,
      borderWidth: 2,
      borderRadius: 8,
      width: 250,
      padding: 8,
      backgroundColor: "white",
      borderColor: "white",
    },
    btn: {
      marginTop: 10,
      marginBottom: 15,
      backgroundColor: "#3572EF",
      borderRadius: 3,
    },
    txt: {
      textAlign: "center",
      fontSize: 20,
      width: 80,
      height: 30,
      color: "lightgrey",
    },
  });
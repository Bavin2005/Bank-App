import React, { useState } from "react";
import { Text, View, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { NavigationContainer, NavigationIndependentTree } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { initializeApp } from "@firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "@firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD4iapPT4rXMP_CmPe-yIfQm9PVgUcgqkw",
  authDomain: "bank-application-ca249.firebaseapp.com",
  projectId: "bank-application-ca249", 
  storageBucket: "bank-application-ca249.appspot.com",
  messagingSenderId: "724398708214",
  appId: "1:724398708214:web:2b7a9f3aef0664f51e23d7",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app); 

const Stack = createNativeStackNavigator();

function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("User signed in:", userCredential.user);
      navigation.navigate("Bank App");
      console.log(email)
    } catch (error) {
      console.error("Error signing in:", error.message);
      alert(error.message);
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
        <TouchableOpacity onPress={handleSignIn} style = {styles.btn}>
          <Text style={styles.txt}>Sign In</Text>
          </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("SignUp")} style = {styles.btn}>
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
      console.log("User signed up:", userCredential.user);
      alert("Account created successfully!");
      navigation.navigate("Login");
    } catch (error) {
      console.error("Error signing up:", error.message);
      alert(error.message);
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
        <TouchableOpacity onPress={handleSignUp} style = {styles.btn}>
          <Text style={styles.txt}>Sign Up</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.txt}>Back to Login</Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );
}

function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.main}>
      <Text style={styles.text}>Welcome to the App!</Text>
      <TouchableOpacity onPress={() => navigation.navigate("Login")}style = {styles.btn}>
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
    borderColor : 'skyblue'
  },
  text: {
    fontSize: 25,
    color: "white",
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
    borderColor : 'white'
  },

  btn : {
    marginTop : 10,
    marginBottom  : 15,
    backgroundColor : '#3572EF',
    borderRadius : 3
  },

  txt :{
    textAlign : 'center',
    fontSize : 20,
    //fontWeight : 'bold',
    width : 80,
    height : 30,
    color : 'lightgrey'
  }
});

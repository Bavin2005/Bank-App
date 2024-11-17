// import React, { useState } from "react";
// import { View, Text, Button, StyleSheet, TextInput } from "react-native";
// import { initializeApp } from "@firebase/app";
// import { getAuth, createUserWithEmailAndPassword } from "@firebase/auth";

// // Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyD4iapPT4rXMP_CmPe-yIfQm9PVgUcgqkw",
//   authDomain: "bank-application-ca249.firebaseapp.com",
//   projectId: "bank-application-ca249",
//   storageBucket: "bank-application-ca249.appspot.com",
//   messagingSenderId: "724398708214",
//   appId: "1:724398708214:web:2b7a9f3aef0664f51e23d7",
// };

// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);

// export default function Signup({ navigation }) {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleSignUp = async () => {
//     try {
//       const userCredential = await createUserWithEmailAndPassword(
//         auth,
//         email,
//         password
//       );
//       console.log("User created:", userCredential.user);
//       alert("Sign-up successful!");
//       navigation.navigate("Login");
//     } catch (error) {
//       console.error("Error signing up:", error.message);
//       alert(error.message); // Provide feedback to the user
//     }
//   };

//   return (
//     <View style={styles.main}>
//       <View style={styles.container}>
//         <Text style={styles.text}>Sign Up</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="Name"
//           value={name}
//           onChangeText={setName}
//         />
//         <TextInput
//           style={styles.input}
//           placeholder="Email"
//           value={email}
//           onChangeText={setEmail}
//         />
//         <TextInput
//           style={styles.input}
//           placeholder="Password"
//           secureTextEntry
//           value={password}
//           onChangeText={setPassword}
//         />
//         <Button title="Sign Up" onPress={handleSignUp} />
//         <Button title="Back to Login" onPress={() => navigation.navigate("Login")} />
//       </View>
//     </View> 
//   );
// }

// const styles = StyleSheet.create({
//   main: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   container: {
//     justifyContent: "center",
//     alignItems: "center",
//     borderWidth: 2,
//     borderRadius: 5,
//     width: 300,
//     backgroundColor: "skyblue",
//     padding: 20,
//     borderColor: "skyblue",
//   },
//   text: {
//     fontSize: 25,
//     color: "black",
//     fontWeight: "bold",
//     marginBottom: 20,
//   },
//   input: {
//     margin: 12,
//     borderWidth: 2,
//     borderRadius: 8,
//     width: 250,
//     padding: 8,
//     backgroundColor: "white",
//     borderColor: "white",
//   },
// });

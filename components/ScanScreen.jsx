import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';

export default function ScanScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [cameraRef, setCameraRef] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setSelectedImage(result.uri);
    }
  };

  // ... rest of your code

  return (
    <View style={styles.container}>
      {selectedImage ? (
        <Image source={{ uri: selectedImage }} style={styles.image} />
      ) : (
        <Camera style={styles.camera} type={type} ref={ref => setCameraRef(ref)}>
          {/* ... your camera buttons */}
        </Camera>
      )}
      <TouchableOpacity
        style={styles.button}
        onPress={pickImage}>
        <Text style={styles.text}> Pick Image </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  // ... your existing styles
  image: {
    width: '100%',
    height: 200,
    marginBottom: 20,
  },
});
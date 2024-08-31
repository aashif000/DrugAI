import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, Button, ScrollView, ActivityIndicator, Modal, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { Card } from 'react-native-paper';

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [drugData, setDrugData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDrugData = async () => {
    if (searchQuery.trim() === '') return;

    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('https://drug-info-and-price-history.p.rapidapi.com/1/druginfo', {
        headers: {
          'x-rapidapi-key': 'c1cb0f53d8msh2a7e3341abfe922p1e612ejsn04a388bcecf7',
          'x-rapidapi-host': 'drug-info-and-price-history.p.rapidapi.com'
        },
        params: {
          drug: searchQuery,
        },
      });
      setDrugData(response.data);
    } catch (error) {
      console.error(error);
      setError('Failed to fetch drug data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const renderDrugItem = ({ item }) => (
    <Card style={styles.card}>
      <ScrollView>
        <Text style={styles.drugName}>Brand Name: {item.brand_name}</Text>
        <Text style={styles.boldText}>Generic Name: </Text><Text>{item.generic_name}</Text>
        <Text style={styles.boldText}>Labeler Name: </Text><Text>{item.labeler_name}</Text>
        {/*<Text style={styles.boldText}>Active Ingredients: </Text><Text>{item.active_ingredients.map(ai => ai.name).join(', ')}</Text>*/}
        <Text style={styles.boldText}>Finished: </Text><Text>{item.finished ? 'Yes' : 'No'}</Text>
        <Text style={styles.boldText}>Dosage Form: </Text><Text>{item.dosage_form}</Text>
        {/*<Text style={styles.boldText}>Route: </Text><Text>{item.route.join(', ')}</Text>*/}
        <Text style={styles.boldText}>Marketing Category: </Text><Text>{item.openfda.marketing_category}</Text>
        <Text style={styles.boldText}>Product Type: </Text><Text>{item.product_type}</Text>
        <Text style={styles.boldText}>Marketing Start Date: </Text><Text>{item.marketing_start_date}</Text>
        <Text style={styles.boldText}>Listing Expiration Date: </Text><Text>{item.listing_expiration_date}</Text>
        <Text style={styles.boldText}>Product ID: </Text><Text>{item.product_id}</Text>
        <Text style={styles.boldText}>Application Number: </Text><Text>{item.application_number}</Text>
        {/*<Text style={styles.boldText}>Pharmacological Class: </Text><Text>{item.pharm_class.join(', ')}</Text>*/}
      </ScrollView>
    </Card>
  );

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search for a drug"
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.searchBar}
      />
      <Button title="Search" onPress={fetchDrugData} disabled={loading} color="#2196F3" />
      {loading ? (
        <ActivityIndicator size="large" color="#2196F3" />
      ) : (
        <FlatList
          data={drugData}
          renderItem={renderDrugItem}
          keyExtractor={(item) => item.product_ndc}
          contentContainerStyle={styles.list}
        />
      )}
      <Modal
        visible={!!error}
        transparent
        animationType="fade"
        onRequestClose={() => setError(null)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Error</Text>
            <Text style={styles.modalMessage}>{error}</Text>
            <TouchableOpacity onPress={() => setError(null)} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  searchBar: {
    padding: 12,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  list: { paddingBottom: 16 },
  card: {
    padding: 16,
    marginBottom: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  drugName: { fontSize: 20, fontWeight: 'bold', marginBottom: 4 },
  boldText: { fontWeight: 'bold' },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Image, TextInput } from 'react-native';
import axios from 'axios';
import { Card, Button as PaperButton } from 'react-native-paper'; // Correct imports

interface Article {
  source: {
    id: string | null;
    name: string;
  };
  author: string;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  content: string;
}

const popularDrugs = [
  { id: '1', name: 'Aspirin' },
  { id: '2', name: 'Ibuprofen' },
  { id: '3', name: 'Paracetamol' },
  // Add more drugs as needed
];

export default function HomePage() {
  // States for Article Fetching
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [category] = useState<string>('health'); // Default category
  const [country] = useState<string>('in'); // Default country

  // States for BMI Calculator
  const [height, setHeight] = useState<string>('');
  const [weight, setWeight] = useState<string>('');

  // States for Drug Half-Life Calculator
  const [halfLife, setHalfLife] = useState<string>('');
  const [halfLifeTime, setHalfLifeTime] = useState<string>('');
  const [clearanceData, setClearanceData] = useState<{ percentage: string; time: string }[]>([]);

  // Fetch Articles
  const fetchArticles = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://saurav.tech/NewsAPI/top-headlines/category/${category}/${country}.json`);
      setArticles(response.data.articles);
    } catch (error) {
      console.error(error);
      alert('Error fetching articles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [category, country]);

  // BMI Calculation
  const calculateBMI = () => {
    const h = parseFloat(height) / 100;
    const w = parseFloat(weight);
    if (h && w) {
      return (w / (h * h)).toFixed(2);
    }
    return '';
  };

  // Drug Half-Life Calculation
  const calculateClearance = () => {
    const halfLifeValue = parseFloat(halfLife);
    const timeUnit = halfLifeTime.toLowerCase();

    if (halfLifeValue && (timeUnit === 'hrs' || timeUnit === 'days')) {
      const results = [];
      for (let i = 0; i <= 10; i++) {
        const time = i * halfLifeValue;
        const percentage = (100 * Math.pow(0.5, i)).toFixed(2);
        results.push({ percentage, time: `${time} ${timeUnit}` });
      }
      setClearanceData(results);
    }
  };

  const renderArticleItem = ({ item }: { item: Article }) => (
    <Card style={styles.card}>
      
      <Text style={styles.articleTitle}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <Text style={styles.publishedAt}>Published At: {new Date(item.publishedAt).toLocaleDateString()}</Text>
    </Card>
  );

  return (
    <FlatList
      ListHeaderComponent={
        <View style={styles.headerContainer}>
          <Text style={styles.title}>DrugAI</Text>


          <Card style={styles.card}>
            <Text style={styles.cardTitle}>BMI Calculator</Text>
            <TextInput
              placeholder="Height (cm)"
              value={height}
              onChangeText={setHeight}
              keyboardType="numeric"
              style={styles.input}
            />
            <TextInput
              placeholder="Weight (kg)"
              value={weight}
              onChangeText={setWeight}
              keyboardType="numeric"
              style={styles.input}
            />
            <PaperButton mode="contained" onPress={() => {}}>
              <Text style={styles.result}>Your BMI is: {calculateBMI()}</Text>
            </PaperButton>
          </Card>

          <Card style={styles.card}>
            <Text style={styles.cardTitle}>Drug Half-Life Calculator</Text>
            <TextInput
              placeholder="Enter Half Life"
              value={halfLife}
              onChangeText={setHalfLife}
              keyboardType="numeric"
              style={styles.input}
            />
            <TextInput
              placeholder="Select Time Unit (hrs/days)"
              value={halfLifeTime}
              onChangeText={setHalfLifeTime}
              style={styles.input}
            />
            <PaperButton mode="contained" onPress={calculateClearance}>
              Calculate Clearance
            </PaperButton>
            {clearanceData.length > 0 && (
              <View style={styles.clearanceResult}>
                {clearanceData.map((data, index) => (
                  <Text key={index} style={styles.clearanceText}>
                    {data.percentage} - {data.time}
                  </Text>
                ))}
                <Text style={styles.disclaimer}>
                  This is an estimate of how long it will take for a drug to be removed from your body. Actual half-life may vary.
                </Text>
              </View>
            )}
          </Card>
          <Text style={styles.Articles}> Articles </Text>
        </View>
        
      }
      
      data={articles}
      renderItem={renderArticleItem}
      keyExtractor={(item) => item.url}
      ListFooterComponent={loading ? <ActivityIndicator size="large" color="#0000ff" /> : null}
      contentContainerStyle={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  Articles:{fontSize:28, display:'flex', alignItems: 'center', justifyContent: 'center',},
  container: { padding: 16 },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 16, marginLeft: 125 },
  headerContainer: { marginBottom: 16 },
  card: { marginBottom: 16, padding: 16 },
  cardTitle: { fontSize: 20, marginBottom: 8 },
  drugList: { flexDirection: 'row', marginBottom: 16 },
  drugCard: { padding: 16, marginRight: 8, backgroundColor: '#f8f8f8', borderRadius: 8 },
  drugName: { fontSize: 18 },
  articleTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  description: { fontSize: 16, marginBottom: 8 },
  publishedAt: { fontSize: 14, color: '#777', marginBottom: 8 },
  input: { marginBottom: 16, borderBottomWidth: 1, borderBottomColor: '#ccc', padding: 8 },
  result: { fontSize: 18, fontWeight: 'bold' },
  clearanceResult: { marginTop: 16 },
  clearanceText: { fontSize: 16 },
  disclaimer: { fontSize: 12, color: '#777', marginTop: 8 },
});
